"use client";

import { useState } from "react";
import { sendPasswordResetOtpAction, verifyAndResetPasswordAction } from "@/server/admin-actions";

export function PasswordResetForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await sendPasswordResetOtpAction();
      if (!res.success) {
        throw new Error(res.message);
      }
      setSuccess(res.message);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await verifyAndResetPasswordAction(formData);
      if (!res.success) {
        throw new Error(res.message);
      }
      setSuccess(res.message);
      setStep(1); // Reset back to initial state
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card space-y-6 p-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Sign-in Password</h2>
        <p className="mt-1 text-sm text-gray-600">
          Reset your password using an email verification code.
        </p>
      </div>

      {error && <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}
      {success && <div className="rounded border border-green-200 bg-green-50 p-4 text-sm text-green-700">{success}</div>}

      {step === 1 && (
        <button
          onClick={handleSendOtp}
          disabled={loading}
          className="button-primary w-auto"
          type="button"
        >
          {loading ? "Sending..." : "Request Reset Code"}
        </button>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-4 max-w-sm">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Verification Code (6-digit)</label>
            <input
              type="text"
              name="otp"
              className="field text-center font-mono tracking-widest"
              placeholder="123456"
              maxLength={6}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="field"
              placeholder="Min 6 characters"
              minLength={6}
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="button-primary"
            >
              {loading ? "Saving..." : "Update Password"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
