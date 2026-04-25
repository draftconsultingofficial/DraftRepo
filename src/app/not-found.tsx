import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="eyebrow text-(--color-blue)">
          Page not found
        </p>
        <h1 className="mt-3 font-serif text-5xl text-(--color-ink)">
          This page is no longer available.
        </h1>
        <p className="mt-4 text-lg text-(--color-slate)">
          Try going back to the jobs page or return to the Draft Consulting home page.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/" className="rounded-full bg-(--color-ink) px-6 py-3 text-sm font-semibold text-white">
            Home
          </Link>
          <Link href="/jobs" className="rounded-full border border-(--color-line) px-6 py-3 text-sm font-semibold">
            Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
