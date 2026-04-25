import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { companyInfo, companyName } from "@/lib/site";

export const metadata = {
  title: "About Us | " + companyName,
  description: "Learn about Draft Consulting and our approach to executive recruitment and hiring solutions.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="panel rounded-lg p-10 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              About our company
            </p>
            <h1 className="mt-4 font-semibold text-4xl text-gray-900 lg:text-5xl">
              {companyInfo.name}
            </h1>
            <p className="mt-4 text-xl font-medium text-blue-700">{companyInfo.tagline}</p>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              {companyInfo.description}
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="mb-20 grid gap-10 md:grid-cols-2">
          <div className="panel rounded-lg p-8">
            <h2 className="font-semibold text-2xl text-gray-900">Our Mission</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              To connect exceptional talent with forward-thinking companies, creating meaningful opportunities that drive mutual growth and success in the competitive business landscape.
            </p>
          </div>
          <div className="panel rounded-lg p-8">
            <h2 className="font-semibold text-2xl text-gray-900">Our Approach</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              We combine executive-search discipline with technology-enabled processes to deliver credible, managed hiring experiences that benefit both employers and candidates.
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="mb-20">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              What we offer
            </p>
            <h2 className="mt-3 font-semibold text-3xl text-gray-900">Our Services</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Executive Search",
                description:
                  "Strategic recruitment for senior-level positions with in-depth candidate vetting and assessment.",
              },
              {
                title: "Placement Services",
                description:
                  "Full-cycle recruitment and hiring support for skilled professionals across various industries.",
              },
              {
                title: "Hiring Operations",
                description:
                  "End-to-end management of your recruitment process with transparency and control.",
              },
              {
                title: "Talent Consulting",
                description:
                  "Advisory services to optimize your hiring strategy and build stronger teams.",
              },
            ].map((service) => (
              <div key={service.title} className="panel rounded-lg p-6">
                <h3 className="font-semibold text-xl text-gray-900">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="panel rounded-lg p-10 bg-linear-to-br from-blue-50 to-gray-50">
          <h2 className="font-semibold text-2xl text-gray-900">Contact Information</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <div>
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</p>
                <a href={`mailto:${companyInfo.email}`} className="mt-2 text-lg font-medium text-blue-600 hover:text-blue-700">
                  {companyInfo.email}
                </a>
              </div>
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Phone</p>
                <div className="mt-2 space-y-1">
                  {companyInfo.phone.map((phone) => (
                    <a key={phone} href={`tel:${phone}`} className="block text-lg font-medium text-blue-600 hover:text-blue-700">
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Website</p>
                <p className="mt-2 text-lg font-medium text-gray-900">{companyInfo.website}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Address</p>
                <p className="mt-2 text-base leading-6 text-gray-600">
                  {companyInfo.address.street}<br />
                  {companyInfo.address.area}<br />
                  {companyInfo.address.city} • {companyInfo.address.postal}<br />
                  {companyInfo.address.state}, {companyInfo.address.country}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-blue-200 pt-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">GST Number</p>
                <p className="mt-2 font-mono text-gray-900">{companyInfo.gst}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">TIN Number</p>
                <p className="mt-2 font-mono text-gray-900">{companyInfo.tin}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
