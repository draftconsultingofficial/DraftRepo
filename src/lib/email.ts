import nodemailer from "nodemailer";
import { defaultSiteUrl } from "@/lib/site";

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

export async function sendApplicationEmails(input: {
  applicantEmail: string;
  applicantName: string;
  jobTitle: string;
  adminRecipients: string[];
  applicationId: string;
}) {
  const transporter = getTransport();

  if (!transporter) {
    console.warn("SMTP credentials are missing. Skipping email delivery.");
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const applicationLink = `${defaultSiteUrl}/admin/applications?application=${input.applicationId}`;

  await Promise.all([
    transporter.sendMail({
      from,
      to: input.applicantEmail,
      subject: `Application received for ${input.jobTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Thanks for applying to ${input.jobTitle}</h2>
          <p>Hello ${input.applicantName},</p>
          <p>We have received your application at Draft Consulting. Our recruitment team will review it and contact you if your profile matches the role.</p>
          <p>You do not need to take any further action right now.</p>
        </div>
      `,
    }),
    ...(input.adminRecipients.length > 0
      ? [
          transporter.sendMail({
            from,
            to: input.adminRecipients.join(","),
            subject: `New application: ${input.jobTitle}`,
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6">
                <h2>New application received</h2>
                <p>${input.applicantName} has applied for <strong>${input.jobTitle}</strong>.</p>
                <p><a href="${applicationLink}">Open the application in the admin dashboard</a></p>
              </div>
            `,
          }),
        ]
      : []),
  ]);
}

export async function sendContactEmail(input: {
  fromName: string;
  fromEmail: string;
  phone: string;
  subject: string;
  message: string;
  adminRecipients: string[];
}) {
  const transporter = getTransport();

  if (!transporter) {
    console.warn("SMTP credentials are missing. Skipping email delivery.");
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;

  await Promise.all([
    transporter.sendMail({
      from,
      to: input.fromEmail,
      subject: "We received your message",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Thank you for contacting us</h2>
          <p>Hello ${input.fromName},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p style="margin-top:20px;color:#666;font-size:13px">
            <strong>Your message details:</strong><br />
            Subject: ${input.subject}<br />
            Phone: ${input.phone}
          </p>
        </div>
      `,
    }),
    ...(input.adminRecipients.length > 0
      ? [
          transporter.sendMail({
            from,
            to: input.adminRecipients.join(","),
            subject: `New contact form submission: ${input.subject}`,
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6">
                <h2>New Contact Form Submission</h2>
                <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin:15px 0">
                  <p><strong>Name:</strong> ${input.fromName}</p>
                  <p><strong>Email:</strong> <a href="mailto:${input.fromEmail}">${input.fromEmail}</a></p>
                  <p><strong>Phone:</strong> ${input.phone}</p>
                  <p><strong>Subject:</strong> ${input.subject}</p>
                </div>
                <h3>Message:</h3>
                <p style="white-space:pre-wrap;line-height:1.6">${input.message}</p>
              </div>
            `,
          }),
        ]
      : []),
  ]);
}

export async function sendAdminNotification(input: {
  subject: string;
  html: string;
  adminRecipients: string[];
  actorEmail?: string;
}) {
  const transporter = getTransport();

  if (!transporter) {
    console.warn("SMTP credentials are missing. Skipping email delivery.");
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;

  const recipients = [...(input.adminRecipients || [])];

  // send notification to admin recipients
  if (recipients.length > 0) {
    await transporter.sendMail({ from, to: recipients.join(","), subject: input.subject, html: input.html });
  }

  // send confirmation to the actor (contributor) if present
  if (input.actorEmail) {
    await transporter.sendMail({
      from,
      to: input.actorEmail,
      subject: `Confirmation: ${input.subject}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><p>Thanks — your action was recorded.</p>${input.html}</div>`,
    });
  }
}

export async function sendUserInvitation(input: {
  toEmail: string;
  tempPassword: string;
  inviterEmail: string;
  responsibilities?: string[];
  loginUrl?: string;
}) {
  const transporter = getTransport();

  if (!transporter) {
    console.warn("SMTP credentials are missing. Skipping invitation email.");
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;

  const loginLink = input.loginUrl || `${defaultSiteUrl}/admin/login`;

  const resp = input.responsibilities || [];
  const responsibilitiesHtml = resp.length
    ? `<p><strong>Responsibilities:</strong><ul>${resp.map((r) => `<li>${r}</li>`).join("")}</ul></p>`
    : "";

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2>You're invited to join the admin team</h2>
      <p>Hello,</p>
      <p>${input.inviterEmail} has invited you to join as a contributor.</p>
      <p><strong>Login:</strong> ${input.toEmail}</p>
      <p><strong>Temporary password:</strong> ${input.tempPassword}</p>
      ${responsibilitiesHtml}
      <p>You can sign in here: <a href="${loginLink}">${loginLink}</a></p>
      <p>Please change your password after logging in.</p>
    </div>
  `;

  await transporter.sendMail({ from, to: input.toEmail, subject: "Invitation: Contributor account", html });
}

export async function sendPasswordResetOtpEmail(input: {
  toEmail: string;
  otp: string;
}) {
  const transporter = getTransport();

  if (!transporter) {
    console.warn("SMTP credentials are missing. Skipping password reset email.");
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;border:1px solid #eaeaea;border-radius:8px;padding:20px;">
      <h2 style="color:#000;border-bottom:1px solid #eaeaea;padding-bottom:10px;">Reset Your Password</h2>
      <p>Hello,</p>
      <p>A password reset was requested for your account.</p>
      <p>Please use the following 6-digit verification code to reset your password. This code will expire in 15 minutes.</p>
      <div style="background-color:#f4f4f4;padding:15px;text-align:center;font-size:24px;font-weight:bold;letter-spacing:4px;border-radius:4px;margin:20px 0;">
        ${input.otp}
      </div>
      <p style="font-size:14px;color:#666;">If you did not request this, please ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: input.toEmail,
    subject: "Your Password Reset Code",
    html
  });
}

export async function sendAccessRevokedEmail(input: {
  toEmail: string;
}) {
  const transporter = getTransport();

  if (!transporter) {
    console.warn("SMTP credentials are missing. Skipping access revoked email.");
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;border:1px solid #ffcccc;border-radius:8px;padding:20px;">
      <h2 style="color:#d32f2f;border-bottom:1px solid #ffcccc;padding-bottom:10px;">Account Access Revoked</h2>
      <p>Hello,</p>
      <p>Your access to the Draft Consulting Admin Dashboard has been revoked by an administrator.</p>
      <p>If you believe this is an error, please contact the main administrator.</p>
      <p style="font-size:14px;color:#666;">This is an automated message.</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: input.toEmail,
    subject: "Notice: Your Dashboard Access Has Been Revoked",
    html
  });
}
