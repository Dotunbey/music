import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDbClient } from "@/lib/db/client";
import { getGalleryBucketName, getSupabaseAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
const timeout = <T,>(promise: Promise<T>, ms = 4000) => Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);
export async function GET(request: Request) {
  const secret = process.env.MAINTENANCE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ status: "unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  const started = Date.now();
  const database = await timeout(Promise.resolve().then(() => getDbClient()).then((db) => db.execute(sql`select 1`))).then(() => true, () => false);
  const storage = await timeout(Promise.resolve().then(() => getSupabaseAdminClient().storage.getBucket(getGalleryBucketName()))).then((result) => !result.error, () => false);
  const healthy = database && storage;
  return NextResponse.json({ status: healthy ? "healthy" : "degraded", checks: { database, storage }, latencyMs: Date.now() - started, timestamp: new Date().toISOString() }, { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
