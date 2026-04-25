import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

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

  await mkdir(baseDir, { recursive: true });

  const absolutePath = path.join(baseDir, uniqueName);
  await writeFile(absolutePath, bytes);

  return {
    absolutePath,
    relativePath:
      mode === "public"
        ? `/${[...targetParts, uniqueName].join("/")}`
        : [...targetParts, uniqueName].join("/"),
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
  };
}
