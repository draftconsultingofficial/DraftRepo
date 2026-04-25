import { requireMainAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { StaffUserModel } from "@/models/StaffUser";
import UserCard from "@/components/admin/user-card";
import { TeamForm } from "@/components/admin/team-form";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  await requireMainAdmin();
  await connectToDatabase();

  const staffUsers = await StaffUserModel.find({ role: "contributor" }).sort({ createdAt: -1 }).lean();
  const mainAdminUser = {
    _id: "main_admin_env",
    email: process.env.MAIN_ADMIN_EMAIL?.trim().toLowerCase(),
    role: "main_admin",
    active: true,
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Team access</p>
        <h1 className="mt-2 font-semibold text-4xl text-gray-900">
          Manage contributors
        </h1>
        <p className="mt-3 text-base text-gray-600">
          Create contributor accounts for staff who need to add and view data. Updates and deletions remain restricted to admins.
        </p>
      </div>

      <TeamForm />

      <div className="space-y-3">
        {mainAdminUser.email && (
          <UserCard key="main_admin_env" user={mainAdminUser} />
        )}
        {staffUsers.length > 0 ? (
          staffUsers.map((user) => (
            <UserCard key={String(user._id)} user={user} />
          ))
        ) : (
          <div className="admin-card p-6 text-sm text-gray-600 text-center">
            No contributor accounts have been added yet.
          </div>
        )}
      </div>
    </div>
  );
}
