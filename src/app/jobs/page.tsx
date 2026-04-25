import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { formatDate, parseMarkdown, stripMarkdown } from "@/lib/format";
import { JobModel } from "@/models/Job";
import { PublicFooter } from "@/components/public/footer";
import { PublicHeader } from "@/components/public/header";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Open Jobs",
  description: "Browse open hiring opportunities published by Draft Consulting.",
};

export default async function JobsPage() {
  const formatSalary = (type?: string, min?: string, max?: string) => {
    if (!type) return "";
    if (type === "Fixed Range") {
      const minStr = min ? min : "";
      const maxStr = max ? max : "";
      if (minStr && maxStr) return `${minStr} - ${maxStr}`;
      return minStr || maxStr || "Not Disclosed";
    }
    if (type === "Up to X") return `Up to ${max || "Not Disclosed"}`;
    return type;
  };

  try {
    await connectToDatabase();
    const jobs = await JobModel.find({ isAcceptingApplications: true }).sort({ createdAt: -1 }).lean();

    return (
      <div className="min-h-screen bg-white">
        <PublicHeader />
        <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="panel max-w-3xl rounded-lg p-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Career opportunities
            </p>
            <h1 className="mt-4 font-semibold text-4xl text-gray-900">
              Current hiring mandates
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Explore active assignments, review the requirements in detail, and apply directly through our application workflow.
            </p>
          </div>

          <div className="mt-12 grid gap-6">
            {jobs && jobs.length > 0 ? (
              jobs.map((job) => (
                <article
                  key={String(job._id)}
                  className="panel grid gap-6 rounded-lg p-8 lg:grid-cols-[1fr_auto] hover:shadow-md transition"
                >
                  <div>
                    <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {job.companyName && <span className="text-blue-600">{job.companyName}</span>}
                      {job.companyName && (job.department || job.location) && <span className="text-gray-300">•</span>}
                      {job.department && <span>{job.department}</span>}
                      {job.department && (job.location || job.employmentType) && <span className="text-gray-300">•</span>}
                      {job.location && <span>{job.location}</span>}
                      {job.location && job.employmentType && <span className="text-gray-300">•</span>}
                      {job.employmentType && <span>{job.employmentType}</span>}
                    </div>
                    <h2 className="mt-4 font-semibold text-2xl text-gray-900 line-clamp-2">
                      {job.title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-gray-600 line-clamp-2">{stripMarkdown(job.description || "").slice(0, 240)}</p>
                    <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-600">
                      {job.experience && (
                        <span>
                          <span className="font-medium text-gray-900">Experience:</span>{" "}
                          {job.experience}
                        </span>
                      )}
                      {job.salaryType && (
                        <span>
                          <span className="font-medium text-gray-900">Salary:</span> {formatSalary(job.salaryType, job.salaryMin, job.salaryMax)}
                        </span>
                      )}
                      {job.createdAt && (
                        <span>
                          <span className="font-medium text-gray-900">Posted:</span>{" "}
                          {formatDate(job.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4 lg:items-end">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="button-primary whitespace-nowrap"
                    >
                      View & apply
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="panel rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">No published jobs are available yet.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Please check back later or contact us for updates.
                </p>
              </div>
            )}
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  } catch (error) {
    console.error("Error loading jobs:", error);
    return (
      <div className="min-h-screen bg-white">
        <PublicHeader />
        <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="panel max-w-3xl rounded-lg p-10">
            <h1 className="font-semibold text-4xl text-gray-900">Open Positions</h1>
          </div>
          <div className="mt-12">
            <div className="panel rounded-lg p-12 text-center bg-red-50 border border-red-100">
              <p className="text-red-700 text-lg font-medium">Unable to load jobs</p>
              <p className="text-red-600 text-sm mt-2">
                We encountered an issue loading the job listings. Please try again later.
              </p>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }
}
