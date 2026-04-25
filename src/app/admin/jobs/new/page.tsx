import { JobForm } from "@/components/admin/job-form";
import { requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  await requireSession();
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-(--color-blue)">
          Add role
        </p>
        <h1 className="mt-2 font-serif text-5xl text-(--color-ink)">
          Publish a new job
        </h1>
      </div>
      <JobForm />
    </div>
  );
}
