// Cloudflare GraphQL Analytics API — R2 operation metrics
// Docs: https://developers.cloudflare.com/analytics/graphql-api/

const CF_GRAPHQL_ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";

// Class A ops — mutating / write operations (1M free / month, $4.50 per M over)
const CLASS_A_OPS = new Set([
  "ListBuckets", "PutBucket",
  "ListObjects", "ListObjectsV2",
  "PutObject", "CopyObject",
  "CreateMultipartUpload", "CompleteMultipartUpload",
  "ListMultipartUploads", "UploadPart", "UploadPartCopy", "ListParts",
  "PutBucketEncryption", "PutBucketCors", "PutBucketLifecycleConfiguration",
]);

// Class B ops — read operations (10M free / month, $0.36 per M over)
const CLASS_B_OPS = new Set([
  "HeadBucket", "HeadObject", "GetObject",
  "UsageSummary",
  "GetBucketEncryption", "GetBucketLocation",
  "GetBucketCors", "GetBucketLifecycleConfiguration",
]);

// Free ops — never billed
// DeleteObject, DeleteObjects, AbortMultipartUpload → everything else

export type R2Analytics = {
  classA: number;
  classB: number;
  free: number;
  byAction: Record<string, number>;
  periodStart: string;
  periodEnd: string;
  error?: string;
  rawError?: unknown;
};

export async function getR2Analytics(): Promise<R2Analytics> {
  const accountId = process.env.CF_ACCOUNT_ID?.trim();
  const apiToken = process.env.CF_API_TOKEN?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim();

  // Start of current month in UTC
  const now = new Date();
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const periodEnd = now.toISOString();

  const empty = (error: string, rawError?: unknown): R2Analytics => ({
    classA: 0,
    classB: 0,
    free: 0,
    byAction: {},
    periodStart,
    periodEnd,
    error,
    rawError,
  });

  if (!accountId || !apiToken) {
    return empty("Missing CF_ACCOUNT_ID or CF_API_TOKEN in .env");
  }

  // Use proper GraphQL variables instead of string interpolation
  const query = `
    query GetR2Operations(
      $accountTag: string!
      $startDate: Time!
      $endDate: Time!
    ) {
      viewer {
        accounts(filter: { accountTag: $accountTag }) {
          r2OperationsAdaptiveGroups(
            filter: {
              datetime_geq: $startDate
              datetime_leq: $endDate
            }
            limit: 10000
            orderBy: [sum_requests_DESC]
          ) {
            sum { requests }
            dimensions { actionType bucketName }
          }
        }
      }
    }
  `;

  const variables = {
    accountTag: accountId,
    startDate: periodStart,
    endDate: periodEnd,
  };

  try {
    const res = await fetch(CF_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return empty(`Cloudflare API returned HTTP ${res.status}: ${text.slice(0, 200)}`);
    }

    const json = await res.json();

    // Cloudflare always returns 200 — errors live in json.errors
    if (json.errors?.length) {
      const msg = json.errors.map((e: any) => e.message).join("; ");
      return empty(`GraphQL error: ${msg}`, json.errors);
    }

    const groups: any[] =
      json?.data?.viewer?.accounts?.[0]?.r2OperationsAdaptiveGroups ?? [];

    let classA = 0;
    let classB = 0;
    let free = 0;
    const byAction: Record<string, number> = {};

    for (const group of groups) {
      const action: string = group.dimensions?.actionType ?? "Unknown";
      const groupBucket: string = group.dimensions?.bucketName ?? "";
      const count: number = group.sum?.requests ?? 0;

      // If we know the bucket name, skip rows from other buckets
      if (bucketName && groupBucket && groupBucket !== bucketName) {
        continue;
      }

      byAction[action] = (byAction[action] ?? 0) + count;

      if (CLASS_A_OPS.has(action)) {
        classA += count;
      } else if (CLASS_B_OPS.has(action)) {
        classB += count;
      } else {
        free += count;
      }
    }

    return { classA, classB, free, byAction, periodStart, periodEnd };
  } catch (err: any) {
    return empty(err?.message ?? "Network error fetching Cloudflare analytics.", err);
  }
}

