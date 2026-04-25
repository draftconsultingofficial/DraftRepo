"use server";

import { revalidatePath } from "next/cache";
import { requireMainAdmin } from "@/lib/auth";
import { deleteFromR2 } from "@/lib/r2";
import { logAction } from "@/lib/audit";

export async function deleteR2ObjectAction(formData: FormData) {
  const session = await requireMainAdmin();
  const key = String(formData.get("key") || "").trim();

  if (!key) throw new Error("No storage key provided.");

  await deleteFromR2(key);
  await logAction("DELETED_R2_OBJECT", session.email, `Deleted R2 object: ${key}`);

  revalidatePath("/admin/storage");
}
