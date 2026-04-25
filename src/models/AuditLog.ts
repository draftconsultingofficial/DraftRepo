import mongoose, { Schema } from "mongoose";

const auditLogSchema = new Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true },
);

export const AuditLogModel = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
