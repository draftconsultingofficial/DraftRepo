"use client";

import { useActionState } from "react";
import { updateStaffRoleAction } from "@/server/admin-actions";

export function UserRoleForm({ user }: { user: any }) {
  const [state, formAction, pending] = useActionState(updateStaffRoleAction, {
    success: false,
    message: "",
  });

  return (
    <form action={formAction} className="admin-card p-6 grid gap-6 md:grid-cols-2">
      <input type="hidden" name="userId" value={String(user._id)} />

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900">Role</label>
        <select className="field" name="role" defaultValue={user.role}>
          <option value="contributor">Contributor</option>
          <option value="main_admin">Main Admin</option>
        </select>
      </div>

      <div className="flex flex-col justify-end gap-2">
        <button
          className="button-primary w-full disabled:opacity-50"
          disabled={pending}
        >
          {pending ? "Saving..." : "Update role"}
        </button>
      </div>

      {state?.message && (
        <div className={`md:col-span-2 text-sm font-medium p-3 rounded-lg ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {state.message}
        </div>
      )}
    </form>
  );
}
