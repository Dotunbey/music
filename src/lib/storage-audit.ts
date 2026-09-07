import { getDbClient } from "@/lib/db/client";
import { galleryItems, portfolioItems } from "@/lib/db/schema";
import { getGalleryBucketName, getSupabaseAdminClient } from "@/lib/supabase-admin";

export type OrphanObject = { path: string; size: number; createdAt: string };
async function listObjects(prefix = ""): Promise<OrphanObject[]> {
  const bucket = getSupabaseAdminClient().storage.from(getGalleryBucketName());
  const result: OrphanObject[] = [];
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await bucket.list(prefix, { limit: 100, offset, sortBy: { column: "name", order: "asc" } });
    if (error) throw error;
    for (const entry of data ?? []) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id) result.push({ path, size: Number(entry.metadata?.size ?? 0), createdAt: entry.created_at ?? entry.updated_at ?? new Date(0).toISOString() });
      else result.push(...await listObjects(path));
    }
    if (!data || data.length < 100) break;
  }
  return result;
}

export async function auditOrphanedStorage(): Promise<OrphanObject[]> {
  const db = await getDbClient();
  const [gallery, portfolio] = await Promise.all([db.select().from(galleryItems), db.select().from(portfolioItems)]);
  const referenced = new Set<string>();
  for (const item of gallery) [item.storagePath, item.posterPath, ...item.samplePaths].forEach((path) => path && referenced.add(path));
  for (const item of portfolio) [item.storagePath, item.artworkPath].forEach((path) => path && referenced.add(path));
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return (await listObjects()).filter((object) => !referenced.has(object.path) && new Date(object.createdAt).getTime() < cutoff);
}
