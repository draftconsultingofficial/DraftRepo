"use client";

import { useState, useEffect } from "react";
import { saveJobAction } from "@/server/admin-actions";
import { parseMarkdown } from "@/lib/format";

type JobShape = {
  _id?: string;
  title?: string;
  slug?: string;
  companyName?: string;
  companyLogo?: string;
  location?: string;
  employmentType?: string;
  experience?: string;
  department?: string;
  salaryType?: string;
  salaryMin?: string;
  salaryMax?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  isAcceptingApplications?: boolean;
};

export function JobForm({ job }: { job?: JobShape }) {
  const [salaryType, setSalaryType] = useState<string>(job?.salaryType || "Fixed Range");
  const [description, setDescription] = useState<string>(job?.description || "");
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string>(job?.companyLogo || "");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  useEffect(() => {
    // detect first YouTube link in description and convert to embed url
    const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/i;
    const match = description.match(ytRegex);
    if (match && match[1]) {
      setVideoPreview(`https://www.youtube.com/embed/${match[1]}`);
    } else {
      setVideoPreview(null);
    }
  }, [description]);
  const [showPreview, setShowPreview] = useState(false);

  const showMin = salaryType === "Fixed Range";
  const showMax = salaryType === "Fixed Range" || salaryType === "Up to X";

  return (
    <form action={saveJobAction} className="admin-card space-y-8 p-8">
      <input type="hidden" name="jobId" value={job?._id || ""} />
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-900">
        Ensure job details are complete and precise. The job description should include all responsibilities, benefits, and requirements in one unified section.
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Job title</label>
          <input className="field" name="title" defaultValue={job?.title} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Company Name</label>
          <input className="field" name="companyName" defaultValue={job?.companyName} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Company logo (URL or upload)</label>
          <input className="field" name="companyLogoUrl" defaultValue={job?.companyLogo || ""} placeholder="https://... or leave blank to upload" />
          <input type="file" name="companyLogo" accept="image/*" className="mt-2" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setCompanyLogoPreview(URL.createObjectURL(f));
          }} />
          {companyLogoPreview && (
            <div className="mt-2 w-28 h-28 rounded overflow-hidden border">
              <img src={companyLogoPreview} alt="logo preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Location</label>
          <input className="field" name="location" defaultValue={job?.location} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Employment type</label>
          <select className="field" name="employmentType" defaultValue={job?.employmentType || "Full-time"} required>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Experience Range</label>
          <input className="field" name="experience" defaultValue={job?.experience} placeholder="e.g. 2-5 years" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Department</label>
          <input className="field" name="department" defaultValue={job?.department} required />
        </div>
        
        {/* Salary Section */}
        <div className="space-y-2 md:col-span-2">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">Salary Configuration</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Salary Type</label>
              <select 
                className="field" 
                name="salaryType" 
                value={salaryType} 
                onChange={(e) => setSalaryType(e.target.value)}
                required
              >
                <option value="Fixed Range">Fixed Range</option>
                <option value="Up to X">Up to X</option>
                <option value="Negotiable (based on CV)">Negotiable (based on CV)</option>
                <option value="Not Disclosed">Not Disclosed</option>
              </select>
            </div>
            {showMin && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">Salary Min</label>
                <input className="field" name="salaryMin" defaultValue={job?.salaryMin} placeholder="$80,000" />
              </div>
            )}
            {showMax && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">Salary Max</label>
                <input className="field" name="salaryMax" defaultValue={job?.salaryMax} placeholder="$120,000" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Job Description</label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition px-3 py-1 rounded border border-blue-200 bg-blue-50 hover:bg-blue-100"
          >
            {showPreview ? "✏️ Edit" : "👁️ Preview"}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Supports Markdown: <code className="bg-gray-100 px-1 rounded"># Heading</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">**bold**</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">- bullet</code>
        </p>
        {showPreview ? (
          <div
            className="min-h-100 w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-800 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(description) || "<p class=\"text-gray-400\">Nothing to preview yet...</p>" }}
          />
        ) : (
          <textarea
            name="description"
            className="min-h-100 field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        )}
      </div>

        {videoPreview && (
          <div className="mt-4">
            <label className="text-sm font-semibold">Detected video preview</label>
            <div className="mt-2 aspect-video w-full rounded overflow-hidden border">
              <iframe src={videoPreview} title="video preview" className="w-full h-full" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
        )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold">SEO title (optional)</label>
          <input className="field" name="seoTitle" defaultValue={job?.seoTitle} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">SEO description (optional)</label>
          <input className="field" name="seoDescription" defaultValue={job?.seoDescription} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">SEO slug (optional)</label>
          <input className="field" name="slug" defaultValue={job?.slug} placeholder="senior-backend-engineer" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[auto] items-start justify-end">
        <label className="flex items-center gap-3 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900 hover:bg-blue-100 transition cursor-pointer">
          <input type="checkbox" name="isAcceptingApplications" defaultChecked={job?.isAcceptingApplications ?? true} className="rounded border-blue-400" />
          Accepting applications
        </label>
      </div>

      <button className="button-primary">
        Save job
      </button>
    </form>
  );
}
