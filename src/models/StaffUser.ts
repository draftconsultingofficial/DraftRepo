import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const StaffUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    // Simplified roles: only `main_admin` and `contributor` are used.
    role: { type: String, enum: ["main_admin", "contributor"], default: "contributor" },
    active: { type: Boolean, default: true },
    invitedBy: { type: String, required: true },
    permissions: [{ type: String }],
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },
  },
  { timestamps: true },
);

export type StaffUserDocument = InferSchemaType<typeof StaffUserSchema> & {
  _id: string;
};

if (models.StaffUser) {
  delete models.StaffUser;
}

export const StaffUserModel = model<StaffUserDocument>("StaffUser", StaffUserSchema);
