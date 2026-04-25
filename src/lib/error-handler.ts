import { ErrorLogModel } from "@/models/ErrorLog";
import { connectToDatabase } from "@/lib/db";
import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user,
      pass,
    },
  });
}

export interface ErrorDetails {
  title: string;
  message: string;
  stackTrace?: string;
  severity?: "low" | "medium" | "high" | "critical";
  category?: "database" | "api" | "auth" | "file" | "email" | "validation" | "other";
  userId?: string;
  userEmail?: string;
  context?: Record<string, any>;
}

export async function logError(details: ErrorDetails) {
  try {
    await connectToDatabase();

    const errorLog = await ErrorLogModel.create({
      title: details.title,
      message: details.message,
      stackTrace: details.stackTrace,
      severity: details.severity || "medium",
      category: details.category || "other",
      userId: details.userId,
      userEmail: details.userEmail,
      context: details.context || {},
      emailSent: false,
    });

    // Send email to admin if severity is high or critical
    if (["high", "critical"].includes(details.severity || "medium")) {
      await notifyAdminOfError(errorLog._id.toString(), details);
    }

    return errorLog;
  } catch (error) {
    console.error("Failed to log error:", error);
    // Fallback: still try to send email even if logging fails
    if (["high", "critical"].includes(details.severity || "medium")) {
      try {
        await sendErrorAlert(details);
      } catch (emailError) {
        console.error("Failed to send error alert email:", emailError);
      }
    }
  }
}

async function notifyAdminOfError(logId: string, details: ErrorDetails) {
  try {
    const adminEmail = process.env.MAIN_ADMIN_EMAIL;
    if (!adminEmail) return;

    const transporter = getTransport();
    if (!transporter) {
      console.warn("SMTP not configured. Skipping error notification email.");
      return;
    }

    const severityColor = {
      low: "#FFA500",
      medium: "#FF8C00",
      high: "#FF6347",
      critical: "#DC143C",
    };

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${severityColor[details.severity || "medium"]};"> ${details.severity?.toUpperCase()} - ${details.title}</h2>
        <p><strong>Category:</strong> ${details.category || "other"}</p>
        <p><strong>Message:</strong> ${details.message}</p>
        ${details.userEmail ? `<p><strong>User:</strong> ${details.userEmail}</p>` : ""}
        ${details.stackTrace ? `<pre style="background: #f5f5f5; padding: 10px; overflow-x: auto;"><code>${escapeHtml(details.stackTrace)}</code></pre>` : ""}
        ${details.context && Object.keys(details.context).length > 0 ? `<details>
          <summary>Context</summary>
          <pre style="background: #f5f5f5; padding: 10px; overflow-x: auto;"><code>${escapeHtml(JSON.stringify(details.context, null, 2))}</code></pre>
        </details>` : ""}
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: adminEmail,
      subject: `🚨 [${details.severity?.toUpperCase()}] ${details.title} - Draft Consulting`,
      html: htmlContent,
    });

    // Mark email as sent
    try {
      await ErrorLogModel.findByIdAndUpdate(logId, { emailSent: true });
    } catch {}
  } catch (error) {
    console.error("Failed to notify admin:", error);
  }
}

async function sendErrorAlert(details: ErrorDetails) {
  const adminEmail = process.env.MAIN_ADMIN_EMAIL;
  if (!adminEmail) return;

  const transporter = getTransport();
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: adminEmail,
      subject: `🚨 [${details.severity?.toUpperCase()}] ${details.title}`,
      html: `<p>${escapeHtml(details.message)}</p>`,
    });
  } catch (error) {
    console.error("Failed to send error email:", error);
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
