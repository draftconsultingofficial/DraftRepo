import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { companyName, companyInfo } from "@/lib/site";

export function PublicFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white p-1">
            <LogoMark className="h-full w-full" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">{companyName}</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
              Strategic recruitment and placement support for companies that need credible hiring processes, stronger role presentation, and a smoother candidate experience.
            </p>
          </div>
        </div>
        <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-gray-900 text-xs uppercase tracking-wider">Navigation</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition">Home</Link>
              <Link href="/jobs" className="text-gray-600 hover:text-gray-900 transition">Jobs</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition">About Us</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition">Contact</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-xs uppercase tracking-wider">Contact</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href={`mailto:${companyInfo.email}`} className="text-gray-600 hover:text-gray-900 transition text-xs">{companyInfo.email}</a>
              <a href={`tel:${companyInfo.phone[0]}`} className="text-gray-600 hover:text-gray-900 transition text-xs">{companyInfo.phone[0]}</a>
              <p className="text-gray-600 text-xs">{companyInfo.address.city}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-white px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved. | GST: {companyInfo.gst}</p>
        </div>
      </div>
    </footer>
  );
}
