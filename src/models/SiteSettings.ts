import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    notificationEmail: { type: String, trim: true, default: "" },
    contactEmail: { type: String, trim: true, default: "" },
    siteUrl: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

export type SiteSettingsDocument = InferSchemaType<typeof SiteSettingsSchema> & {
  _id: string;
};

export const SiteSettingsModel =
  (models.SiteSettings as Model<SiteSettingsDocument>) ||
  model("SiteSettings", SiteSettingsSchema);
