import Image from "next/image";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { defaultSiteUrl } from "@/lib/site";
import { parseMarkdown } from "@/lib/format";
import { JobModel } from "@/models/Job";
import { ApplyForm } from "@/components/public/apply-form";
import { PublicFooter } from "@/components/public/footer";
import { PublicHeader } from "@/components/public/header";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();
  const job = await JobModel.findOne({ slug }).lean();

  if (!job) {
    return {};
  }

  const title = job.seoTitle || `${job.title} in ${job.location}`;
  const description = job.seoDescription || job.description;
  const image = `${defaultSiteUrl}/jobs/${job.slug}/opengraph-image`;
  const logo = job.companyLogo ? (job.companyLogo.startsWith("/") ? `${defaultSiteUrl}${job.companyLogo}` : job.companyLogo) : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${defaultSiteUrl}/jobs/${job.slug}`,
      images: logo ? [{ url: logo, width: 600, height: 600, alt: job.companyName }, { url: image, width: 1200, height: 630, alt: job.title }] : [{ url: image, width: 1200, height: 630, alt: job.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: logo ? [logo, image] : [image],
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();
  const job = await JobModel.findOne({ slug }).lean();

  if (!job) {
    notFound();
  }

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

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="panel rounded-lg p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                {job.companyName} • {job.department}
              </p>
              <h1 className="mt-4 font-semibold text-4xl text-gray-900">
                {job.title}
              </h1>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium text-gray-600">
                {job.location && <span>{job.location}</span>}
                {job.location && (job.employmentType || job.experience || job.salaryType) && <span className="text-gray-300">•</span>}
                {job.employmentType && <span>{job.employmentType}</span>}
                {job.employmentType && (job.experience || job.salaryType) && <span className="text-gray-300">•</span>}
                {job.experience && <span>{job.experience}</span>}
                {job.experience && job.salaryType && <span className="text-gray-300">•</span>}
                {job.salaryType && <span className="font-medium text-gray-900">{formatSalary(job.salaryType, job.salaryMin, job.salaryMax)}</span>}
              </div>
            </div>

            {/* Image removed */}

            <div className="panel rounded-lg p-10">
              <div className="prose prose-blue max-w-none text-base leading-7 text-gray-600" dangerouslySetInnerHTML={{ __html: parseMarkdown(job.description || "") }}></div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            {job.isAcceptingApplications !== false ? (
              <>
                <div className="panel-dark rounded-lg p-8 text-white mb-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-100">Apply now</p>
                  <h2 className="mt-3 font-semibold text-2xl">Start your application</h2>
                  <p className="mt-4 text-sm leading-6 text-blue-50">
                    Submit your details and resume directly through the website. You will receive a confirmation email right away.
                  </p>
                </div>
                <ApplyForm jobId={String(job._id)} />
              </>
            ) : (
              <div className="rounded-lg p-8 text-gray-900 bg-gray-50 border border-gray-200">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Status Closed</p>
                <h2 className="mt-3 font-semibold text-xl">Not accepting applications</h2>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  This role is no longer actively accepting new candidates. We have retained this page for historical transparency. 
                </p>
              </div>
            )}
          </aside>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              title: job.title,
              description: job.description,
              hiringOrganization: {
                "@type": "Organization",
                name: job.companyName || "Draft Consulting",
              },
              employmentType: job.employmentType,
              jobLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: job.location,
                },
              },
              url: `${defaultSiteUrl}/jobs/${job.slug}`,
            }),
          }}
        />
      </main>
      <PublicFooter />
    </div>
  );
}
