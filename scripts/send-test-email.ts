import 'dotenv/config';
import { sendContactEmail } from '../src/lib/email';

async function main() {
  try {
    await sendContactEmail({
      fromName: 'Local Test',
      fromEmail: 'abhisheksaini80597@gmail.com',
      phone: '000-000-0000',
      subject: 'Test email from scripts/send-test-email.ts',
      message: 'This is a test email sent from a local script to verify SMTP configuration.',
      adminRecipients: [],
    });
    console.log('sendContactEmail invoked — check the recipient inbox or application logs.');
  } catch (err) {
    console.error('Failed to send test email:', err);
    process.exit(1);
  }
}

main();
