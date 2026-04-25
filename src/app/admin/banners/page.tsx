import Link from "next/link";
import Image from "next/image";
import { getSession, requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { BannerModel } from "@/models/Banner";
import { deleteBannerAction } from "@/server/banner-actions";
import { SafeDelete } from "@/components/admin/delete-action";

export const dynamic = "force-dynamic";

export default async function BannersPage() {
  await requireSession();
  await connectToDatabase();

  const session = await getSession();

  const banners = await BannerModel.find().sort({ position: 1, startDate: -1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Banners</p>
        <h1 className="mt-2 font-semibold text-4xl text-gray-900">Manage site banners</h1>
        <p className="mt-3 text-base text-gray-600">Create, schedule, and preview hero banners. Active banners will display on the homepage according to their schedule.</p>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/admin/banners/new" className="button-primary">Create Banner</Link>
      </div>

      <div className="grid gap-4">
        {banners.map((b: any) => (
          <article key={String(b._id)} className="admin-card p-4 flex items-center gap-4">
            <div className="w-48 h-24 overflow-hidden rounded">
              {b.imagePath ? (
                <Image src={b.imagePath} alt={b.title || "Banner"} width={320} height={180} className="object-cover w-full h-full" />
              ) : (
                <div className="bg-gray-100 w-full h-full flex items-center justify-center text-sm text-gray-500">No image</div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{b.title}</p>
              <p className="text-sm text-gray-600">{b.description}</p>
              <p className="text-xs text-gray-500 mt-2">{new Date(b.startDate).toLocaleString()} → {new Date(b.endDate).toLocaleString()}</p>
            </div>
            <div className="flex flex-col gap-2">
                <>
                  <Link href={`/admin/banners/${String(b._id)}/edit`} className="button-outline">Edit</Link>
                  <SafeDelete 
                    formAction={deleteBannerAction}
                    payloadKey="bannerId"
                    payloadValue={String(b._id)}
                    itemName="this banner"
                    buttonClass="button-danger"
                  />
                </>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
