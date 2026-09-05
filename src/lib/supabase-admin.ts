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

export function getGalleryPublicUrl(storagePath: string): string {
  const baseUrl = getSupabaseUrl().replace(/\/$/, "");
  return `${baseUrl}/storage/v1/object/public/${getGalleryBucketName()}/${storagePath}`;
}
