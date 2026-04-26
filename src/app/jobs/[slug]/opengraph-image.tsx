import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Image() {
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const buffer = await fs.readFile(logoPath);
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  } catch (err) {
    return new Response("Not found", { status: 404 });
  }
}
