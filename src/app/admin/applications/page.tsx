import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { ApplicationModel } from "@/models/Application";
import { JobModel } from "@/models/Job";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string; application?: string }>;
}) {
  await requireSession();
  const params = await searchParams;
  await connectToDatabase();

  const jobFilter = params.job ? { jobId: params.job } : {};

  const [applications, jobs] = await Promise.all([
    ApplicationModel.find(jobFilter).sort({ createdAt: -1 }).lean(),
    JobModel.find().sort({ title: 1 }).lean(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          Applications
        </p>
        <h1 className="mt-2 font-semibold text-4xl text-gray-900">
          Applicant pipeline
        </h1>
        <p className="mt-3 text-base text-gray-600">
          Review candidate submissions by role and open stored resumes directly from the dashboard.
        </p>
      </div>

      <div className="admin-card p-6">
        <p className="mb-4 text-sm font-semibold text-gray-900">Filter by job</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/applications" className={`px-3! py-1! text-sm! ${
            !params.job
              ? "button-primary"
              : "button-secondary"
          }`}>
            All jobs
          </Link>
          {jobs.map((job) => (
            <Link
              key={String(job._id)}
              href={`/admin/applications?job=${String(job._id)}`}
              className={`px-3! py-1! text-sm! ${
                params.job === String(job._id)
                  ? "button-primary"
                  : "button-secondary"
              }`}
            >
              {job.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {applications.length > 0 ? (
          applications.map((application) => (
            <article
              key={String(application._id)}
              className={`admin-card p-6 transition ${
                params.application === String(application._id) ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                      {application.jobTitle}
                    </p>
                    {(() => {
                      const linkedJob = jobs.find(j => String(j._id) === String(application.jobId));
                      let badge = <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 uppercase">Deleted</span>;
                      if (linkedJob) {
                        if (linkedJob.isAcceptingApplications) {
                          badge = <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 uppercase">Active</span>;
                        } else {
                          badge = <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700 uppercase">Closed</span>;
                        }
                      }
                      return badge;
                    })()}
                  </div>
                  <h2 className="mt-3 font-semibold text-2xl text-gray-900">
                    {application.name}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>{application.email}</span>
                    <span>•</span>
                    <span>{application.phone}</span>
                    <span>•</span>
                    <span>{formatDate(application.createdAt)}</span>
                  </div>
                </div>
                <a
                  href={`/api/resumes/${String(application._id)}`}
                  className="button-primary"
                >
                  Open resume
                </a>
              </div>
            </article>
          ))
        ) : (
          <div className="admin-card p-6 text-sm text-gray-600 text-center">
            No applications match the selected filter yet.
          </div>
        )}
      </div>
    </div>
  );
}
