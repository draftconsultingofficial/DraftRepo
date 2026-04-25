import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { ContactForm } from "@/components/public/contact-form";
import { companyInfo, companyName } from "@/lib/site";

export const metadata = {
  title: "Contact Us | " + companyName,
  description: "Get in touch with Draft Consulting for recruitment and hiring solutions.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/* Header */}
        <section className="mb-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Get in touch
            </p>
            <h1 className="mt-4 font-semibold text-4xl text-gray-900">Contact Us</h1>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Have questions about our services or want to discuss your hiring needs? We'd love to hear from you.
              Reach out using the form below or contact us directly.
            </p>
          </div>
        </section>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <section>
            <div className="mb-6">
              <h2 className="font-semibold text-2xl text-gray-900">Send us a message</h2>
            </div>
            <ContactForm />
          </section>

          {/* Contact Information */}
          <section>
            <div className="mb-8">
              <h2 className="font-semibold text-2xl text-gray-900">Contact Information</h2>
            </div>

            <div className="space-y-8">
              {/* Email */}
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</p>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="mt-3 block text-lg font-medium text-blue-600 hover:text-blue-700"
                >
                  {companyInfo.email}
                </a>
                <p className="mt-2 text-sm text-gray-600">
                  We typically respond within 24 business hours.
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Phone</p>
                <div className="mt-3 space-y-2">
                  {companyInfo.phone.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone}`}
                      className="block text-lg font-medium text-blue-600 hover:text-blue-700"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600">Available Monday - Friday, 9 AM - 6 PM IST</p>
              </div>

              {/* Address */}
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Office Address</p>
                <p className="mt-3 text-base leading-7 text-gray-900">
                  {companyInfo.address.street}<br />
                  {companyInfo.address.area}<br />
                  {companyInfo.address.city} • {companyInfo.address.postal}<br />
                  {companyInfo.address.state}, {companyInfo.address.country}
                </p>
              </div>

              {/* Website */}
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Website</p>
                <p className="mt-3 text-base font-medium text-gray-900">{companyInfo.website}</p>
              </div>

              {/* Compliance */}
              <div className="rounded-lg bg-gray-50 p-6 border border-gray-200">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Business Details</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">GST Number:</span>
                    <p className="font-mono text-gray-900">{companyInfo.gst}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">TIN Number:</span>
                    <p className="font-mono text-gray-900">{companyInfo.tin}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
