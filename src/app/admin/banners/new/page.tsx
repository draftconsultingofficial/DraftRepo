import { connectToDatabase } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { BannerModel } from "@/models/Banner";
import { BannerForm } from "@/components/admin/banner-form";

export const dynamic = "force-dynamic";

export default async function CreateBannerPage() {
  await requireSession();
  await connectToDatabase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-4xl text-gray-900">Create Banner</h1>
        <p className="mt-3 text-base text-gray-600">
          Create a new homepage banner with scheduled activation
        </p>
      </div>

      <BannerForm />
    </div>
  );
}
