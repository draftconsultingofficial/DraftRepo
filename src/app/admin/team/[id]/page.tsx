import { connectToDatabase } from "@/lib/db";
import { requireMainAdmin } from "@/lib/auth";
import { StaffUserModel } from "@/models/StaffUser";
import { UserRoleForm } from "@/components/admin/user-role-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ManageUserRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireMainAdmin();
  await connectToDatabase();

  const user = await StaffUserModel.findById(id).lean();

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-4xl text-gray-900">Manage User Role</h1>
        <p className="mt-3 text-base text-gray-600">
          Update permissions and access level for team members
        </p>
      </div>

      <UserRoleForm user={user} />
    </div>
  );
}
