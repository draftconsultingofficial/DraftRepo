import type { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/db";
import { defaultSiteUrl } from "@/lib/site";
import { JobModel } from "@/models/Job";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectToDatabase();
  const jobs = await JobModel.find({ isAcceptingApplications: true }).lean();

  return [
    {
      url: defaultSiteUrl,
      lastModified: new Date(),
    },
    {
      url: `${defaultSiteUrl}/jobs`,
      lastModified: new Date(),
    },
    ...jobs.map((job) => ({
      url: `${defaultSiteUrl}/jobs/${job.slug}`,
      lastModified: new Date(job.updatedAt),
    })),
  ];
}
