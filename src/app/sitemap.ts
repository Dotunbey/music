import type { MetadataRoute } from "next";
import { getApprovedGalleryItems } from "@/lib/gallery";
import { absoluteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/sessions",
    "/sessions/tutors",
    "/services",
    "/gallery",
    "/about",
    "/apply",
    "/sessions/piano",
    "/sessions/choral",
    "/sessions/organ",
    "/sessions/production",
    "/privacy",
  ];
  const items = await getApprovedGalleryItems();
  return [...routes.map((route) => ({
    url: absoluteUrl(route || "/"),
    lastModified: new Date("2026-09-07T00:00:00.000Z"),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  })), ...items.map((item) => ({ url: absoluteUrl(`/gallery/${item.category.replace("_", "-")}/${item.slug}`), lastModified: item.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 }))];
}
