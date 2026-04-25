import { connectToDatabase } from "@/lib/db";
import { AuditLogModel } from "@/models/AuditLog";

export async function logAction(action: string, performedBy: string, details: string) {
  try {
    await connectToDatabase();
    await AuditLogModel.create({
      action,
      performedBy,
      details,
    });
  } catch (err) {
    console.error("Failed to write to AuditLog", err);
  }
}
