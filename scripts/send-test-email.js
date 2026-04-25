require('dotenv').config();
const nodemailer = require('nodemailer');

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    console.error('SMTP credentials are missing. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });
}

async function main() {
  const transporter = getTransport();
  if (!transporter) process.exit(1);

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  try {
    const info = await transporter.sendMail({
      from,
      to: 'abhisheksaini80597@gmail.com',
      subject: 'Test email (plain JS sender)',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Test Email</h2>
          <p>This is a test email sent from <strong>scripts/send-test-email.js</strong>.</p>
        </div>
      `,
    });
    console.log('Message sent:', info && info.messageId ? info.messageId : info);
  } catch (err) {
    console.error('Failed to send test email:', err);
    process.exit(1);
  }
}

main();
