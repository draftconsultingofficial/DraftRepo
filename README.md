# Draft Consulting Hiring Portal

A professional job consulting and placement portal built with Next.js App Router, Tailwind CSS, and MongoDB.

## Features

- Public jobs listing and detailed job pages
- Direct application form with resume upload
- Applicant confirmation email plus recruiter notification email
- One main admin account with full control
- Delegated recruiter accounts that can add and read data but cannot delete jobs
- SEO-friendly pages with sitemap, robots rules, structured data, and social sharing previews
- Optional job image uploads

## Tech stack

- Next.js 16
- React 19
- Tailwind CSS 4
- MongoDB + Mongoose
- Custom session auth with signed cookies
- Nodemailer for email notifications

## Setup

1. Copy `.env.example` to `.env.local`
2. Fill in MongoDB, auth secret, admin credentials, and SMTP credentials
3. Install dependencies:

```bash
npm install
```

4. Start development:

```bash
npm run dev
```

## Required environment variables

- `MONGODB_URI`
- `MONGODB_DB`
- `AUTH_SECRET`
- `MAIN_ADMIN_EMAIL`
- `MAIN_ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL`

## Email delivery

To send confirmation and recruiter notification emails, configure:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

If SMTP is not configured, the application flow still works, but email delivery is skipped.

## Admin permissions

- Main admin:
  full access, including delete permissions and recruiter management
- Editor:
  can create and update jobs, and review applications
- Editors cannot delete jobs

## Notes

- Resume files are stored locally in the `storage/` directory
- Job images are stored under `public/uploads/jobs`
- For production, you may later swap file storage to S3, Cloudinary, or another managed storage provider
