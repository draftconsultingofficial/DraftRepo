import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/logo.png";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/server/admin-actions";
<meta name="apple-mobile-web-app-title" content="Draft" />

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return <>{children}</>;
  }

  const navItems =
    session.role === "main_admin"
      ? [
          { href: "/admin", label: "Overview" },
          { href: "/admin/jobs", label: "Jobs" },
          { href: "/admin/applications", label: "Applications" },
          { href: "/admin/banners", label: "Banners" },
          { href: "/admin/team", label: "Team Access" },
          { href: "/admin/storage", label: "Storage Manager" },
          { href: "/admin/activity", label: "Activity Log" },
          { href: "/admin/settings", label: "Settings" },
        ]
      : [
          { href: "/admin", label: "Overview" },
          { href: "/admin/jobs", label: "Jobs" },
          { href: "/admin/applications", label: "Applications" },
          { href: "/admin/banners", label: "Banners" },
          { href: "/admin/settings", label: "Settings" },
        ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-gray-200 bg-white px-6 py-8">
          <Link href="/admin" className="block rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 flex items-center justify-center rounded-lg border border-gray-200 bg-white overflow-hidden p-1">
                <Image src={logoImg} alt="Draft" fill className="object-contain p-1" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Dashboard</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">Draft</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600 truncate">{session.email}</div>
          </Link>

          <nav className="mt-8 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form action={logoutAction} className="mt-8">
            <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50">
              Sign out
            </button>
          </form>
        </aside>

        <main className="px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
