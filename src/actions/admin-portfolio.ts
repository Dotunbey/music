"use server";

import { revalidatePath } from "next/cache";
import { eq, max } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-session";
import { getDbClient } from "@/lib/db/client";
import { galleryItemStatusEnum, portfolioItems } from "@/lib/db/schema";
import { parsePortfolioLink, portfolioCreditOptions, type PortfolioCredit } from "@/lib/portfolio-links";

const titleSchema = z.string().trim().min(1).max(180);
const urlSchema = z.string().trim().url().max(500);
const artworkSchema = z.preprocess((value) => typeof value === "string" ? value.trim() : "", z.union([z.literal(""), z.string().url().max(1000)]));
const statusSchema = z.enum(galleryItemStatusEnum.enumValues);
const allowedCredits = new Set<string>(portfolioCreditOptions);

export type PortfolioMetadataState =
  | { status: "success"; title: string; artworkUrl: string; provider: string; contentType: string; sourceUrl: string }
  | { status: "error"; message: string };

function meta(html: string, property: string) {
  const escaped = property.replace(":", "\\:");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const value = html.match(pattern)?.[1];
    if (value) return value.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  }
  return "";
}

export async function previewPortfolioUrl(value: string): Promise<PortfolioMetadataState> {
  await requireAdmin();
  const input = urlSchema.safeParse(value);
  const parsed = input.success ? parsePortfolioLink(input.data) : null;
  if (!parsed) return { status: "error", message: "Use a valid Spotify, YouTube, or Audiomack link." };

  try {
    if (parsed.provider === "spotify") {
      const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(parsed.sourceUrl)}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Spotify metadata returned ${response.status}.`);
      const data = await response.json() as { title?: string; thumbnail_url?: string };
      return { status: "success", title: data.title ?? "", artworkUrl: data.thumbnail_url ?? "", ...parsed };
    }
    if (parsed.provider === "youtube") {
      const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(parsed.sourceUrl)}&format=json`, { cache: "no-store" });
      if (!response.ok) throw new Error(`YouTube metadata returned ${response.status}.`);
      const data = await response.json() as { title?: string; thumbnail_url?: string };
      return { status: "success", title: data.title ?? "", artworkUrl: data.thumbnail_url ?? "", ...parsed };
    }

    const response = await fetch(parsed.sourceUrl, { cache: "no-store", headers: { "User-Agent": "TamiBedfordPortfolio/1.0" } });
    if (!response.ok) throw new Error(`Audiomack metadata returned ${response.status}.`);
    const html = await response.text();
    return {
      status: "success",
      title: meta(html, "og:title").replace(/ by .*?: Listen on Audiomack$/i, ""),
      artworkUrl: meta(html, "og:image"),
      ...parsed,
    };
  } catch (error) {
    console.error("Portfolio metadata lookup failed", error);
    return { status: "error", message: "The provider could not return metadata. Try the link again." };
  }
}

function readCredits(formData: FormData): PortfolioCredit[] | null {
  const credits = formData.getAll("credits").filter((value): value is string => typeof value === "string");
  return credits.length > 0 && credits.every((credit) => allowedCredits.has(credit)) ? credits as PortfolioCredit[] : null;
}

export type PortfolioMutationState = { status: "success" | "error"; message: string };

export async function createPortfolioItem(formData: FormData): Promise<PortfolioMutationState> {
  await requireAdmin();
  const title = titleSchema.safeParse(formData.get("title"));
  const source = urlSchema.safeParse(formData.get("sourceUrl"));
  const artwork = artworkSchema.safeParse(formData.get("artworkUrl"));
  const parsed = source.success ? parsePortfolioLink(source.data) : null;
  const credits = readCredits(formData);
  if (!title.success || !artwork.success || !parsed || !credits) return { status: "error", message: "Add a valid link, title, and at least one credit." };

  const db = await getDbClient();
  const [queue] = await db.select({ lastOrder: max(portfolioItems.sortOrder) }).from(portfolioItems).where(eq(portfolioItems.provider, parsed.provider));
  try {
    await db.insert(portfolioItems).values({
      title: title.data,
      provider: parsed.provider,
      contentType: parsed.contentType,
      sourceUrl: parsed.sourceUrl,
      artworkUrl: artwork.data || null,
      credits,
      sortOrder: Number(queue?.lastOrder ?? -1) + 1,
      status: "draft",
      metadataFetchedAt: new Date(),
    });
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
  const source = urlSchema.safeParse(formData.get("sourceUrl"));
  const artwork = artworkSchema.safeParse(formData.get("artworkUrl"));
  const order = z.coerce.number().int().min(0).max(100000).safeParse(formData.get("sortOrder"));
  const parsed = source.success ? parsePortfolioLink(source.data) : null;
  const credits = readCredits(formData);
  if (!id.success || !title.success || !artwork.success || !order.success || !parsed || !credits) return;
  await (await getDbClient()).update(portfolioItems).set({ title: title.data, provider: parsed.provider, contentType: parsed.contentType, sourceUrl: parsed.sourceUrl, artworkUrl: artwork.data || null, credits, sortOrder: order.data, updatedAt: new Date() }).where(eq(portfolioItems.id, id.data));
  revalidatePath("/admin/portfolio");
  revalidatePath("/services");
}

export async function updatePortfolioStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const status = statusSchema.parse(formData.get("status"));
  const rejectionReason = z.string().trim().max(500).parse(formData.get("rejectionReason") ?? "");
  await (await getDbClient()).update(portfolioItems).set({
    status,
    rejectionReason: status === "rejected" ? rejectionReason || null : null,
    reviewedAt: status === "draft" ? null : new Date(),
    publishedAt: status === "approved" ? new Date() : null,
    updatedAt: new Date(),
  }).where(eq(portfolioItems.id, id));
  revalidatePath("/admin/portfolio");
  revalidatePath("/services");
}
