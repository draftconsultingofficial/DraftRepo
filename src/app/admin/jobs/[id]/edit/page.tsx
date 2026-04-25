import { notFound } from "next/navigation";
import { JobForm } from "@/components/admin/job-form";
import { requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { JobModel } from "@/models/Job";

export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession();
  const { id } = await params;
  await connectToDatabase();
  const job = await JobModel.findById(id).lean();

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-(--color-blue)">
          Edit role
        </p>
        <h1 className="mt-2 font-serif text-5xl text-(--color-ink)">
          {job.title}
        </h1>
      </div>
      <JobForm
        job={{
          _id: String(job._id),
          title: job.title,
          slug: job.slug,
          companyName: job.companyName,
          location: job.location,
          employmentType: job.employmentType,
          experience: job.experience,
          department: job.department,
          salaryType: job.salaryType,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          description: job.description,
          seoTitle: job.seoTitle,
          seoDescription: job.seoDescription,
          isAcceptingApplications: job.isAcceptingApplications,
        }}
      />
    </div>
  );
}
