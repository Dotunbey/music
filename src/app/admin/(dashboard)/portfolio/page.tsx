import type { Metadata } from "next";
import { AdminPortfolioManager } from "@/components/admin-portfolio-manager";
import { getAdminPortfolioItems } from "@/lib/portfolio";
import { getGalleryBucketName } from "@/lib/supabase-admin";

export const metadata: Metadata = { title: "Portfolio" };

export default async function AdminPortfolioPage() {
  const rows = await getAdminPortfolioItems();
  const items = rows.map((item) => ({ ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString(), publishedAt: item.publishedAt?.toISOString() ?? null, reviewedAt: item.reviewedAt?.toISOString() ?? null, metadataFetchedAt: item.metadataFetchedAt?.toISOString() ?? null }));
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return <><div className="mb-8"><h1 className="font-display text-4xl font-black">Portfolio</h1><p className="mt-2 leading-7 text-cream/70">Links, uploads, credits, and publishing.</p></div><AdminPortfolioManager items={items} supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} bucketName={getGalleryBucketName()} /></>;
}
