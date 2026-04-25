import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { JobModel } from "@/models/Job";
import { deleteJobAction } from "@/server/admin-actions";
import { SafeDelete } from "@/components/admin/delete-action";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const session = await requireSession();
  await connectToDatabase();

  const jobs = await JobModel.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Jobs
          </p>
          <h1 className="mt-2 font-semibold text-4xl text-gray-900">
            Role publishing
          </h1>
        </div>
        <Link
          href="/admin/jobs/new"
          className="button-primary"
        >
          Add new job
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <article
              key={String(job._id)}
              className="admin-card p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <span className={job.isAcceptingApplications ? "text-green-600" : "text-yellow-600"}>{job.isAcceptingApplications ? "Accepting" : "Closed"}</span>
                    <span>•</span>
                    {job.companyName && (
                      <>
                        <span className="text-blue-600">{job.companyName}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.employmentType}</span>
                  </div>
                  <h2 className="mt-3 font-semibold text-2xl text-gray-900">{job.title}</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Updated {formatDate(job.updatedAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/applications?job=${String(job._id)}`}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Applicants
                  </Link>
                  <Link
                    href={`/admin/jobs/${String(job._id)}/edit`}
                    className="button-primary px-3 py-2 text-sm"
                  >
                    Edit
                  </Link>
                  {session.role === "main_admin" ? (
                    <SafeDelete 
                      formAction={deleteJobAction}
                      payloadKey="jobId"
                      payloadValue={String(job._id)}
                      itemName="this job"
                    />
                  ) : null}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="admin-card p-6 text-sm text-gray-600 text-center">
            No jobs have been created yet.
          </div>
        )}
      </div>
    </div>
  );
}
