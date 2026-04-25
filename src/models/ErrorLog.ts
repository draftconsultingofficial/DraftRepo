import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const ErrorLogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    stackTrace: { type: String, trim: true },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    category: { type: String, enum: ["database", "api", "auth", "file", "email", "validation", "other"], default: "other" },
    userId: { type: String, trim: true, default: null },
    userEmail: { type: String, trim: true, default: null },
    context: { type: Schema.Types.Mixed, default: {} },
    resolved: { type: Boolean, default: false },
    resolvedBy: { type: String, trim: true, default: null },
    resolvedAt: { type: Date, default: null },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type ErrorLogDocument = InferSchemaType<typeof ErrorLogSchema> & {
  _id: string;
};

export const ErrorLogModel =
  (models.ErrorLog as Model<ErrorLogDocument>) || model("ErrorLog", ErrorLogSchema);
