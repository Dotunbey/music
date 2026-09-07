import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be configured.`);
  return value;
}

function getSupabaseUrl(): string {
  const configured = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (configured) return configured;
  const databaseUrl = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL;
  if (databaseUrl) {
    const parsed = new URL(databaseUrl);
    const directMatch = parsed.hostname.match(/^db\.([a-z0-9]+)\.supabase\.co$/i);
    const pooledMatch = decodeURIComponent(parsed.username).match(/^postgres\.([a-z0-9]+)$/i);
    const projectRef = directMatch?.[1] ?? pooledMatch?.[1];
    if (projectRef) return `https://${projectRef}.supabase.co`;
  }
  return requiredEnv("SUPABASE_URL");
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
  const options = {
    public: true,
    fileSizeLimit: "52428800",
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ],
  };
  const existing = await storage.getBucket(bucket);
  if (existing.data) {
    const updated = await storage.updateBucket(bucket, options);
    if (updated.error) throw updated.error;
    return;
  }

  const created = await storage.createBucket(bucket, options);
  if (created.error && !created.error.message.toLowerCase().includes("already exists")) {
    throw created.error;
  }
}

export function getGalleryPublicUrl(storagePath: string): string {
  const baseUrl = getSupabaseUrl().replace(/\/$/, "");
  return `${baseUrl}/storage/v1/object/public/${getGalleryBucketName()}/${storagePath}`;
}
