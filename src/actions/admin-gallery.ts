"use server";

import { revalidatePath } from "next/cache";
import { and, eq, max } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-session";
import { getDbClient } from "@/lib/db/client";
import {
  galleryCategoryEnum,
  galleryItems,
  galleryItemStatusEnum,
  galleryMediaTypeEnum,
} from "@/lib/db/schema";
import { ensureGalleryBucket, getGalleryBucketName, getSupabaseAdminClient } from "@/lib/supabase-admin";

const categorySchema = z.enum(galleryCategoryEnum.enumValues);
const mediaTypeSchema = z.enum(galleryMediaTypeEnum.enumValues);
const statusSchema = z.enum(galleryItemStatusEnum.enumValues);
const pathSchema = z.string().min(3).max(500).refine((value) => !value.includes(".."), "Invalid storage path.");
const optionalPathSchema = z.preprocess((value) => value || "", z.string().max(500).refine((value) => !value.includes(".."), "Invalid storage path."));
const sourceUrlSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.union([
    z.literal(""),
    z.string().url().max(500).refine((value) => {
      const url = new URL(value);
      return ["youtube.com", "www.youtube.com", "youtu.be", "www.youtu.be"].includes(url.hostname);
    }, "Use a YouTube URL."),
  ]),
);

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const maxImageBytes = 20 * 1024 * 1024;
const maxVideoBytes = 50 * 1024 * 1024;

function safeFilename(filename: string): string {
  const extension = filename.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] ?? "";
  const stem = filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${stem || "upload"}${extension}`;
}

export type SignedGalleryUpload =
  | { status: "success"; path: string; token: string }
  | { status: "error"; message: string };

export async function createGalleryUploadUrl(input: {
  category: string;
  filename: string;
  contentType: string;
  size: number;
  variant: "media" | "poster";
}): Promise<SignedGalleryUpload> {
  await requireAdmin();

  const category = categorySchema.safeParse(input.category);
  if (!category.success) return { status: "error", message: "Choose a valid gallery category." };
  if (!Number.isSafeInteger(input.size) || input.size <= 0) {
    return { status: "error", message: "The selected file has an invalid size." };
  }
  const isImage = imageTypes.has(input.contentType);
  const isVideo = videoTypes.has(input.contentType);
  if (input.variant === "poster" && !isImage) {
    return { status: "error", message: "Video posters must be JPEG, PNG, WebP, or GIF images." };
  }
  if (input.variant === "media" && !isImage && !isVideo) {
    return { status: "error", message: "Use a JPEG, PNG, WebP, GIF, MP4, WebM, or MOV file." };
  }
  const maxSize = isVideo ? maxVideoBytes : maxImageBytes;
  if (input.size > maxSize) {
    return { status: "error", message: `This file is larger than the ${isVideo ? "50 MB" : "20 MB"} limit.` };
  }

  const path = `${category.data}/${input.variant}/${crypto.randomUUID()}-${safeFilename(input.filename)}`;
  await ensureGalleryBucket();
  const { data, error } = await getSupabaseAdminClient()
    .storage.from(getGalleryBucketName())
    .createSignedUploadUrl(path);
  if (error || !data?.token) {
    console.error("Gallery signed upload URL failed", error);
    return { status: "error", message: "Could not prepare the upload. Try again." };
  }
  return { status: "success", path, token: data.token };
}

const itemFields = z.object({
  title: z.string().trim().min(1).max(160),
  caption: z.string().trim().max(500).optional().default(""),
  category: categorySchema,
  mediaType: mediaTypeSchema,
  storagePath: optionalPathSchema,
  posterPath: pathSchema.optional().or(z.literal("")),
  sourceUrl: sourceUrlSchema,
  sortOrder: z.coerce.number().int().min(0).max(100000),
});

function parseItemFields(formData: FormData) {
  return itemFields.safeParse({
    title: formData.get("title"),
    caption: formData.get("caption"),
    category: formData.get("category"),
    mediaType: formData.get("mediaType"),
    storagePath: formData.get("storagePath"),
    posterPath: formData.get("posterPath") || undefined,
    sortOrder: formData.get("sortOrder"),
  });
}

export type GalleryMutationState = { status: "success" | "error"; message: string };

export async function registerGalleryItem(formData: FormData): Promise<GalleryMutationState> {
  await requireAdmin();
  const title = z.string().trim().min(1).max(160).safeParse(formData.get("title"));
  if (!title.success) return { status: "error", message: "Title is required." };
  const parsed = parseItemFields(formData);
  if (!parsed.success) return { status: "error", message: "Select a category and add the gallery media." };
  if (!parsed.data.storagePath && !parsed.data.sourceUrl) return { status: "error", message: "Add a media file or a YouTube URL." };
  if (parsed.data.sourceUrl && parsed.data.mediaType !== "video") return { status: "error", message: "YouTube links must be video items." };
  const db = await getDbClient();
  const [queue] = await db
    .select({ lastOrder: max(galleryItems.sortOrder) })
    .from(galleryItems)
    .where(eq(galleryItems.category, parsed.data.category));
  const sortOrder = Number(queue?.lastOrder ?? -1) + 1;
  await db.insert(galleryItems).values({
    ...parsed.data,
    storagePath: parsed.data.storagePath || null,
    sortOrder,
    posterPath: parsed.data.posterPath || null,
    sourceUrl: parsed.data.sourceUrl || null,
    status: "draft",
  });
  revalidatePath("/admin/gallery");
  return { status: "success", message: "Upload saved as a draft." };
}

export async function updateGalleryItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().safeParse(formData.get("id"));
  const parsed = parseItemFields(formData);
  if (!id.success || !parsed.success) return;

  const db = await getDbClient();
  const result = await db
    .update(galleryItems)
    .set({
      title: parsed.data.title,
      category: parsed.data.category,
      sortOrder: parsed.data.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(galleryItems.id, id.data))
    .returning({ id: galleryItems.id });
  if (result.length === 0) return;
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function updateGalleryStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = statusSchema.parse(formData.get("status"));
  const rejectionReason = z.string().trim().max(500).parse(formData.get("rejectionReason") ?? "");
  const db = await getDbClient();
  const existing = await db
    .select({ id: galleryItems.id })
    .from(galleryItems)
    .where(and(eq(galleryItems.id, id)));
  if (existing.length === 0) return;

  await db
    .update(galleryItems)
    .set({
      status,
      rejectionReason: status === "rejected" ? rejectionReason || null : null,
      reviewedAt: status === "draft" ? null : new Date(),
      publishedAt: status === "approved" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(galleryItems.id, id));
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}
