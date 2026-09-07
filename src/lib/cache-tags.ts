import { revalidatePath, revalidateTag } from "next/cache";

export const CACHE_TAGS = { gallery: "gallery", homepageGallery: "homepage-gallery", portfolio: "portfolio", sitemap: "sitemap" } as const;

export function invalidateGallery(id?: string) {
  revalidateTag(CACHE_TAGS.gallery, "max");
  revalidateTag(CACHE_TAGS.homepageGallery, "max");
  revalidateTag(CACHE_TAGS.sitemap, "max");
  if (id) revalidateTag(`gallery-item-${id}`, "max");
  revalidatePath("/"); revalidatePath("/gallery"); revalidatePath("/sitemap.xml");
}

export function invalidatePortfolio() {
  revalidateTag(CACHE_TAGS.portfolio, "max");
  revalidatePath("/services");
}
