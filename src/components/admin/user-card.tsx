import { deleteStaffAction } from "@/server/admin-actions";
import { SafeDelete } from "@/components/admin/delete-action";

export default function UserCard({ user }: { user: any }) {
  return (
    <article className="admin-card p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-gray-900">{user.email}</p>
          <p className="text-sm text-gray-600">
            Role: {user.role === "main_admin" ? "Main Admin" : "Contributor"}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {user.role !== "main_admin" && (
            <SafeDelete 
              formAction={deleteStaffAction}
              payloadKey="userId"
              payloadValue={String(user._id)}
              itemName="this contributor"
              buttonClass="button-danger"
            />
          )}
        </div>
      </div>
    </article>
  );
}
