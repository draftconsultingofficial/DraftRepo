"use server";

import { Types } from "mongoose";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMainAdmin, requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { saveUploadedFile } from "@/lib/files";
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

    if (imageFile && imageFile.size > 0) {
      try {
        const uploaded = await saveUploadedFile(imageFile, ["uploads", "banners"], "public");
        imagePath = uploaded.relativePath;
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
      await BannerModel.findByIdAndUpdate(bannerId, {
        title,
        description,
        imagePath,
        link,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
        position,
        aspectRatio,
      });
    } else {
      const created = await BannerModel.create({
        title,
        description,
        imagePath,
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
