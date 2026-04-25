import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ApplicationModel } from "@/models/Application";
import { JobModel } from "@/models/Job";
import { StaffUserModel } from "@/models/StaffUser";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireSession();
  await connectToDatabase();

  const [jobsCount, applicationsCount, contributorsCount, latestJobs] = await Promise.all([
    JobModel.countDocuments(),
    ApplicationModel.countDocuments(),
    StaffUserModel.countDocuments({ active: true }),
    JobModel.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Overview</p>
        <h1 className="mt-3 font-semibold text-4xl text-gray-900">
          Welcome back
        </h1>
        <p className="mt-3 text-base text-gray-600">
          Signed in as <span className="font-medium">{session.email}</span>. Use the dashboard to publish roles, review applicants, and manage contributor access.
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          ["Published & draft jobs", jobsCount],
          ["Applications received", applicationsCount],
          ["Active contributor accounts", contributorsCount],
        ].map(([label, value]) => (
          <article key={label} className="admin-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
              {label}
            </p>
            <p className="mt-4 font-bold text-4xl text-gray-900">{value}</p>
          </article>
        ))}
      </section>

      <section className="admin-card p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-2xl text-gray-900">Recent jobs</h2>
            <p className="text-sm text-gray-600">Quick access to role updates.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/jobs/new" className="button-primary">
              Add new job
            </Link>
            <Link href="/admin/banners" className="button-outline">
              Manage Banners
            </Link>
          </div>
        </div>
        <div className="space-y-2">
          {latestJobs.length > 0 ? (
            latestJobs.map((job) => (
              <div
                key={String(job._id)}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-500">
                    {job.location} • {job.department}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/admin/applications?job=${String(job._id)}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Applications
                  </Link>
                  <Link
                    href={`/admin/jobs/${String(job._id)}/edit`}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-sm text-gray-500 text-center">
              No jobs have been created yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
