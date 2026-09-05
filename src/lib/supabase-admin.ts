import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be configured.`);
  return value;
}

function getSupabaseUrl(): string {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? requiredEnv("SUPABASE_URL");
}

export function getSupabaseAdminClient(): SupabaseClient {
  if (adminClient) return adminClient;

  adminClient = createClient(
    getSupabaseUrl(),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  return adminClient;
}

export function getGalleryBucketName(): string {
  return process.env.SUPABASE_GALLERY_BUCKET || "gallery-media";
}

export async function ensureGalleryBucket(): Promise<void> {
  const storage = getSupabaseAdminClient().storage;
  const bucket = getGalleryBucketName();
  const existing = await storage.getBucket(bucket);
  if (existing.data) return;

  const created = await storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: "524288000",
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ],
  });
  if (created.error && !created.error.message.toLowerCase().includes("already exists")) {
    throw created.error;
  }
}

export function getGalleryPublicUrl(storagePath: string): string {
  const baseUrl = getSupabaseUrl().replace(/\/$/, "");
  return `${baseUrl}/storage/v1/object/public/${getGalleryBucketName()}/${storagePath}`;
}
