"use client";

import { useActionState } from "react";
import { saveStaffAction } from "@/server/admin-actions";

const initialState = {
  success: false,
  message: "",
};

export function TeamForm() {
  const [state, formAction, pending] = useActionState(saveStaffAction, initialState);

  return (
    <form action={formAction} className="admin-card grid gap-6 p-8 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900">Contributor email</label>
        <input className="field" type="email" name="email" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900">Temporary password (optional)</label>
        <input className="field" type="password" name="password" />
      </div>
      <div className="flex flex-col justify-end gap-2">
        <button 
          className="button-primary w-full disabled:opacity-50"
          disabled={pending}
        >
          {pending ? "Saving..." : "Save contributor"}
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
