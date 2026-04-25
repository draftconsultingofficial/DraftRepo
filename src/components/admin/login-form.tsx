"use client";

import { useActionState } from "react";
import { loginAction } from "@/server/admin-actions";

const initialState = {
  success: false,
  message: "",
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="admin-card space-y-5 p-8">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900">
          Email
        </label>
        <input className="field" type="email" name="email" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900">
          Password
        </label>
        <input className="field" type="password" name="password" required />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="button-primary w-full disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {state.message ? (
        <p className="text-sm text-red-700 font-medium">{state.message}</p>
      ) : null}
    </form>
  );
}
