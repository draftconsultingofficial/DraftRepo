import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="grid w-full max-w-5xl gap-10 rounded-[2.5rem] border border-white/70 bg-white/70 p-8 shadow-[0_30px_120px_rgba(16,32,51,0.08)] backdrop-blur lg:grid-cols-[1fr_420px] lg:p-12">
        <div className="space-y-5">
          <p className="eyebrow text-(--color-blue)">
            Contributor access
          </p>
          <h1 className="font-serif text-5xl text-(--color-ink)">
            Secure admin control for jobs, applicants, and team access.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-(--color-slate)">
            The main admin can manage the full portal, while delegated contributor accounts can add and review data; updates and deletions are restricted to admins.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
