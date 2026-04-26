import Link from "next/link";
import Image from "next/image";
import { connectToDatabase } from "@/lib/db";
import { formatDate, parseMarkdown, stripMarkdown } from "@/lib/format";
import { companyName, companyTagline, defaultSiteUrl } from "@/lib/site";
import { JobModel } from "@/models/Job";
import { BannerModel } from "@/models/Banner";
import { PublicFooter } from "@/components/public/footer";
import { PublicHeader } from "@/components/public/header";
import BannerCarousel from "@/components/public/banner-carousel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `${companyName} | Executive Recruitment & Placement`,
  description: companyTagline,
  openGraph: {
    title: `${companyName} | Executive Recruitment & Placement`,
    description: companyTagline,
    url: defaultSiteUrl,
    siteName: companyName,
    images: [{ url: `${defaultSiteUrl}/logo.png`, width: 1200, height: 630, alt: companyName }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${companyName} | Executive Recruitment & Placement`,
    description: companyTagline,
    images: [`${defaultSiteUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Home() {
  await connectToDatabase();
  
  const [featuredJobs, activeBanners] = await Promise.all([
    JobModel.find({ isAcceptingApplications: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    BannerModel.find({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    })
      .sort({ position: 1 })
      .lean(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: companyName,
            url: defaultSiteUrl,
            logo: `${defaultSiteUrl}/logo.png`,
            description: companyTagline,
          }),
        }}
      />
      
      {/* Hero Banner Section */}
      {activeBanners.length > 0 ? (
        (() => {
          const simpleBanners = activeBanners.map((b) => ({
            _id: String(b._id),
            title: b.title,
            description: b.description,
            link: b.link,
            imagePath: b.imagePath,
          }));
          return <BannerCarousel banners={simpleBanners} />;
        })()
      ) : (
        <section className="relative py-16 lg:py-24 bg-linear-to-br from-blue-900 to-slate-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="text-white max-w-2xl">
                <p className="text-blue-200 text-sm md:text-base font-semibold tracking-widest uppercase mb-4">Executive Recruitment & Placement</p>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{companyName} — Strategic hiring that scales your business</h1>
                <p className="text-lg text-blue-100 mb-6 leading-relaxed">We combine executive search discipline with modern recruitment practices to help growth-focused companies attract, assess and retain top talent.</p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/jobs" className="button-primary text-lg py-3 px-6">View Current Mandates</Link>
                  <Link href="/about" className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-6 py-3 font-semibold text-white hover:bg-white/10 transition">About Us</Link>
                </div>
                <div className="mt-8 text-sm text-blue-200">
                  <p className="mb-2">Experienced consultants. Honest processes. Measurable impact.</p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="text-xs bg-white/10 px-3 py-1 rounded">Confidential searches</div>
                    <div className="text-xs bg-white/10 px-3 py-1 rounded">Role-specific assessment</div>
                    <div className="text-xs bg-white/10 px-3 py-1 rounded">Transparent communication</div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-center">
                <div className="w-full max-w-md bg-white/5 rounded-xl p-8">
                  <p className="text-sm text-blue-100 mb-4">Our latest mandates</p>
                  <ul className="space-y-4">
                    {featuredJobs.slice(0, 4).map((j) => (
                      <li key={String(j._id)} className="text-white/90">{j.title} <span className="text-blue-200">— {j.companyName}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <main>
        {/* Why Choose Us Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase">Why Partner With Us</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-gray-900">
              Recruitment Built For Excellence
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "🎯",
                title: "Precision Matching",
                description: "We understand your business. Detailed role analysis ensures we source candidates who truly fit your culture and requirements.",
              },
              {
                icon: "⚡",
                title: "Speed & Efficiency",
                description: "Fast-track hiring without compromising quality. Our streamlined process gets you qualified candidates quickly.",
              },
              {
                icon: "🤝",
                title: "Consultative Approach",
                description: "We partner with you as an extension of your team, providing insights and guidance throughout the hiring journey.",
              },
              {
                icon: "✨",
                title: "Candidate Experience",
                description: "Professional, transparent communication from application to offer. Creating positive impressions of your brand.",
              },
              {
                icon: "📊",
                title: "Data-Driven Decisions",
                description: "Metrics-based sourcing and placement strategies ensure we optimize for success at every stage.",
              },
              {
                icon: "🔒",
                title: "Compliance & Security",
                description: "Rigorous screening, background checks, and legal compliance. Peace of mind in every placement.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-xl border border-gray-200 hover:border-blue-600 hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* (removed network block to keep site focused and honest) */}

        {/* Our Approach */}
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase">Our Approach</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">How we deliver value</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Senior-led Search",
                desc: "Every engagement is led by experienced consultants who guide the process and ensure quality outcomes.",
              },
              {
                title: "Tailored Assessment",
                desc: "Role-specific evaluation and structured interviews to reduce hiring risk and identify the right cultural fit.",
              },
              {
                title: "Confidential Delivery",
                desc: "We manage sensitive searches with discretion and consistent communication throughout the process.",
              },
            ].map((t) => (
              <div key={t.title} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="bg-linear-to-br from-blue-900 to-slate-900 rounded-2xl p-12 lg:p-16 text-white">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              {[
                { title: "Executive Search", desc: "Targeted search for senior leadership and strategic roles." },
                { title: "Assessment & Selection", desc: "Evidence-based evaluation methods to surface top candidates." },
                { title: "Advisory", desc: "Market insights and hiring strategy aligned to your growth goals." },
                { title: "Flexible Delivery", desc: "Retained, contingency or project-based search models." },
              ].map((item) => (
                <div key={item.title}>
                  <p className="text-2xl font-semibold mb-2">{item.title}</p>
                  <p className="text-blue-100 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-12">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase">Active Opportunities</p>
            <div className="flex items-end justify-between gap-4 mt-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Current Hiring Mandates
                </h2>
                <p className="text-gray-600 mt-2">Explore open positions across our network of growth-focused organizations</p>
              </div>
              <Link
                href="/jobs"
                className="hidden md:inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold whitespace-nowrap"
              >
                View All Jobs →
              </Link>
            </div>
          </div>

          {featuredJobs.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredJobs.map((job) => (
                  <Link
                    key={String(job._id)}
                    href={`/jobs/${job.slug}`}
                    className="group p-6 rounded-xl border border-gray-200 hover:border-blue-600 hover:shadow-lg transition flex flex-col"
                  >
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{job.department}</p>
                      <h3 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-2">{job.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{stripMarkdown(job.description || "").slice(0, 200)}</p>
                    <div className="mt-auto flex items-center gap-3 text-blue-600 font-semibold text-sm">
                      Apply Now →
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-12 text-center md:hidden">
                <Link href="/jobs" className="button-primary">
                  View All Opportunities
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
              <p className="text-gray-600 text-lg">No active mandates at the moment.</p>
              <p className="text-gray-500 mt-2">Check back soon or contact us for upcoming opportunities.</p>
            </div>
          )}
        </section>

        {/* Services Section */}
        <section className="bg-linear-to-br from-slate-50 to-blue-50 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase">Our Services</p>
              <h2 className="mt-2 text-4xl md:text-5xl font-bold text-gray-900">
                Complete Recruitment Solutions
              </h2>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
              {[
                {
                  title: "Executive Search",
                  description: "Targeted search for C-level and strategic leadership positions. We identify and evaluate candidates with specialized expertise.",
                  points: ["Senior leadership roles", "Specialized expertise", "Confidential searches"],
                },
                {
                  title: "Permanent Placement",
                  description: "Full-cycle recruitment for permanent roles across all levels and functions. From posting to onboarding support.",
                  points: ["All experience levels", "Multiple departments", "Post-placement support"],
                },
                {
                  title: "Team Building",
                  description: "Grow your organization with strategic team composition. We help you build complete, high-performing departments.",
                  points: ["Bulk hiring", "Team composition", "Culture fit analysis"],
                },
                {
                  title: "Contract & Interim",
                  description: "Flexible staffing solutions for temporary or contract roles. Fill gaps quickly without long-term commitments.",
                  points: ["Quick deployment", "Flexible terms", "High-quality candidates"],
                },
              ].map((service) => (
                <div
                  key={service.title}
                  className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-center gap-3 text-sm text-gray-700">
                        <span className="block h-2 w-2 rounded-full bg-blue-600"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-2xl bg-linear-to-r from-blue-900 to-slate-900 p-12 lg:p-16 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Hire Your Next Team Member?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Whether you're looking to fill a single role or build entire departments, we're here to help you find the right talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="button-primary bg-white text-blue-900 hover:bg-gray-100">
                Explore Open Positions
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-8 py-4 font-semibold text-white hover:bg-white/10 transition">
                Get In Touch
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
