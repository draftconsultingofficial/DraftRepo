import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
}

export async function uploadToR2(
  file: File,
  folder: string,
  customBaseName?: string,
): Promise<{
  key: string;
  url: string;
  originalName: string;
}> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const safeName = customBaseName
    ? `${customBaseName.replace(/[^a-zA-Z0-9_-]/g, "_")}.${ext}`
    : `${Date.now()}-${sanitizeFileName(file.name || "upload")}`;
  const key = `${folder}/${safeName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || "",
    Key: key,
    Body: bytes,
    ContentType: file.type,
  });

  await s3Client.send(command);

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return {
    key,
    url: publicUrl,
    originalName: file.name,
  };
}

export async function getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || "",
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || "",
    Key: key,
  });

  await s3Client.send(command);
}

export async function listR2Objects(prefix = ""): Promise<{ key: string; size: number; lastModified: Date }[]> {
  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME || "",
    Prefix: prefix,
  });

  const response = await s3Client.send(command);

  return (response.Contents || []).map((obj) => ({
    key: obj.Key || "",
    size: obj.Size || 0,
    lastModified: obj.LastModified || new Date(),
  }));
}
