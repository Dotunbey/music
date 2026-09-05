import { asc, desc, eq } from "drizzle-orm";
import { getDbClient } from "@/lib/db/client";
import { portfolioItems } from "@/lib/db/schema";
import { parsePortfolioLink } from "@/lib/portfolio-links";

export async function getApprovedPortfolioItems() {
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
    embedUrl: parsePortfolioLink(item.sourceUrl)?.embedUrl ?? null,
    artworkUrl: item.artworkUrl,
    credits: item.credits,
  }));
}

export async function getAdminPortfolioItems() {
  const db = await getDbClient();
  return db.select().from(portfolioItems).orderBy(asc(portfolioItems.provider), asc(portfolioItems.sortOrder), desc(portfolioItems.createdAt));
}

export type PublicPortfolioItem = Awaited<ReturnType<typeof getApprovedPortfolioItems>>[number];
