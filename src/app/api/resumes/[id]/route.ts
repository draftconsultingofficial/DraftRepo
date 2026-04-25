import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getSignedDownloadUrl } from "@/lib/r2";
import { ApplicationModel } from "@/models/Application";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSession();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const application = await ApplicationModel.findById(id).lean();

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const signedUrl = await getSignedDownloadUrl(application.resumeKey, 3600);

    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("Resume download error:", error);
    return NextResponse.json(
      { error: "Failed to download resume" },
      { status: 500 }
    );
  }
}
