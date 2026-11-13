import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SafeImage } from "@/components/safe-image";
import { getApprovedGalleryItem, galleryCategoryConfig } from "@/lib/gallery";
import type { GalleryCategory } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ category: string; slug: string }> };
const categoryMap = new Map(galleryCategoryConfig.map((item) => [item.slug.replace("_", "-"), item.slug]));
async function resolveItem(params: Props["params"]) { const value = await params; const category = categoryMap.get(value.category) as GalleryCategory | undefined; return category ? getApprovedGalleryItem(category, value.slug) : null; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await resolveItem(params); if (!item) return {};
  const path = `/gallery/${item.category.replace("_", "-")}/${item.slug}`;
  const description = item.seoDescription || item.excerpt || `${item.title}, a ${item.category.replace("_", " ")} work by Tami Bedford.`;
  return { title: item.title, description, alternates: { canonical: path }, openGraph: { title: item.title, description, url: path, images: item.image ? [{ url: item.image }] : [{ url: "/opengraph-image" }] }, twitter: { card: "summary_large_image", title: item.title, description, images: item.image ? [item.image] : ["/opengraph-image"] } };
}

export default async function GalleryItemPage({ params }: Props) {
  const item = await resolveItem(params); if (!item) notFound();
  const categoryLabel = galleryCategoryConfig.find((entry) => entry.slug === item.category)?.title ?? "Gallery";
  const description = item.seoDescription || item.excerpt || `${item.title}, a ${categoryLabel.toLowerCase()} work by Tami Bedford.`;
  const url = absoluteUrl(`/gallery/${item.category.replace("_", "-")}/${item.slug}`);
  const schemaType = item.category === "books" ? "Book" : item.category === "short_films" ? "VideoObject" : item.category === "music" ? "MusicRecording" : "CreativeWork";
  const jsonLd: Record<string, unknown> = { "@context": "https://schema.org", "@type": schemaType, name: item.title, description, url, image: item.image };
  if (schemaType === "VideoObject") Object.assign(jsonLd, { thumbnailUrl: item.image, uploadDate: item.updatedAt, contentUrl: item.src, embedUrl: item.href });
  if (schemaType === "Book" && item.price && item.purchaseUrl) Object.assign(jsonLd, { offers: { "@type": "Offer", price: item.price.replace(/[^0-9.]/g, ""), priceCurrency: "NGN", url: item.purchaseUrl, availability: "https://schema.org/InStock" } });
  return <main className="min-h-screen bg-white px-5 py-16 text-cream md:px-8 md:py-24"><article className="mx-auto max-w-5xl"><Link href={`/gallery#${item.category.replace("_", "-")}`} className="text-xs font-bold uppercase tracking-widest text-red-700">Back to {categoryLabel}</Link><p className="mt-12 text-xs font-bold uppercase tracking-[0.25em] text-red-700">{categoryLabel}</p><h1 className="mt-3 font-display text-5xl font-black md:text-7xl">{item.title}</h1><p className="mt-5 max-w-2xl leading-8 text-cream/70">{description}</p><div className="mt-10 overflow-hidden rounded-lg bg-black">{item.type === "video" && item.src ? <video src={item.src} poster={item.image} controls preload="metadata" className="max-h-[75vh] w-full" /> : item.href && item.type === "video" ? <a href={item.href} target="_blank" rel="noreferrer" className="block">{item.image ? <span className="relative block aspect-video"><SafeImage src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-contain" /></span> : null}<span className="block p-5 text-center font-bold text-white">Watch film</span></a> : item.image ? <span className="relative block min-h-[70vh]"><SafeImage src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-contain" /></span> : null}</div>{item.price && item.purchaseUrl ? <a href={item.purchaseUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-md bg-red-700 px-6 py-3 font-bold uppercase text-white">Buy {item.price}</a> : null}</article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /></main>;
}
