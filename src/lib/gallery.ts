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
  };
}

type ApprovedGalleryItem = ReturnType<typeof toPublicItem>;

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function selectHomeGalleryItems(items: ApprovedGalleryItem[]) {
  const populated = galleryCategoryConfig
    .map(({ slug }) => items.filter((item) => item.category === slug))
    .filter((categoryItems) => categoryItems.length > 0);

  if (populated.length === 4) {
    return populated.map((categoryItems) => randomItem(categoryItems));
  }

  if (populated.length === 3) {
    return populated.map((categoryItems) => randomItem(categoryItems));
  }

  if (populated.length === 2) {
    const selected = populated.map((categoryItems) => randomItem(categoryItems));
    const candidates = populated.flatMap((categoryItems) =>
      categoryItems.filter((item) => !selected.some((chosen) => chosen.id === item.id)),
    );
    return [...selected, randomItem(candidates.length > 0 ? candidates : selected)];
  }

  if (populated.length === 1) {
    const categoryItems = populated[0];
    const selected = [...categoryItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    while (selected.length < 3) selected.push(randomItem(categoryItems));
    return selected;
  }

  return [];
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
