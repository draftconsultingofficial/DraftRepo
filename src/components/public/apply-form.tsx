"use client";

import { useActionState, useRef, useTransition } from "react";
import { submitApplicationAction } from "@/server/public-actions";

const initialState = {
  success: false,
  message: "",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [".pdf", ".doc", ".docx"];

export function ApplyForm({ jobId }: { jobId: string }) {
  const [state, dispatch, pending] = useActionState(
    submitApplicationAction,
    initialState,
  );
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = (data.get("name") as string)?.trim();
    const phone = (data.get("phone") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const resume = data.get("resume") as File;

    if (!name) { alert("Please enter your full name."); return; }
    if (!phone) { alert("Please enter your phone number."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Please enter a valid email address."); return; }
    if (!resume || resume.size === 0) { alert("Please upload your resume."); return; }
    if (resume.size > MAX_FILE_SIZE) { alert("File must be 5 MB or smaller."); return; }
    const ext = "." + resume.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_TYPES.includes(ext)) { alert("Only PDF, DOC, or DOCX files are accepted."); return; }

    startTransition(() => {
      dispatch(data);
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="panel space-y-6 rounded-lg p-8">
      <input type="hidden" name="jobId" value={jobId} />

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
        Share your contact details and upload your latest CV. Our recruitment team will review your profile and reach out if it aligns with the role.
      </div>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold text-gray-900">
          Full name <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          required
          name="name"
          type="text"
          className="field"
          placeholder="Your full name"
          disabled={pending}
          autoComplete="name"
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-semibold text-gray-900">
            Phone number <span className="text-red-600">*</span>
          </label>
          <input
            id="phone"
            required
            name="phone"
            type="tel"
            className="field"
            placeholder="+91 98765 43210"
            disabled={pending}
            autoComplete="tel"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-gray-900">
            Email address <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            required
            type="email"
            name="email"
            className="field"
            placeholder="you@example.com"
            disabled={pending}
            autoComplete="email"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="resume" className="text-sm font-semibold text-gray-900">
          Resume / CV <span className="text-red-600">*</span>
        </label>
        <div className="text-xs text-gray-500 mb-2">Maximum file size: 5MB (PDF, DOC, DOCX)</div>
        <input
          id="resume"
          required
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          className="field file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-700 cursor-pointer"
          disabled={pending}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Submitting..." : "Submit application"}
      </button>
      {state.message ? (
        <div className={`p-4 rounded-lg text-sm font-medium ${state.success ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
