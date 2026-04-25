"use client";

import { useActionState } from "react";
import { submitContactAction } from "@/server/contact-actions";

const initialState = {
  success: false,
  message: "",
};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactAction,
    initialState,
  );

  const handleSubmit = async (formData: FormData) => {
    // Validate name
    const name = formData.get("name") as string;
    if (!name?.trim()) {
      alert("Please enter your full name");
      return;
    }

    // Validate email
    const email = formData.get("email") as string;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.trim() || !emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate phone
    const phone = formData.get("phone") as string;
    if (!phone?.trim()) {
      alert("Please enter your phone number");
      return;
    }

    // Validate subject
    const subject = formData.get("subject") as string;
    if (!subject?.trim()) {
      alert("Please enter a subject");
      return;
    }

    // Validate message
    const message = formData.get("message") as string;
    if (!message?.trim() || message.trim().length < 10) {
      alert("Please enter a message (at least 10 characters)");
      return;
    }

    await formAction(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold text-gray-900">
          Full Name <span className="text-red-600">*</span>
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

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-gray-900">
          Email Address <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          required
          name="email"
          type="email"
          className="field"
          placeholder="you@example.com"
          disabled={pending}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-semibold text-gray-900">
          Phone Number <span className="text-red-600">*</span>
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
        <label htmlFor="subject" className="text-sm font-semibold text-gray-900">
          Subject <span className="text-red-600">*</span>
        </label>
        <input
          id="subject"
          required
          name="subject"
          type="text"
          className="field"
          placeholder="What is this about?"
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold text-gray-900">
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="message"
          required
          name="message"
          className="field min-h-32 resize-none"
          placeholder="Tell us more about your inquiry..."
          disabled={pending}
        />
        <p className="text-xs text-gray-500">Minimum 10 characters</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Sending..." : "Send Message"}
      </button>

      {state.message ? (
        <div className={`p-4 rounded-lg text-sm font-medium ${state.success ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
