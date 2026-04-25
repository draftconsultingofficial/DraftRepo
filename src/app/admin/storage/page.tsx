import { requireMainAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { listR2Objects } from "@/lib/r2";
import { ApplicationModel } from "@/models/Application";
import { formatDate } from "@/lib/format";
import { SafeDelete } from "@/components/admin/delete-action";
import { deleteR2ObjectAction } from "@/server/storage-actions";

export const dynamic = "force-dynamic";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function pct(used: number, limit: number) {
  return Math.min(100, Math.round((used / limit) * 100));
}

const STORAGE_LIMIT_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB

export default async function StoragePage() {
  await requireMainAdmin();
  await connectToDatabase();

  const [r2Objects, applications] = await Promise.all([
    listR2Objects("resumes/"),
    ApplicationModel.find({}, { resumeKey: 1, name: 1, email: 1, jobTitle: 1, createdAt: 1 }).lean(),
  ]);

  const linkedKeys = new Set(applications.map((a) => a.resumeKey));
  const appsByKey = new Map(applications.map((a) => [a.resumeKey, a]));

  const totalSize = r2Objects.reduce((sum, obj) => sum + obj.size, 0);
  const orphanCount = r2Objects.filter((obj) => !linkedKeys.has(obj.key)).length;

  const accountId = process.env.CF_ACCOUNT_ID;
  const bucketName = process.env.R2_BUCKET_NAME;
  const dashboardUrl = accountId && bucketName
    ? `https://dash.cloudflare.com/${accountId}/r2/default/buckets/${bucketName}/metrics`
    : "https://dash.cloudflare.com/?to=/:account/r2/default/buckets";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Storage</p>
        <h1 className="mt-2 font-semibold text-4xl text-gray-900">R2 Storage Manager</h1>
        <p className="mt-3 text-base text-gray-600">
          All files stored in Cloudflare R2. Manage and clean up resume objects directly from here.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="admin-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Objects</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{r2Objects.length}</p>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Storage Used</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatBytes(totalSize)}</p>
          <div className="mt-2 h-1.5 rounded-full bg-gray-100">
            <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct(totalSize, STORAGE_LIMIT_BYTES)}%` }} />
          </div>
          <p className="mt-1 text-xs text-gray-400">{pct(totalSize, STORAGE_LIMIT_BYTES)}% of 10 GB free tier</p>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Orphaned Files</p>
          <p className={`mt-2 text-3xl font-bold ${orphanCount > 0 ? "text-red-600" : "text-green-600"}`}>
            {orphanCount}
          </p>
          <p className="mt-1 text-xs text-gray-400">Not linked to any application</p>
        </div>
      </div>

      {/* Usage Note */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-blue-900">Check live Class A / B operation usage</p>
          <p className="text-xs text-blue-700 leading-relaxed max-w-xl">
            R2 free tier includes <strong>1M Class A ops</strong> (PUT, LIST) and <strong>10M Class B ops</strong> (GET, HEAD) per month.
            Actual usage counts are available directly on the Cloudflare dashboard under your bucket's Metrics tab.
          </p>
        </div>
        <a
          href={dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Open Cloudflare R2 Metrics →
        </a>
      </div>

      {/* File List */}
      <div className="space-y-3">
        {r2Objects.length === 0 ? (
          <div className="admin-card p-8 text-center text-sm text-gray-500">
            No files found in R2 storage.
          </div>
        ) : (
          r2Objects.map((obj) => {
            const isLinked = linkedKeys.has(obj.key);
            const app = appsByKey.get(obj.key);
            const fileName = obj.key.split("/").pop() || obj.key;

            return (
              <article
                key={obj.key}
                className={`admin-card p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${
                  !isLinked ? "border-red-200 bg-red-50" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        isLinked
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isLinked ? "Linked" : "Orphaned"}
                    </span>
                    <p className="text-sm font-mono text-gray-700 truncate max-w-xs" title={fileName}>
                      {fileName}
                    </p>
                    <span className="text-xs text-gray-400">{formatBytes(obj.size)}</span>
                    <span className="text-xs text-gray-400">{new Date(obj.lastModified).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>

                  {isLinked && app ? (
                    <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-3">
                      <span><span className="font-medium">Applicant:</span> {app.name}</span>
                      <span>•</span>
                      <span>{app.email}</span>
                      <span>•</span>
                      <span><span className="font-medium">Job:</span> {app.jobTitle}</span>
                      <span>•</span>
                      <span>Submitted {formatDate(app.createdAt)}</span>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-red-600 font-medium">
                      ⚠️ Not linked to any application record — safe to delete.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isLinked && (
                    <a
                      href={`/api/resumes/${String(app?._id)}`}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open
                    </a>
                  )}
                  <SafeDelete
                    formAction={deleteR2ObjectAction}
                    payloadKey="key"
                    payloadValue={obj.key}
                    itemName="this file from R2"
                    buttonClass={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      isLinked
                        ? "bg-red-50 text-red-700 hover:bg-red-100"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  />
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
