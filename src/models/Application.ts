import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    jobTitle: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    resumeKey: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    resumeOriginalName: { type: String, required: true },
    resumeMimeType: { type: String, required: true },
    resumeSize: { type: Number, required: true },
    status: {
      type: String,
      enum: ["new", "reviewing", "shortlisted"],
      default: "new",
    },
  },
  { timestamps: true },
);

export type ApplicationDocument = InferSchemaType<typeof ApplicationSchema> & {
  _id: string;
};

export const ApplicationModel =
  (models.Application as Model<ApplicationDocument>) ||
  model("Application", ApplicationSchema);
