"use server";

import { revalidatePath } from "next/cache";
import { eq, max } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-session";
import { getDbClient } from "@/lib/db/client";
import { galleryItemStatusEnum, portfolioItems } from "@/lib/db/schema";
import { parsePortfolioLink, portfolioCreditOptions, type PortfolioCredit } from "@/lib/portfolio-links";
import { ensureGalleryBucket, getGalleryBucketName, getSupabaseAdminClient } from "@/lib/supabase-admin";

const titleSchema = z.string().trim().min(1).max(180);
const optionalUrlSchema = z.preprocess((value) => typeof value === "string" ? value.trim() : "", z.union([z.literal(""), z.string().url().max(1000)]));
const optionalPathSchema = z.preprocess((value) => typeof value === "string" ? value.trim() : "", z.string().max(500).refine((value) => !value.includes(".."), "Invalid storage path."));
const statusSchema = z.enum(galleryItemStatusEnum.enumValues);
const allowedCredits = new Set<string>(portfolioCreditOptions);
const audioTypes = new Set(["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/aac", "audio/ogg"]);
const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function safeFilename(filename: string) {
  const extension = filename.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] ?? "";
  const stem = filename.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  return `${stem || "upload"}${extension}`;
}

export type PortfolioMetadataState =
  | { status: "success"; title: string; artworkUrl: string; provider: string; contentType: string; sourceUrl: string }
  | { status: "error"; message: string };

function meta(html: string, property: string) {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const value = html.match(pattern)?.[1];
    if (value) return value.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  }
  return "";
}

export async function previewPortfolioUrl(value: string): Promise<PortfolioMetadataState> {
  await requireAdmin();
  const parsed = parsePortfolioLink(value);
  if (!parsed) return { status: "error", message: "Enter a valid HTTPS link." };
  if (parsed.provider === "external") return { status: "success", title: "", artworkUrl: "", ...parsed };
  try {
    if (parsed.provider === "spotify" || parsed.provider === "youtube") {
      const endpoint = parsed.provider === "spotify"
        ? `https://open.spotify.com/oembed?url=${encodeURIComponent(parsed.sourceUrl)}`
        : `https://www.youtube.com/oembed?url=${encodeURIComponent(parsed.sourceUrl)}&format=json`;
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) throw new Error(`${parsed.provider} returned ${response.status}.`);
      const data = await response.json() as { title?: string; thumbnail_url?: string };
      return { status: "success", title: data.title ?? "", artworkUrl: data.thumbnail_url ?? "", ...parsed };
    }
    const response = await fetch(parsed.sourceUrl, { cache: "no-store", headers: { "User-Agent": "TamiBedfordPortfolio/1.0" } });
    if (!response.ok) throw new Error(`Audiomack returned ${response.status}.`);
    const html = await response.text();
    return { status: "success", title: meta(html, "og:title").replace(/ by .*?: Listen on Audiomack$/i, ""), artworkUrl: meta(html, "og:image"), ...parsed };
  } catch (error) {
    console.error("Portfolio metadata lookup failed", error);
    return { status: "success", title: "", artworkUrl: "", ...parsed };
  }
}

export type SignedPortfolioUpload = { status: "success"; path: string; token: string; mediaKind: "audio" | "video" | "image" } | { status: "error"; message: string };

export async function createPortfolioUploadUrl(input: { filename: string; contentType: string; size: number; variant: "media" | "artwork" }): Promise<SignedPortfolioUpload> {
  await requireAdmin();
  const isAudio = audioTypes.has(input.contentType);
  const isVideo = videoTypes.has(input.contentType);
  const isImage = imageTypes.has(input.contentType);
  if (!Number.isSafeInteger(input.size) || input.size <= 0) return { status: "error", message: "The selected file has an invalid size." };
  if (input.variant === "artwork" && !isImage) return { status: "error", message: "Artwork must be JPEG, PNG, WebP, or GIF." };
  if (input.variant === "media" && !isAudio && !isVideo) return { status: "error", message: "Upload an MP3, WAV, AAC, OGG, MP4, WebM, or MOV file." };
  const maxBytes = input.variant === "artwork" ? 20 * 1024 * 1024 : 50 * 1024 * 1024;
  if (input.size > maxBytes) return { status: "error", message: `This file is larger than the ${input.variant === "artwork" ? "20 MB" : "50 MB"} limit.` };
  const mediaKind = isVideo ? "video" : isAudio ? "audio" : "image";
  const path = `portfolio/${input.variant}/${crypto.randomUUID()}-${safeFilename(input.filename)}`;
  await ensureGalleryBucket();
  const { data, error } = await getSupabaseAdminClient().storage.from(getGalleryBucketName()).createSignedUploadUrl(path);
  if (error || !data?.token) {
    console.error("Portfolio signed upload URL failed", error);
    return { status: "error", message: "Could not prepare the upload. Try again." };
  }
  return { status: "success", path, token: data.token, mediaKind };
}

function readCredits(formData: FormData): PortfolioCredit[] | null {
  const credits = formData.getAll("credits").filter((value): value is string => typeof value === "string");
  return credits.length > 0 && credits.every((credit) => allowedCredits.has(credit)) ? credits as PortfolioCredit[] : null;
}

export type PortfolioMutationState = { status: "success" | "error"; message: string };

export async function createPortfolioItem(formData: FormData): Promise<PortfolioMutationState> {
  await requireAdmin();
  const title = titleSchema.safeParse(formData.get("title"));
  const sourceUrl = optionalUrlSchema.safeParse(formData.get("sourceUrl"));
  const artworkUrl = optionalUrlSchema.safeParse(formData.get("artworkUrl"));
  const storagePath = optionalPathSchema.safeParse(formData.get("storagePath"));
  const artworkPath = optionalPathSchema.safeParse(formData.get("artworkPath"));
  const mediaKind = z.enum(["audio", "video"]).safeParse(formData.get("mediaKind"));
  const credits = readCredits(formData);
  const parsed = sourceUrl.success && sourceUrl.data ? parsePortfolioLink(sourceUrl.data) : null;
  if (!title.success || !sourceUrl.success || !artworkUrl.success || !storagePath.success || !artworkPath.success || !credits) return { status: "error", message: "Add a title and at least one credit." };
  if (!parsed && !storagePath.data) return { status: "error", message: "Add a streaming link or upload an audio/video file." };
  if (storagePath.data && !mediaKind.success) return { status: "error", message: "The uploaded media type is invalid." };

  const provider = storagePath.data ? "upload" as const : parsed!.provider;
  const contentType = storagePath.data ? mediaKind.data : parsed!.contentType;
  const db = await getDbClient();
  const [queue] = await db.select({ lastOrder: max(portfolioItems.sortOrder) }).from(portfolioItems).where(eq(portfolioItems.provider, provider));
  try {
    await db.insert(portfolioItems).values({ title: title.data, provider, contentType, sourceUrl: parsed?.sourceUrl ?? null, storagePath: storagePath.data || null, artworkUrl: artworkUrl.data || null, artworkPath: artworkPath.data || null, credits, sortOrder: Number(queue?.lastOrder ?? -1) + 1, status: "draft", metadataFetchedAt: parsed ? new Date() : null });
  } catch (error) {
    console.error("Portfolio item creation failed", error);
    return { status: "error", message: "This work may already be in the portfolio." };
  }
  revalidatePath("/admin/portfolio");
  return { status: "success", message: "Work saved as a draft." };
}

export async function updatePortfolioItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().safeParse(formData.get("id"));
  const title = titleSchema.safeParse(formData.get("title"));
  const artworkUrl = optionalUrlSchema.safeParse(formData.get("artworkUrl"));
  const credits = readCredits(formData);
  if (!id.success || !title.success || !artworkUrl.success || !credits) return;
  await (await getDbClient()).update(portfolioItems).set({ title: title.data, artworkUrl: artworkUrl.data || null, credits, updatedAt: new Date() }).where(eq(portfolioItems.id, id.data));
  revalidatePath("/admin/portfolio"); revalidatePath("/services");
}

export async function updatePortfolioStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = statusSchema.parse(formData.get("status"));
  const rejectionReason = z.string().trim().max(500).parse(formData.get("rejectionReason") ?? "");
  await (await getDbClient()).update(portfolioItems).set({ status, rejectionReason: status === "rejected" ? rejectionReason || null : null, reviewedAt: status === "draft" ? null : new Date(), publishedAt: status === "approved" ? new Date() : null, updatedAt: new Date() }).where(eq(portfolioItems.id, id));
  revalidatePath("/admin/portfolio"); revalidatePath("/services");
}
