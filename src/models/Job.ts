import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const JobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    companyName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    employmentType: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    salaryType: { type: String, required: true, trim: true, enum: ["Fixed Range", "Up to X", "Negotiable (based on CV)", "Not Disclosed"] },
    salaryMin: { type: String, trim: true, default: "" },
    salaryMax: { type: String, trim: true, default: "" },
    description: { type: String, required: true, trim: true },
    seoTitle: { type: String, trim: true, default: "" },
    seoDescription: { type: String, trim: true, default: "" },
    companyLogo: { type: String, trim: true, default: "" },
    isAcceptingApplications: { type: Boolean, default: true },
    createdByEmail: { type: String, required: true },
  },
  { timestamps: true },
);

export type JobDocument = InferSchemaType<typeof JobSchema> & {
  _id: string;
};

if (models.Job) {
  delete models.Job;
}

export const JobModel = model<JobDocument>("Job", JobSchema);
