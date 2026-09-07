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
import { invalidateGallery } from "@/lib/cache-tags";

const categorySchema = z.enum(galleryCategoryEnum.enumValues);
const mediaTypeSchema = z.enum(galleryMediaTypeEnum.enumValues);
const statusSchema = z.enum(galleryItemStatusEnum.enumValues);
const pathSchema = z.string().min(3).max(500).refine((value) => !value.includes(".."), "Invalid storage path.");
const optionalPathSchema = z.preprocess((value) => value || "", z.string().max(500).refine((value) => !value.includes(".."), "Invalid storage path."));
const sourceUrlSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(500),
);
const optionalTextSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.string().max(5000),
);
const seoDescriptionSchema = z.preprocess((value) => typeof value === "string" ? value.trim() : "", z.string().max(320));
const currencySchema = z.preprocess((value) => typeof value === "string" ? value.trim().toUpperCase() : "NGN", z.string().regex(/^[A-Z]{3}$/));

function immutableSlug(title: string, id: string) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "work";
  return `${base}-${id.replaceAll("-", "").slice(0, 8)}`;
}
const optionalHttpsUrlSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : ""),
  z.union([z.literal(""), z.string().url().max(1000).refine((value) => new URL(value).protocol === "https:", "Use an HTTPS checkout URL.")]),
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
  variant: "media" | "poster" | "sample";
}): Promise<SignedGalleryUpload> {
  await requireAdmin();

  const category = categorySchema.safeParse(input.category);
  if (!category.success) return { status: "error", message: "Choose a valid gallery category." };
  if (!Number.isSafeInteger(input.size) || input.size <= 0) {
    return { status: "error", message: "The selected file has an invalid size." };
  }
  const isImage = imageTypes.has(input.contentType);
  const isVideo = videoTypes.has(input.contentType);
  if ((input.variant === "poster" || input.variant === "sample") && !isImage) {
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
  category: categorySchema,
  mediaType: mediaTypeSchema,
  storagePath: optionalPathSchema,
  posterPath: pathSchema.optional().or(z.literal("")),
  sourceUrl: sourceUrlSchema,
  sortOrder: z.coerce.number().int().min(0).max(100000),
});

const registerFields = itemFields.superRefine((value, context) => {
  if (value.category === "short_films") {
    if (value.mediaType !== "video") {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["mediaType"], message: "Short Films must be video items." });
    }
    if (!value.sourceUrl) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["sourceUrl"], message: "Short Films need a YouTube URL." });
      return;
    }
    try {
      const url = new URL(value.sourceUrl);
      if (!["youtube.com", "www.youtube.com", "youtu.be", "www.youtu.be"].includes(url.hostname)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ["sourceUrl"], message: "Use a YouTube URL." });
      }
    } catch {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["sourceUrl"], message: "Enter a valid YouTube URL." });
    }
    if (value.storagePath) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["storagePath"], message: "Short Films use a YouTube URL." });
    }
    return;
  }

  if (!value.storagePath) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["storagePath"], message: "Choose a media file." });
  }
  if (value.sourceUrl) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["sourceUrl"], message: "Only Short Films use a YouTube URL." });
  }
});

export type GalleryMutationState = { status: "success" | "error"; message: string };

export async function registerGalleryItem(formData: FormData): Promise<GalleryMutationState> {
  await requireAdmin();
  const title = z.string().trim().min(1).max(160).safeParse(formData.get("title"));
  if (!title.success) return { status: "error", message: "Title is required." };
  const parsed = registerFields.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    mediaType: formData.get("mediaType"),
    storagePath: formData.get("storagePath"),
    posterPath: formData.get("posterPath") || undefined,
    sourceUrl: formData.get("sourceUrl"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!parsed.success) return { status: "error", message: "Select a category and add the gallery media." };
  const price = optionalTextSchema.safeParse(formData.get("price"));
  const purchaseUrl = optionalHttpsUrlSchema.safeParse(formData.get("purchaseUrl"));
  const excerpt = optionalTextSchema.safeParse(formData.get("excerpt"));
  const seoDescription = seoDescriptionSchema.safeParse(formData.get("seoDescription"));
  const priceAmount = z.coerce.number().int().positive().safeParse(formData.get("priceAmount"));
  const currency = currencySchema.safeParse(formData.get("currency"));
  const samplePaths = formData.getAll("samplePaths").filter((value): value is string => typeof value === "string" && value.length > 0);
  if (!price.success || !purchaseUrl.success || !excerpt.success || !seoDescription.success || samplePaths.some((path) => path.includes(".."))) return { status: "error", message: "Check the gallery details." };
  if (parsed.data.category === "books" && (!priceAmount.success || !currency.success || !purchaseUrl.data)) return { status: "error", message: "Books need a positive price, ISO currency, and secure purchase URL." };
  if (!parsed.data.storagePath && !parsed.data.sourceUrl) return { status: "error", message: "Add a media file or a YouTube URL." };
  if (parsed.data.sourceUrl) {
    try {
      const url = new URL(parsed.data.sourceUrl);
      if (!["youtube.com", "www.youtube.com", "youtu.be", "www.youtu.be"].includes(url.hostname)) {
        return { status: "error", message: "Use a YouTube URL for Short Films." };
      }
    } catch {
      return { status: "error", message: "Enter a valid YouTube URL." };
    }
    if (parsed.data.mediaType !== "video") return { status: "error", message: "YouTube links must be video items." };
  }
  const db = await getDbClient();
  const [queue] = await db
    .select({ lastOrder: max(galleryItems.sortOrder) })
    .from(galleryItems)
    .where(eq(galleryItems.category, parsed.data.category));
  const sortOrder = Number(queue?.lastOrder ?? -1) + 1;
  const id = crypto.randomUUID();
  await db.insert(galleryItems).values({
    id,
    slug: immutableSlug(parsed.data.title, id),
    ...parsed.data,
    storagePath: parsed.data.storagePath || null,
    sortOrder,
    posterPath: parsed.data.posterPath || null,
    sourceUrl: parsed.data.sourceUrl || null,
    price: parsed.data.category === "books" ? price.data || null : null,
    priceAmount: parsed.data.category === "books" && priceAmount.success ? priceAmount.data : null,
    currency: parsed.data.category === "books" && currency.success ? currency.data : "NGN",
    seoDescription: seoDescription.data || null,
    purchaseUrl: parsed.data.category === "books" ? purchaseUrl.data || null : null,
    excerpt: parsed.data.category === "books" ? excerpt.data || null : null,
    samplePaths: parsed.data.category === "books" ? samplePaths : [],
    status: "draft",
  });
  revalidatePath("/admin/gallery");
  return { status: "success", message: "Upload saved as a draft." };
}

export async function updateGalleryItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().safeParse(formData.get("id"));
  const title = z.string().trim().min(1).max(160).safeParse(formData.get("title"));
  const category = categorySchema.safeParse(formData.get("category"));
  const price = optionalTextSchema.safeParse(formData.get("price"));
  const purchaseUrl = optionalHttpsUrlSchema.safeParse(formData.get("purchaseUrl"));
  const excerpt = optionalTextSchema.safeParse(formData.get("excerpt"));
  const seoDescription = seoDescriptionSchema.safeParse(formData.get("seoDescription"));
  const priceAmount = z.coerce.number().int().positive().safeParse(formData.get("priceAmount"));
  const currency = currencySchema.safeParse(formData.get("currency"));
  if (!id.success || !title.success || !category.success || !price.success || !purchaseUrl.success || !excerpt.success || !seoDescription.success) return;
  if (category.data === "books" && (!priceAmount.success || !currency.success || !purchaseUrl.data)) return;

  const db = await getDbClient();
  const result = await db
    .update(galleryItems)
    .set({
      title: title.data,
      category: category.data,
      price: category.data === "books" ? price.data || null : null,
      priceAmount: category.data === "books" && priceAmount.success ? priceAmount.data : null,
      currency: category.data === "books" && currency.success ? currency.data : "NGN",
      seoDescription: seoDescription.data || null,
      purchaseUrl: category.data === "books" ? purchaseUrl.data || null : null,
      excerpt: category.data === "books" ? excerpt.data || null : null,
      updatedAt: new Date(),
    })
    .where(eq(galleryItems.id, id.data))
    .returning({ id: galleryItems.id });
  if (result.length === 0) return;
  revalidatePath("/admin/gallery");
  invalidateGallery(id.data);
}

export async function updateGalleryStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = statusSchema.parse(formData.get("status"));
  const rejectionReason = z.string().trim().max(500).parse(formData.get("rejectionReason") ?? "");
  const db = await getDbClient();
  const existing = await db
    .select({ id: galleryItems.id, category: galleryItems.category, priceAmount: galleryItems.priceAmount, currency: galleryItems.currency, purchaseUrl: galleryItems.purchaseUrl })
    .from(galleryItems)
    .where(and(eq(galleryItems.id, id)));
  if (existing.length === 0) return;
  if (status === "approved" && existing[0].category === "books" && (!existing[0].priceAmount || !/^[A-Z]{3}$/.test(existing[0].currency) || !existing[0].purchaseUrl)) {
    throw new Error("Books require a structured price, ISO currency, and purchase URL before approval.");
  }

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
  invalidateGallery(id);
}
