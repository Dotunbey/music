import { asc, desc, eq } from "drizzle-orm";
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

export const galleryCategoryConfig = [
  { slug: "music", title: "Music", icon: Music2 },
  { slug: "books", title: "Books", icon: BookOpen },
  { slug: "poetry", title: "Poetry", icon: Feather },
  { slug: "short_films", title: "Short Films", icon: Clapperboard },
] as const satisfies ReadonlyArray<{ slug: GalleryCategory; title: string; icon: LucideIcon }>;

function toPublicItem(item: GalleryItem): PublicGalleryItem & {
  id: string;
  category: GalleryCategory;
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
    title: item.title,
    type: item.mediaType,
    image,
    src:
      item.mediaType === "video" && item.storagePath
        ? getGalleryPublicUrl(item.storagePath)
        : undefined,
    href: item.sourceUrl ?? undefined,
    excerpt: item.excerpt ?? undefined,
    price: item.price ?? undefined,
    purchaseUrl: item.purchaseUrl ?? undefined,
    sampleImages: item.samplePaths.map(getGalleryPublicUrl),
  };
}

type ApprovedGalleryItem = ReturnType<typeof toPublicItem>;

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
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

  const selected = shuffled(populated)
    .slice(0, limit)
    .map((categoryItems) => randomItem(categoryItems));
  const unused = shuffled(
    populated.flatMap((categoryItems) =>
      categoryItems.filter((item) => !selected.some((chosen) => chosen.id === item.id)),
    ),
  );

  while (selected.length < limit && unused.length > 0) {
    selected.push(unused.shift()!);
  }
  while (selected.length < limit) {
    selected.push(randomItem(selected));
  }

  return selected;
}

export async function getApprovedGalleryItems() {
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
