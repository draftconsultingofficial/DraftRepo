import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { uploadToR2 } from "./r2";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
}

export async function saveUploadedFile(
  file: File,
  targetParts: string[],
  mode: "private" | "public",
) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const originalName = sanitizeFileName(file.name || "upload");
  const uniqueName = `${Date.now()}-${originalName}`;

  const baseDir =
    mode === "public"
      ? path.join(process.cwd(), "public", ...targetParts)
      : path.join(process.cwd(), "storage", ...targetParts);

  let localStored = false;
  let absolutePath = path.join(baseDir, uniqueName);

  try {
    await mkdir(baseDir, { recursive: true });
    await writeFile(absolutePath, bytes);
    localStored = true;
  } catch (err) {
    console.warn("Local storage write failed, will attempt R2 if configured", err);
    if (!process.env.R2_BUCKET_NAME) {
      throw new Error(`Failed to save file locally and R2 is not configured: ${err}`);
    }
  }

  let r2Result: { key: string; url: string } | null = null;

  // If R2 is configured, also upload to R2 and prefer that URL as the returned path.
  if (process.env.R2_BUCKET_NAME) {
    try {
      const folder = targetParts.join("/");
      const baseNoExt = uniqueName.replace(/\.[^/.]+$/, "");
      const uploaded = await uploadToR2(file, folder, baseNoExt, bytes);
      r2Result = { key: uploaded.key, url: uploaded.url };
    } catch (err) {
      console.warn("R2 upload failed", err);
      // If R2 failed but local also failed, then we have no file saved at all.
      if (!localStored) {
        throw new Error(`Failed to save file both locally and to R2: ${err}`);
      }
    }
  }

  // If R2 upload succeeded, remove the local copy (even if it's "private", we prefer R2)
  if (r2Result && localStored) {
    try {
      await unlink(absolutePath).catch(() => undefined);
    } catch (err) {
      console.warn("Failed to remove local copy after R2 upload", err);
    }
  }

  return {
    absolutePath,
    // prefer R2 public URL when available, otherwise return local public path
    relativePath:
      r2Result && mode === "public"
        ? r2Result.url
        : mode === "public"
        ? `/${[...targetParts, uniqueName].join("/")}`
        : [...targetParts, uniqueName].join("/"),
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    r2Key: r2Result?.key,
    r2Url: r2Result?.url,
  };
}
