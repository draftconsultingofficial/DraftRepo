import { ImageResponse } from "next/og";
import { connectToDatabase } from "@/lib/db";
import { JobModel } from "@/models/Job";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();
  const job = await JobModel.findOne({ slug, isPublished: true }).lean();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "linear-gradient(135deg, #0a1019 0%, #18314d 52%, #d9e3ef 180%)",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: 28,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              background: "linear-gradient(145deg, #dbe4ef 0%, #95a7bb 42%, #f8fbff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#17314d",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            DC
          </div>
          Draft Consulting
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.08 }}>
            {job?.title || "Opportunity at Draft Consulting"}
          </div>
          <div style={{ fontSize: 28, color: "#dce7f4" }}>
            {job?.location || "Recruitment & Placement"} • {job?.employmentType || "Full-time"}
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#8fc0ff" }}>
          Executive search and placement portal
        </div>
      </div>
    ),
    size,
  );
}
