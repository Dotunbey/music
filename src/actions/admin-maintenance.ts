"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-session";
import { auditOrphanedStorage } from "@/lib/storage-audit";
import { getGalleryBucketName, getSupabaseAdminClient } from "@/lib/supabase-admin";
export async function deleteOrphan(formData: FormData) {
  await requireAdmin();
  const path = z.string().min(3).max(500).refine((value) => !value.includes("..")).parse(formData.get("path"));
  if (!(await auditOrphanedStorage()).some((item) => item.path === path)) throw new Error("This object is referenced or is too new to delete.");
  const { error } = await getSupabaseAdminClient().storage.from(getGalleryBucketName()).remove([path]);
  if (error) throw error;
  revalidatePath("/admin/maintenance");
}
