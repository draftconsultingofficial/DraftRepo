"use server";

import { Types } from "mongoose";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMainAdmin, requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { saveUploadedFile } from "@/lib/files";
import { deleteFromR2 } from "@/lib/r2";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { BannerModel } from "@/models/Banner";
import { StaffUserModel } from "@/models/StaffUser";
import { logError } from "@/lib/error-handler";
import { logAction } from "@/lib/audit";

export async function saveBannerAction(formData: FormData) {
  let session: { email?: string } | null = null;
  try {
    session = await requireSession();
    await connectToDatabase();

    const bannerId = formData.get("bannerId") as string;
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const link = String(formData.get("link") || "").trim();
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const isActive = formData.get("isActive") === "on";
    const position = parseInt(String(formData.get("position") || "0"));
    const aspectRatio = (formData.get("aspectRatio") || "16:9") as "16:9" | "4:3" | "1:1";
    const existingImagePath = formData.get("existingImagePath") as string;
    const imageFile = formData.get("image") as File | null;

    if (!title) {
      throw new Error("Banner title is required");
    }

    if (!startDate || !endDate) {
      throw new Error("Start and end dates are required");
    }

    if (new Date(startDate) >= new Date(endDate)) {
      throw new Error("End date must be after start date");
    }

    let imagePath = existingImagePath;
    let r2KeyToSave: string | undefined;

    if (imageFile && imageFile.size > 0) {
      try {
        const uploaded = await saveUploadedFile(imageFile, ["uploads", "banners"], "public");
        imagePath = uploaded.relativePath;
        if (uploaded.r2Key) r2KeyToSave = uploaded.r2Key;
      } catch (error) {
        await logError({
            title: "Banner image upload failed",
            message: String(error),
            category: "file",
            severity: "high",
            userEmail: session.email,
          });
        throw new Error("Failed to upload image");
      }
    }

    if (!imagePath) {
      throw new Error("Banner image is required");
    }

    if (bannerId && Types.ObjectId.isValid(bannerId)) {
      // existing banners can be updated by contributors
      await requireSession();
      const updatePayload: any = {
        title,
        description,
        imagePath,
        link,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
        position,
        aspectRatio,
      };
      if (r2KeyToSave) updatePayload.r2Key = r2KeyToSave;

      await BannerModel.findByIdAndUpdate(bannerId, updatePayload);
    } else {
      const created = await BannerModel.create({
        title,
        description,
        imagePath,
        r2Key: r2KeyToSave || "",
        link,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
        position,
        aspectRatio,
        createdByEmail: session.email,
      });

      // notify admin and actor if contributor created it
      try {
        const { sendAdminNotification } = await import("@/lib/email");
        const { SiteSettingsModel } = await import("@/models/SiteSettings");
        const settings = await SiteSettingsModel.findOne({ key: "main" }).lean();
        const adminRecipients = settings?.notificationEmail ? [settings.notificationEmail] : [];
        const subject = `New banner created: ${title}`;
        const html = `<p>${session.email} created a new banner titled <strong>${title}</strong>.</p><p><a href="${imagePath}">View image</a></p>`;
        await sendAdminNotification({ subject, html, adminRecipients, actorEmail: session.email });
      } catch (err) {
        // don't block save on email failure
        console.warn("Failed to send banner notification", err);
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/banners");

    await logAction("SAVED_BANNER", session.email!, `Created or updated banner: ${title}`);

    return { success: true };
  } catch (error) {
    await logError({
      title: "Banner save action failed",
      message: String(error),
      stackTrace: error instanceof Error ? error.stack : undefined,
      category: "database",
      severity: "high",
      userEmail: session?.email,
    });
    throw error;
  }
}


export async function deleteBannerAction(formData: FormData) {
  try {
    const session = await requireSession();
    await connectToDatabase();

    const bannerId = formData.get("bannerId") as string;
    if (!bannerId || !Types.ObjectId.isValid(bannerId)) {
      throw new Error("Invalid banner id");
    }

    const banner = await BannerModel.findById(bannerId).lean();
    if (!banner) throw new Error("Banner not found");

    // Attempt to delete R2 object if we have a key or can derive one from imagePath
    try {
      const r2Key = (banner as any).r2Key || "";
      if (r2Key) {
        await deleteFromR2(r2Key);
      } else if (banner.imagePath && process.env.R2_PUBLIC_URL && banner.imagePath.includes(process.env.R2_PUBLIC_URL)) {
        const key = banner.imagePath.replace(`${process.env.R2_PUBLIC_URL}/`, "");
        if (key) await deleteFromR2(key);
      }
    } catch (err) {
      console.warn("Failed to delete banner object from R2", err);
    }

    // Attempt to delete local public file if present
    try {
      if (banner.imagePath && banner.imagePath.startsWith("/")) {
        const localRel = banner.imagePath.slice(1);
        const localPath = path.join(process.cwd(), localRel);
        await unlink(localPath).catch(() => undefined);
      }
    } catch (err) {
      console.warn("Failed to delete local banner file", err);
    }

    await BannerModel.findByIdAndDelete(bannerId);

    await logAction("DELETED_BANNER", session.email, `Deleted banner with ID: ${bannerId}`);

    revalidatePath("/");
    revalidatePath("/admin/banners");
    redirect("/admin/banners");
  } catch (error) {
    await logError({
      title: "Delete banner failed",
      message: String(error),
      stackTrace: error instanceof Error ? error.stack : undefined,
      category: "database",
      severity: "high",
      userEmail: undefined,
    });
    throw error;
  }
}
