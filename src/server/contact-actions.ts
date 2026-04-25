"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { sendContactEmail } from "@/lib/email";
import { SiteSettingsModel } from "@/models/SiteSettings";

type ActionState = {
  success: boolean;
  message: string;
};

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function submitContactAction(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = getValue(formData, "name");
  const email = getValue(formData, "email").toLowerCase();
  const phone = getValue(formData, "phone");
  const subject = getValue(formData, "subject");
  const message = getValue(formData, "message");

  // Validation
  if (!name || !email || !phone || !subject || !message) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  if (message.length < 10) {
    return {
      success: false,
      message: "Message must be at least 10 characters long.",
    };
  }

  try {
    await connectToDatabase();
    const settings = await SiteSettingsModel.findOne({ key: "main" }).lean();

    const adminRecipients = [
      settings?.contactEmail,
      settings?.notificationEmail,
      process.env.MAIN_ADMIN_EMAIL,
    ]
      .filter((value): value is string => Boolean(value))
      .map((value) => value.toLowerCase())
      .filter((value, index, list) => list.indexOf(value) === index);

    await sendContactEmail({
      fromName: name,
      fromEmail: email,
      phone,
      subject,
      message,
      adminRecipients,
    });

    revalidatePath("/contact");

    return {
      success: true,
      message:
        "Thank you for contacting us. We will get back to you shortly.",
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}
