import { asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getDbClient } from "@/lib/db/client";
import { portfolioItems } from "@/lib/db/schema";
import { parsePortfolioLink } from "@/lib/portfolio-links";
import { getGalleryPublicUrl } from "@/lib/supabase-admin";

async function queryApprovedPortfolioItems() {
  const db = await getDbClient();
  const rows = await db
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.status, "approved"))
    .orderBy(asc(portfolioItems.sortOrder), desc(portfolioItems.publishedAt), desc(portfolioItems.createdAt));

  return rows.map((item) => ({
    id: item.id,
    title: item.title,
    provider: item.provider,
    contentType: item.contentType,
    sourceUrl: item.sourceUrl,
    embedUrl: item.sourceUrl ? parsePortfolioLink(item.sourceUrl)?.embedUrl || null : null,
    mediaUrl: item.storagePath ? getGalleryPublicUrl(item.storagePath) : null,
    artworkUrl: item.artworkPath ? getGalleryPublicUrl(item.artworkPath) : item.artworkUrl,
    credits: item.credits,
  }));
}

export const getApprovedPortfolioItems = unstable_cache(queryApprovedPortfolioItems, ["approved-portfolio-v1"], { revalidate: 3600, tags: [CACHE_TAGS.portfolio] });

export async function getAdminPortfolioItems() {
  const db = await getDbClient();
  return db.select().from(portfolioItems).orderBy(asc(portfolioItems.provider), asc(portfolioItems.sortOrder), desc(portfolioItems.createdAt));
}

export type PublicPortfolioItem = Awaited<ReturnType<typeof getApprovedPortfolioItems>>[number];
