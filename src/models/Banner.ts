import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const BannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    imagePath: { type: String, required: true },
    link: { type: String, trim: true, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    position: { type: Number, default: 0 },
    aspectRatio: { type: String, enum: ["16:9", "4:3", "1:1"], default: "16:9" },
    createdByEmail: { type: String, required: true },
  },
  { timestamps: true },
);

export type BannerDocument = InferSchemaType<typeof BannerSchema> & {
  _id: string;
};

export const BannerModel =
  (models.Banner as Model<BannerDocument>) || model("Banner", BannerSchema);
