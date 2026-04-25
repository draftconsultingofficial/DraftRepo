"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { sendApplicationEmails } from "@/lib/email";
import { uploadToR2 } from "@/lib/r2";
import { ApplicationModel } from "@/models/Application";
import { JobModel } from "@/models/Job";
import { SiteSettingsModel } from "@/models/SiteSettings";

type ActionState = {
  success: boolean;
  message: string;
};

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function submitApplicationAction(
  _: ActionState,
  formData: FormData,
) {
  const jobId = getValue(formData, "jobId");
  const name = getValue(formData, "name");
  const phone = getValue(formData, "phone");
  const email = getValue(formData, "email").toLowerCase();
  const resume = formData.get("resume");

  if (!Types.ObjectId.isValid(jobId)) {
    return {
      success: false,
      message: "This job link is invalid.",
    };
  }

  if (!(resume instanceof File) || resume.size === 0) {
    return {
      success: false,
      message: "Please upload your resume or CV.",
    };
  }

  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedMimeTypes.includes(resume.type)) {
    return {
      success: false,
      message: "Only PDF, DOC, and DOCX files are allowed.",
    };
  }

  if (resume.size > 5 * 1024 * 1024) {
    return {
      success: false,
      message: "Resume file size must be 5MB or smaller.",
    };
  }

  if (!name || !phone || !email) {
    return {
      success: false,
      message: "Please complete all required fields before submitting.",
    };
  }

  await connectToDatabase();

  const job = await JobModel.findById(jobId).lean();

  if (!job || !job.isAcceptingApplications) {
    return {
      success: false,
      message: "This job is no longer accepting applications.",
    };
  }

  const safeName = `${name.trim().toLowerCase().replace(/\s+/g, "_")}_${job.slug}_${Date.now()}`;
  const uploadedResume = await uploadToR2(resume, `resumes/${job.slug}`, safeName);

  const application = await ApplicationModel.create({
    jobId: job._id,
    jobTitle: job.title,
    name,
    phone,
    email,
    resumeKey: uploadedResume.key,
    resumeUrl: uploadedResume.url,
    resumeOriginalName: uploadedResume.originalName,
    resumeMimeType: resume.type || "application/octet-stream",
    resumeSize: resume.size,
  });

  const settings = await SiteSettingsModel.findOne({ key: "main" }).lean();

  const adminRecipients = [
    settings?.notificationEmail,
    process.env.MAIN_ADMIN_EMAIL,
    settings?.contactEmail,
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.toLowerCase())
    .filter((value, index, list) => list.indexOf(value) === index);

  await sendApplicationEmails({
    applicantEmail: email,
    applicantName: name,
    jobTitle: job.title,
    adminRecipients,
    applicationId: String(application._id),
  });

  revalidatePath("/jobs");
  revalidatePath("/admin/applications");

  return {
    success: true,
    message: `Application submitted successfully. A confirmation email has been sent to ${email}.`,
  };
}
