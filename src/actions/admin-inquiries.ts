"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-session";
import { getDbClient } from "@/lib/db/client";
import {
  inquiries,
  inquiryEvents,
  inquiryStatusEnum,
  type InquiryStatus,
} from "@/lib/db/schema";
import { logger } from "@/lib/logger";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isInquiryStatus(value: string): value is InquiryStatus {
  return (inquiryStatusEnum.enumValues as readonly string[]).includes(value);
}

export async function updateInquiryStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const inquiryId = String(formData.get("inquiryId") ?? "");
  const toStatus = String(formData.get("toStatus") ?? "");

  if (!UUID_PATTERN.test(inquiryId) || !isInquiryStatus(toStatus)) {
    logger.warn({
      message: "Invalid status update payload",
      context: "admin-inquiries",
    });
    redirect("/admin/inquiries");
  }

  const db = await getDbClient();
  const [existing] = await db
    .select({ status: inquiries.status })
    .from(inquiries)
    .where(eq(inquiries.id, inquiryId));

  if (!existing) {
    redirect("/admin/inquiries");
  }

  if (existing.status !== toStatus) {
    await db
      .update(inquiries)
      .set({ status: toStatus })
      .where(eq(inquiries.id, inquiryId));
    await db.insert(inquiryEvents).values({
      inquiryId,
      fromStatus: existing.status,
      toStatus,
    });
    logger.info({
      message: "Inquiry status updated",
      context: "admin-inquiries",
      inquiryId,
      fromStatus: existing.status,
      toStatus,
    });
  }

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);
  revalidatePath("/admin");
}

export type AdminNoteState = {
  status: "idle" | "success" | "error";
  message: string;
};

const noteSchema = z.object({
  inquiryId: z.string().regex(UUID_PATTERN, "Invalid inquiry."),
  note: z
    .string()
    .trim()
    .min(1, "Write a note before saving.")
    .max(2000, "Keep notes under 2000 characters."),
});

export async function addInquiryNoteAction(
  _prevState: AdminNoteState,
  formData: FormData,
): Promise<AdminNoteState> {
  await requireAdmin();

  const parsed = noteSchema.safeParse({
    inquiryId: formData.get("inquiryId"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid note.",
    };
  }

  try {
    const db = await getDbClient();
    const [existing] = await db
      .select({ id: inquiries.id })
      .from(inquiries)
      .where(eq(inquiries.id, parsed.data.inquiryId));

    if (!existing) {
      return { status: "error", message: "Inquiry no longer exists." };
    }

    await db.insert(inquiryEvents).values({
      inquiryId: parsed.data.inquiryId,
      note: parsed.data.note,
    });
  } catch (error) {
    logger.error({
      message: "Failed to save inquiry note",
      context: "admin-inquiries",
      error,
    });
    return {
      status: "error",
      message: "Could not save the note. Try again.",
    };
  }

  revalidatePath(`/admin/inquiries/${parsed.data.inquiryId}`);
  return { status: "success", message: "Note saved." };
}
