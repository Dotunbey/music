import { asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { BookOpen, Clapperboard, Feather, Music2, type LucideIcon } from "lucide-react";
import type { GalleryItem as PublicGalleryItem } from "@/lib/content";
import { getDbClient } from "@/lib/db/client";
import {
  galleryItems,
  galleryItemStatusEnum,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/db/schema";
import { getGalleryPublicUrl } from "@/lib/supabase-admin";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const galleryCategoryConfig = [
  { slug: "music", title: "Music", icon: Music2 },
  { slug: "books", title: "Books", icon: BookOpen },
  { slug: "poetry", title: "Poetry", icon: Feather },
  { slug: "short_films", title: "Short Films", icon: Clapperboard },
] as const satisfies ReadonlyArray<{ slug: GalleryCategory; title: string; icon: LucideIcon }>;

function toPublicItem(item: GalleryItem): PublicGalleryItem & {
  id: string;
    category: GalleryCategory;
    slug: string;
    seoDescription?: string;
    updatedAt: string;
} {
  const youtubeId = item.sourceUrl?.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i,
  )?.[1];
  const image = item.posterPath
    ? getGalleryPublicUrl(item.posterPath)
    : item.storagePath && item.mediaType === "image"
      ? getGalleryPublicUrl(item.storagePath)
      : youtubeId
        ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
        : undefined;

  return {
    id: item.id,
    category: item.category,
    slug: item.slug,
    seoDescription: item.seoDescription ?? undefined,
    updatedAt: item.updatedAt.toISOString(),
    title: item.title,
    type: item.mediaType,
    image,
    src:
      item.mediaType === "video" && item.storagePath
        ? getGalleryPublicUrl(item.storagePath)
        : undefined,
    href: item.sourceUrl ?? undefined,
    excerpt: item.excerpt ?? undefined,
    price: item.priceAmount ? new Intl.NumberFormat("en-NG", { style: "currency", currency: item.currency, maximumFractionDigits: 0 }).format(item.priceAmount) : item.price ?? undefined,
    purchaseUrl: item.purchaseUrl ?? undefined,
    sampleImages: item.samplePaths.map(getGalleryPublicUrl),
  };
}

type ApprovedGalleryItem = ReturnType<typeof toPublicItem>;

function hashSeed(value: string) { let hash = 2166136261; for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619); return hash >>> 0; }
function seededRandom(seed: number) { return () => ((seed = Math.imul(1664525, seed) + 1013904223) >>> 0) / 4294967296; }
function shuffled<T>(items: T[], seed: string) {
  const random = seededRandom(hashSeed(seed));
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function selectHomeGalleryItems(items: ApprovedGalleryItem[], limit = 8) {
  if (limit <= 0) return [];

  const populated = galleryCategoryConfig
    .map(({ slug }) => items.filter((item) => item.category === slug))
    .filter((categoryItems) => categoryItems.length > 0);

  if (populated.length === 0) return [];

  const day = new Date().toISOString().slice(0, 10);
  const selected = shuffled(populated, `${day}:categories`)
    .slice(0, limit)
    .map((categoryItems, index) => shuffled(categoryItems, `${day}:pick:${index}`)[0]);
  const unused = shuffled(
    populated.flatMap((categoryItems) =>
      categoryItems.filter((item) => !selected.some((chosen) => chosen.id === item.id)),
    ),
    `${day}:unused`,
  );

  while (selected.length < limit && unused.length > 0) {
    selected.push(unused.shift()!);
  }
  while (selected.length < limit) {
    selected.push(selected[selected.length % selected.length]);
  }

  return selected;
}

async function queryApprovedGalleryItems() {
  const db = await getDbClient();
  const rows = await db
    .select()
    .from(galleryItems)
    .where(eq(galleryItems.status, "approved"))
    .orderBy(
      asc(galleryItems.sortOrder),
      desc(galleryItems.publishedAt),
      desc(galleryItems.createdAt),
    );
  return rows.map(toPublicItem);
}

export const getApprovedGalleryItems = unstable_cache(queryApprovedGalleryItems, ["approved-gallery-v2"], { revalidate: 3600, tags: [CACHE_TAGS.gallery, CACHE_TAGS.homepageGallery, CACHE_TAGS.sitemap] });

export async function getApprovedGalleryItem(category: GalleryCategory, slug: string) {
  return (await getApprovedGalleryItems()).find((item) => item.category === category && item.slug === slug) ?? null;
}

export async function getAdminGalleryItems() {
  const db = await getDbClient();
  return db
    .select()
    .from(galleryItems)
    .orderBy(
      asc(galleryItems.status),
      asc(galleryItems.sortOrder),
      desc(galleryItems.createdAt),
    );
}

export const galleryStatuses = galleryItemStatusEnum.enumValues;
