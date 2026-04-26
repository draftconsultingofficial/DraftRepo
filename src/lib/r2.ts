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
  buffer?: Buffer,
): Promise<{
  key: string;
  url: string;
  originalName: string;
}> {
  const bytes = buffer || Buffer.from(await file.arrayBuffer());
  const ext = file.name ? file.name.split(".").pop()?.toLowerCase() : "bin";
  const safeName = customBaseName
    ? `${customBaseName.replace(/[^a-zA-Z0-9_-]/g, "_")}.${ext}`
    : `${Date.now()}-${sanitizeFileName(file.name || "upload")}`;
  const key = `${folder}/${safeName}`;

  if (!process.env.R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME is not configured");
  }

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: bytes,
    ContentType: file.type || "application/octet-stream",
  });

  await s3Client.send(command);

  const publicUrl = process.env.R2_PUBLIC_URL 
    ? `${process.env.R2_PUBLIC_URL}/${key}`
    : `https://${process.env.R2_BUCKET_NAME}.r2.cloudflarestorage.com/${key}`;

  return {
    key,
    url: publicUrl,
    originalName: file.name || "upload",
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
