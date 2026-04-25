import { connectToDatabase } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { BannerModel } from "@/models/Banner";
import { BannerForm } from "@/components/admin/banner-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireSession();
  await connectToDatabase();

  const banner = await BannerModel.findById(id).lean();

  if (!banner) {
    notFound();
  }

  // normalize date fields and _id for BannerForm defaultValue consumption
  const normalized = {
    ...banner,
    _id: banner._id?.toString(),
    startDate: banner.startDate ? new Date(banner.startDate).toISOString() : undefined,
    endDate: banner.endDate ? new Date(banner.endDate).toISOString() : undefined,
  } as any;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-4xl text-gray-900">Edit Banner</h1>
        <p className="mt-3 text-base text-gray-600">
          Update banner details, image, and schedule
        </p>
      </div>

      <BannerForm banner={normalized} />
    </div>
  );
}
