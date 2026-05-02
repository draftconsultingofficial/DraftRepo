/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { companyName } from "@/lib/site";

export const metadata = {
  title: "Our Team | " + companyName,
  description: "Meet the experienced professionals leading our HR recruitment and talent services.",
};

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="panel rounded-lg p-10 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Meet Our Team
            </p>
            <h1 className="mt-4 font-semibold text-4xl text-gray-900 lg:text-5xl">
              Industry Experts Dedicated to Your Success
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              Our experienced team combines decades of expertise in HR recruitment, banking, and talent management. We're committed to understanding your unique needs and delivering exceptional results through personalized service and deep industry knowledge.
            </p>
          </div>
        </section>

        {/* Team Members */}
        <section className="mb-20">
          <div className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Our Leadership
            </p>
            <h2 className="mt-3 font-semibold text-3xl text-gray-900">Meet the Experts</h2>
          </div>

          {/* Savita Rani */}
          <div className="mb-20 grid gap-12 md:grid-cols-3 md:items-start">
            {/* <div className="md:col-span-1">
              <img
                src="https://quickpeople.in/wp-content/uploads/2025/07/Savita-Rani_Co-founder-Director.jpg"
                alt="Savita Rani - Co-founder & Director"
                className="aspect-square rounded-lg object-cover w-full shadow-lg"
              />
            </div> */}
            <div className="md:col-span-1">
  <img
    src="https://quickpeople.in/wp-content/uploads/2025/07/Savita-Rani_Co-founder-Director.jpg"
    alt="Savita Rani - Co-founder & Director"
    className="w-full rounded-lg object-contain shadow-lg"
  />
</div>

            <div className="md:col-span-2">
              <h3 className="font-semibold text-3xl text-gray-900">Savita Rani</h3>
              <p className="mt-2 text-lg font-medium text-blue-600">Co-founder & Director</p>
              
              <div className="mt-6 space-y-4 text-base leading-7 text-gray-600">
                <p>
                  Savita is a Co-founder & Director with a passion for building exceptional teams and fostering workplace growth. She brings extensive experience in the Education & Training sector combined with a strong flair for Sales & Marketing strategies.
                </p>
                
                <p>
                  Her core expertise spans career counselling, talent coaching, and organizational development. She has been instrumental in creating workspaces that serve as catalysts for personal growth, with integrity, innovation, and value at the core. Her approach to talent development emphasizes building organizations from the ground up through strategic hiring models and continuous learning.
                </p>

                <p>
                  Savita holds a Post-Graduate degree from Kurukshetra University, Kurukshetra and a D.Ed (Diploma in Education) qualification. Her transition from education to the job placement industry reflects her commitment to connecting talented individuals with meaningful career opportunities.
                </p>
              </div>

              <div className="mt-8 border-t pt-6">
                <h4 className="font-semibold text-gray-900">Key Expertise</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Talent Recruitment", "Career Counselling", "Organizational Development", "Training & Development", "Sales & Marketing"].map((skill) => (
                    <span key={skill} className="inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rakesh Kumar */}
          <div className="grid gap-12 md:grid-cols-3 md:items-start">
            {/* <div className="md:col-span-1 md:order-2">
              <img
                src="https://quickpeople.in/wp-content/uploads/2025/07/Rakesh-Kumar_National-Head-HRBP.jpg"
                alt="Rakesh Kumar - Business Partner & National Head HRBP"
                className="aspect-square rounded-lg object-cover w-full shadow-lg"
              />
            </div> */}
            <div className="md:col-span-1 md:order-2">
  <img
    src="https://quickpeople.in/wp-content/uploads/2025/07/Rakesh-Kumar_National-Head-HRBP.jpg"
    alt="Rakesh Kumar - Business Partner & National Head HRBP"
    className="w-full rounded-lg object-contain shadow-lg"
  />
</div>

            <div className="md:col-span-2 md:order-1">
              <h3 className="font-semibold text-3xl text-gray-900">Rakesh Kumar</h3>
              <p className="mt-2 text-lg font-medium text-blue-600">Business Partner & National Head – HRBP</p>
              
              <div className="mt-6 space-y-4 text-base leading-7 text-gray-600">
                <p>
                  Rakesh brings 15+ years of rich, hands-on experience across Banking, HR, and Financial Services sectors. He has successfully partnered with industry-leading organizations including HDFC Bank, HDFC Life, Bajaj Life, and Max Life, managing diverse teams and delivering exceptional business results.
                </p>

                <p>
                  During his 10-year tenure in Bancassurance, Rakesh managed a core team of 30 members along with an extended channel staff exceeding 70 professionals. He achieved numerous remarkable milestones in business growth, customer acquisition, and team development. His experience spans B2B and B2C operations across Insurance for 10 years and Banking products for 5 years, providing him with comprehensive knowledge of financial services.
                </p>

                <p>
                  After completing his MBA from Bangalore University, Rakesh made a strategic career shift to pursue his passion in the job placement industry. He leverages his deep BFSI sector expertise to recruit top talent for Insurance, Banking, and Finance roles. His leadership approach emphasizes continuous process improvement, HR strategy integration, and building collaborative networks that drive organizational success.
                </p>
              </div>

              <div className="mt-8 border-t pt-6">
                <h4 className="font-semibold text-gray-900">Key Expertise</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Banking & Finance", "Insurance Industry", "Team Leadership", "BFSI Recruitment", "Process Optimization", "Strategic HR"].map((skill) => (
                    <span key={skill} className="inline-block rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20 rounded-lg bg-linear-to-r from-blue-50 to-gray-50 p-10 md:p-12">
          <h2 className="font-semibold text-2xl text-gray-900">What Drives Us</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Expertise</h3>
              <p className="mt-2 text-gray-600">
                Deep industry knowledge combined with proven recruitment success across BFSI, banking, and finance sectors.
              </p>
            </div>
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Integrity</h3>
              <p className="mt-2 text-gray-600">
                Honest, transparent partnerships built on trust and long-term relationships with both employers and candidates.
              </p>
            </div>
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Results</h3>
              <p className="mt-2 text-gray-600">
                Focused on delivering measurable outcomes and building lasting success for our clients and candidates.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-lg bg-linear-to-r from-blue-600 to-blue-800 p-10 text-center md:p-12 text-white">
          <h2 className="font-semibold text-3xl">Ready to Work With Us?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg opacity-90">
            Whether you're looking to hire top talent or advance your career, our team is here to help you achieve your goals.
          </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
  {/* Primary Button */}
  <a
    href="/contact"
    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors duration-200"
  >
    Get In Touch
  </a>

  {/* Outline Button */}
  <a
    href="/"
    className="inline-flex items-center justify-center rounded-lg border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
  >
    Learn More
  </a>
</div>

        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
