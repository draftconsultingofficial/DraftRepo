import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/logo.png";
import { navItems, companyName } from "@/lib/site";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6 md:py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 md:h-14 md:w-14 flex items-center justify-center rounded-lg border border-gray-100 bg-white overflow-hidden">
            <Image src={logoImg} alt={companyName} fill className="object-contain p-1 md:p-2" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-xl md:text-2xl">{companyName}</div>
            <div className="mt-1 text-xs md:text-sm text-gray-500">Experienced recruitment consultants</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm md:text-base font-medium text-gray-700 uppercase tracking-wide hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/jobs" className="hidden md:inline-flex rounded-lg border border-gray-300 bg-white px-4 md:px-5 py-2 md:py-3 text-sm md:text-base font-medium text-gray-700 hover:bg-gray-50">
            Open Positions
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 md:px-5 py-2 md:py-3 text-sm md:text-base font-semibold text-white shadow-sm hover:bg-blue-700">
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}
