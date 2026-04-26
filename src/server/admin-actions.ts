"use server";

import bcrypt from "bcryptjs";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { Types } from "mongoose";

const otpCache = new Map<string, { otp: string; expires: number }>();
import {
  authenticateUser,
  createSession,
  destroySession,
  requireMainAdmin,
  requireSession,
} from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { saveUploadedFile } from "@/lib/files";
import { logAction } from "@/lib/audit";
import { splitLines } from "@/lib/format";
import { ApplicationModel } from "@/models/Application";
import { JobModel } from "@/models/Job";
import { SiteSettingsModel } from "@/models/SiteSettings";
import { StaffUserModel } from "@/models/StaffUser";

type ActionState = {
  success: boolean;
  message: string;
};

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getObjectId(value: string) {
  return Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;
}

export async function loginAction(_: ActionState, formData: FormData) {
  const email = getValue(formData, "email");
  const password = getValue(formData, "password");

  const user = await authenticateUser(email, password);

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  await createSession(user);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function saveStaffAction(_: ActionState | undefined, formData: FormData) {
  const session = await requireMainAdmin();
  const email = getValue(formData, "email").toLowerCase();
  const password = getValue(formData, "password");
  const active = true;

  if (!email) {
    return { success: false, message: "Email is required." };
  }

  if (email === process.env.MAIN_ADMIN_EMAIL?.toLowerCase()) {
    return { success: false, message: "Cannot assign main admin email as a contributor." };
  }

  await connectToDatabase();

  const existingUser = await StaffUserModel.findOne({ email }).lean();
  if (existingUser) {
    return { success: false, message: "This user already has access." };
  }

  // generate a temporary password if not provided
  const tempPassword = password || Math.random().toString(36).slice(2, 14) + "A!";
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  const user = await StaffUserModel.findOneAndUpdate(
    { email },
    {
      email,
      passwordHash,
      role: "contributor",
      active,
      invitedBy: session.email,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  // send invitation email with credentials
  try {
    const { sendUserInvitation } = await import("@/lib/email");
    const responsibilities = [
      "Add and view job postings",
      "Submit candidate information",
      "Follow company data entry guidelines",
    ];
    await sendUserInvitation({
      toEmail: email,
      tempPassword,
      inviterEmail: session.email,
      responsibilities,
    });
  } catch (err) {
    console.warn("Failed to send invitation email", err);
  }

  await logAction("SAVED_USER", session.email, `Created or activated contributor: ${email}`);
  revalidatePath("/admin/team");
  
  return { success: true, message: "Contributor added successfully!" };
}

export async function sendPasswordResetOtpAction() {
  const session = await requireSession();
  
  if (session.role === "main_admin") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpCache.set(session.email, { otp, expires: Date.now() + 15 * 60 * 1000 });
    try {
      const { sendPasswordResetOtpEmail } = await import("@/lib/email");
      await sendPasswordResetOtpEmail({ toEmail: session.email, otp });
      return { success: true, message: "Reset code sent to your email." };
    } catch (err) {
      console.warn("Failed to send OTP email", err);
      return { success: false, message: "Failed to send reset code email. Please try again later." };
    }
  }

  await connectToDatabase();

  let user = await StaffUserModel.findOne({ email: session.email, active: true });

  if (!user) {
    return { success: false, message: "User not found or inactive." };
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  user.resetOtp = otp;
  user.resetOtpExpires = expires;
  await user.save();

  try {
    const { sendPasswordResetOtpEmail } = await import("@/lib/email");
    await sendPasswordResetOtpEmail({ toEmail: session.email, otp });
    return { success: true, message: "Reset code sent to your email." };
  } catch (err) {
    console.warn("Failed to send OTP email", err);
    return { success: false, message: "Failed to send reset code email. Please try again later." };
  }
}

export async function verifyAndResetPasswordAction(formData: FormData) {
  const session = await requireSession();
  const otp = getValue(formData, "otp");
  const newPassword = getValue(formData, "newPassword");

  if (!otp || !newPassword) {
    return { success: false, message: "OTP and new password are required." };
  }

  if (newPassword.length < 6) {
    return { success: false, message: "Password must be at least 6 characters." };
  }

  if (session.role === "main_admin") {
    const record = otpCache.get(session.email);
    if (!record || record.otp !== otp || Date.now() > record.expires) {
      return { success: false, message: "Invalid or expired reset code." };
    }

    const envPath = path.join(process.cwd(), ".env");
    let envData = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
    if (envData.includes("MAIN_ADMIN_PASSWORD=")) {
      envData = envData.replace(/MAIN_ADMIN_PASSWORD=.*/, `MAIN_ADMIN_PASSWORD=${newPassword}`);
    } else {
      envData += `\nMAIN_ADMIN_PASSWORD=${newPassword}`;
    }
    fs.writeFileSync(envPath, envData);
    
    otpCache.delete(session.email);
    return { success: true, message: "Password updated successfully." };
  }

  await connectToDatabase();

  const user = await StaffUserModel.findOne({ email: session.email, active: true });
  if (!user) {
    return { success: false, message: "User not found or inactive." };
  }

  if (!user.resetOtp || !user.resetOtpExpires || user.resetOtp !== otp) {
    return { success: false, message: "Invalid reset code." };
  }

  if (new Date() > user.resetOtpExpires) {
    return { success: false, message: "Reset code has expired. Please request a new one." };
  }

  // Update password and clear OTP
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetOtp = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  return { success: true, message: "Password updated successfully." };
}

export async function deleteStaffAction(formData: FormData) {
  const session = await requireMainAdmin();
  const userId = getValue(formData, "userId");
  if (!userId) throw new Error("User id required.");
  await connectToDatabase();

  const objectId = getObjectId(userId);
  if (!objectId) throw new Error("Invalid user id.");

  const user = await StaffUserModel.findById(objectId).lean();
  if (!user) throw new Error("User not found.");

  await StaffUserModel.findByIdAndDelete(objectId);

  try {
    const { sendAccessRevokedEmail } = await import("@/lib/email");
    await sendAccessRevokedEmail({ toEmail: user.email });
  } catch (err) {
    console.warn("Failed to send access revoked email", err);
  }

  await logAction("DELETED_USER", session.email, `Revoked and deleted contributor: ${user.email}`);

  revalidatePath("/admin/team");
}

export async function updateStaffRoleAction(_: ActionState | undefined, formData: FormData) {
  const session = await requireMainAdmin();
  const userId = getValue(formData, "userId");
  const role = getValue(formData, "role") as "main_admin" | "contributor";

  if (!userId || !role) {
    return { success: false, message: "User id and role are required." };
  }

  if (!["main_admin", "contributor"].includes(role)) {
    return { success: false, message: "Invalid role specified." };
  }

  await connectToDatabase();

  const objectId = getObjectId(userId);
  if (!objectId) return { success: false, message: "Invalid user id." };

  const user = await StaffUserModel.findById(objectId);
  if (!user) return { success: false, message: "User not found." };

  if (user.email.toLowerCase() === process.env.MAIN_ADMIN_EMAIL?.toLowerCase() && role !== "main_admin") {
    return { success: false, message: "Cannot change main admin role." };
  }

  user.role = role;
  await user.save();

  await logAction("UPDATED_USER_ROLE", session.email, `Updated role for ${user.email} to ${role}`);
  revalidatePath("/admin/team");

  return { success: true, message: "Role updated successfully." };
}

export async function saveSettingsAction(formData: FormData) {
  await requireMainAdmin();
  await connectToDatabase();

  await SiteSettingsModel.findOneAndUpdate(
    { key: "main" },
    {
      notificationEmail: getValue(formData, "notificationEmail"),
      contactEmail: getValue(formData, "contactEmail"),
      siteUrl: getValue(formData, "siteUrl"),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const session = await requireSession();
  await logAction("UPDATED_SETTINGS", session.email, "Updated global platform settings.");

  revalidatePath("/admin/settings");
}

export async function saveJobAction(formData: FormData) {
  const session = await requireSession();
  await connectToDatabase();

  const jobId = getValue(formData, "jobId");
  const title = getValue(formData, "title");
  const customSlug = getValue(formData, "slug");
  const slugBase = customSlug || slugify(title, { lower: true, strict: true });
  const companyName = getValue(formData, "companyName");
  const location = getValue(formData, "location");
  const employmentType = getValue(formData, "employmentType");
  const experience = getValue(formData, "experience");
  const department = getValue(formData, "department");
  const salaryType = getValue(formData, "salaryType");
  const salaryMin = getValue(formData, "salaryMin");
  const salaryMax = getValue(formData, "salaryMax");
  const description = getValue(formData, "description");
  const seoTitle = getValue(formData, "seoTitle");
  const seoDescription = getValue(formData, "seoDescription");
  const companyLogoUrl = getValue(formData, "companyLogoUrl");
  const companyLogoFile = formData.get("companyLogo") as File | null;
  const isAcceptingApplications = getValue(formData, "isAcceptingApplications") === "on";

  if (!title || !companyName || !location || !employmentType || !experience || !department || !salaryType || !description) {
    throw new Error("Please fill all required job fields.");
  }

  let slug = slugBase;
  const existingForSlug = await JobModel.findOne({ slug: slugBase }).lean();

  if (existingForSlug && String(existingForSlug._id) !== jobId) {
    slug = `${slugBase}-${Date.now().toString().slice(-6)}`;
  }

  const payload = {
    title,
    slug,
    companyName,
    location,
    employmentType,
    experience,
    department,
    salaryType,
    salaryMin,
    salaryMax,
    description,
    seoTitle,
    seoDescription,
    companyLogo: "",
    isAcceptingApplications,
    createdByEmail: session.email,
  };

  // handle logo upload or external URL
  if (companyLogoFile && companyLogoFile.size > 0) {
    try {
      const uploaded = await saveUploadedFile(companyLogoFile, ["uploads", "logos"], "public");
      payload.companyLogo = uploaded.relativePath;
    } catch (err) {
      console.warn("Failed to upload company logo", err);
    }
  } else if (companyLogoUrl) {
    payload.companyLogo = companyLogoUrl;
  }

  if (jobId) {
    // existing jobs can be updated by contributors
    await requireSession();
    const objectId = getObjectId(jobId);

    if (!objectId) {
      throw new Error("Invalid job id.");
    }

    await JobModel.findByIdAndUpdate(objectId, payload);
    revalidatePath(`/admin/jobs/${jobId}/edit`);
  } else {
    const created = await JobModel.create(payload);

    // notify admin and actor if contributor created it
    try {
      const { sendAdminNotification } = await import("@/lib/email");
      const { SiteSettingsModel } = await import("@/models/SiteSettings");
      const settings = await SiteSettingsModel.findOne({ key: "main" }).lean();
      const adminRecipients = settings?.notificationEmail ? [settings.notificationEmail] : [];
      const subject = `New job created: ${title}`;
      const html = `<p>${session.email} created a new job titled <strong>${title}</strong>.</p><p><a href="/admin/jobs/${created._id}">Open job</a></p>`;
      await sendAdminNotification({ subject, html, adminRecipients, actorEmail: session.email });
    } catch (err) {
      console.warn("Failed to send job notification", err);
    }
  }

  await logAction("SAVED_JOB", session.email, `Created or updated job: ${slug}`);

  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  redirect("/admin/jobs");
}

export async function deleteJobAction(formData: FormData) {
  await requireSession();
  await connectToDatabase();

  const jobId = getValue(formData, "jobId");
  const objectId = getObjectId(jobId);

  if (!objectId) {
    throw new Error("Invalid job id.");
  }

  await JobModel.findByIdAndDelete(objectId);
  // DELETED: We now intentionally preserve previously received applications natively inside the history stack even if their host job is fully deleted.

  const session = await requireSession();
  await logAction("DELETED_JOB", session.email, `Deleted job with ID: ${jobId}`);

  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
}
