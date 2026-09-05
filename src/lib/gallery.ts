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
  const image = item.posterPath
    ? getGalleryPublicUrl(item.posterPath)
    : item.storagePath && item.mediaType === "image"
      ? getGalleryPublicUrl(item.storagePath)
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
    meta: item.caption ?? undefined,
  };
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
