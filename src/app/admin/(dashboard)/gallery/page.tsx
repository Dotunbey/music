import type { Metadata } from "next";
import { getAdminGalleryItems } from "@/lib/gallery";
import { getGalleryPublicUrl } from "@/lib/supabase-admin";
import { AdminGalleryManager } from "@/components/admin-gallery-manager";

export const metadata: Metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const rows = await getAdminGalleryItems();
  const items = rows.map((item) => ({
    id: item.id,
    category: item.category,
    mediaType: item.mediaType,
    title: item.title,
    storagePath: item.storagePath,
    posterPath: item.posterPath,
    price: item.price,
    purchaseUrl: item.purchaseUrl,
    excerpt: item.excerpt,
    sampleUrls: item.samplePaths.map(getGalleryPublicUrl),
    status: item.status,
    sortOrder: item.sortOrder,
    rejectionReason: item.rejectionReason,
    previewUrl: item.posterPath ? getGalleryPublicUrl(item.posterPath) : item.storagePath ? getGalleryPublicUrl(item.storagePath) : item.sourceUrl,
    mediaUrl: item.storagePath ? getGalleryPublicUrl(item.storagePath) : item.sourceUrl,
    posterUrl: item.posterPath ? getGalleryPublicUrl(item.posterPath) : null,
    createdAt: item.createdAt.toISOString(),
  }));
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-black">Gallery</h1>
        <p className="mt-2 leading-7 text-cream/70">Upload, preview, and approve the public archive.</p>
      </div>
      <AdminGalleryManager items={items} supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} />
    </>
  );
}
