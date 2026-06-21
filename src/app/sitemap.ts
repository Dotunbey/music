import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tamibedford.com";
  const routes = [
    "",
    "/sessions",
    "/services",
    "/work",
    "/about",
    "/apply",
    "/sessions/piano",
    "/sessions/organ",
    "/sessions/production",
  ];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
