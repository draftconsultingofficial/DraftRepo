import { requireSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { SiteSettingsModel } from "@/models/SiteSettings";
import { saveSettingsAction } from "@/server/admin-actions";
import { PasswordResetForm } from "@/components/admin/password-reset-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await requireSession();
  await connectToDatabase();
  const settings = await SiteSettingsModel.findOne({ key: "main" }).lean();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          Settings
        </p>
        <h1 className="mt-2 font-semibold text-4xl text-gray-900">
          {session.role === "main_admin" ? "Platform & Security Settings" : "Security Settings"}
        </h1>
        <p className="mt-3 text-base text-gray-600">
          {session.role === "main_admin" 
            ? "Configure notification emails and manage your security credentials."
            : "Manage your security credentials."}
        </p>
      </div>

      {session.role === "main_admin" && (
        <form action={saveSettingsAction} className="admin-card space-y-6 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Notification email</label>
              <input
                className="field"
                type="email"
                name="notificationEmail"
                defaultValue={settings?.notificationEmail}
                placeholder="recruitment@draftconsulting.com"
              />
              <p className="text-xs text-gray-500">Inbox for job application alerts.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Contact email</label>
              <input
                className="field"
                type="email"
                name="contactEmail"
                defaultValue={settings?.contactEmail}
                placeholder="contact@draftconsulting.com"
              />
              <p className="text-xs text-gray-500">Public-facing contact email.</p>
            </div>
          </div>
          <button className="button-primary">
            Save platform settings
          </button>
        </form>
      )}

      <PasswordResetForm />
    </div>
  );
}

