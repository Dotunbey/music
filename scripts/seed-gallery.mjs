import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_GALLERY_BUCKET || "gallery-media";
if (!url || !key || !process.env.DATABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and DATABASE_URL are required.");
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const root = process.cwd();
const poetryDir = path.join(root, "public", "poetry");
const imageMime = new Map([[".jpg", "image/jpeg"], [".jpeg", "image/jpeg"], [".png", "image/png"], [".webp", "image/webp"], [".gif", "image/gif"]]);
const videoMime = new Map([[".mp4", "video/mp4"], [".webm", "video/webm"], [".mov", "video/quicktime"]]);

async function ensureBucket() {
  const { error } = await supabase.storage.createBucket(bucket, { public: true, fileSizeLimit: "524288000", allowedMimeTypes: [...imageMime.values(), ...videoMime.values()] });
  if (error && !/already exists/i.test(error.message)) throw error;
}

async function uploadFile(localPath, storagePath, contentType) {
  const body = await fs.readFile(localPath);
  const { error } = await supabase.storage.from(bucket).upload(storagePath, body, { contentType, upsert: true });
  if (error) throw error;
  return storagePath;
}

async function insert(item) {
  const { error } = await supabase.from("gallery_items").insert(item);
  if (error) throw error;
}

await ensureBucket();
const entries = await fs.readdir(poetryDir, { withFileTypes: true });
const poetryFiles = entries.filter((entry) => entry.isFile() && (imageMime.has(path.extname(entry.name).toLowerCase()) || videoMime.has(path.extname(entry.name).toLowerCase()))).sort((a, b) => a.name.localeCompare(b.name));
for (let i = 0; i < poetryFiles.length; i++) {
  const file = poetryFiles[i];
  const extension = path.extname(file.name).toLowerCase();
  const mediaType = videoMime.has(extension) ? "video" : "image";
  const storagePath = await uploadFile(path.join(poetryDir, file.name), `poetry/media/${file.name}`, videoMime.get(extension) || imageMime.get(extension));
  await insert({ category: "poetry", media_type: mediaType, title: String(i + 1).padStart(2, "0"), caption: "", storage_path: storagePath, status: "approved", sort_order: i, published_at: new Date().toISOString() });
}

const localItems = [
  ["music", "Studio session", "production-session.jpg", "image", 0],
  ["music", "Produced record", "studio-production.png", "image", 1],
  ["music", "Live take", "piano-keys.jpg", "image", 2],
  ["books", "The book", "work-creative.png", "image", 0],
];
for (const [category, title, filename, mediaType, sortOrder] of localItems) {
  const extension = path.extname(filename).toLowerCase();
  const storagePath = await uploadFile(path.join(root, "public", "images", filename), `${category}/media/${filename}`, imageMime.get(extension) || "image/png");
  await insert({ category, media_type: mediaType, title, caption: "", storage_path: storagePath, status: "approved", sort_order: sortOrder, published_at: new Date().toISOString() });
}

console.log("Gallery seed complete. Existing external YouTube films should be re-uploaded through /admin/gallery.");
