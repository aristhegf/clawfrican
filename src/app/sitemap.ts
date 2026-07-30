import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ALL_PETS_FOR_PARAMS_QUERY, ALL_GUIDE_SLUGS_QUERY } from "@/lib/queries";
import { nameToSlug } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://clawfrican.com";

  const [pets, guides] = await Promise.all([
    sanityFetch<{ name: string }[]>({ query: ALL_PETS_FOR_PARAMS_QUERY, fallback: [] }),
    sanityFetch<{ slug: { current: string } }[]>({ query: ALL_GUIDE_SLUGS_QUERY, fallback: [] }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/pets`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/reviews`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const petPages: MetadataRoute.Sitemap = pets.map((p) => ({
    url: `${base}/pets/${nameToSlug(p.name)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${base}/guides/${g.slug.current}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...petPages, ...guidePages];
}
