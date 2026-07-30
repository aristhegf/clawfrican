import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { GUIDE_BY_SLUG_QUERY, ALL_GUIDE_SLUGS_QUERY } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

export const revalidate = 3600;

type Guide = {
  _id: string; title: string; slug: { current: string }; category: string;
  excerpt: string; cover?: SanityImageSource; readTime?: number;
  body?: unknown[]; publishedAt?: string;
};

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: { current: string } }[]>({ query: ALL_GUIDE_SLUGS_QUERY, fallback: [] });
  return slugs.map((s) => ({ slug: s.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await sanityFetch<Guide | null>({ query: GUIDE_BY_SLUG_QUERY, params: { slug }, tags: ["guide"], fallback: null });
  if (!guide) return { title: "Guide not found" };

  return {
    title: guide.title,
    description: guide.excerpt,
    openGraph: {
      title: `${guide.title} | Clawfrican`,
      description: guide.excerpt,
      images: guide.cover ? [{ url: urlFor(guide.cover).width(1200).height(630).url() }] : [],
    },
  };
}

const catMap: Record<string, string> = { cat: "Cats", bird: "Birds", reptile: "Reptiles", general: "General" };

const portableComponents = {
  types: {
    image: ({ value }: { value: SanityImageSource }) => (
      <Image src={urlFor(value).width(800).url()} alt="" width={800} height={450} style={{ width: "100%", height: "auto" }} />
    ),
  },
};

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await sanityFetch<Guide | null>({ query: GUIDE_BY_SLUG_QUERY, params: { slug }, tags: ["guide"], fallback: null });
  if (!guide) notFound();

  const coverUrl = guide.cover ? urlFor(guide.cover).width(1200).height(675).url() : null;

  return (
    <>
      <div className="wrap" style={{ paddingTop: 120 }}>
        <nav className="crumb">
          <Link href="/guides">← Care Resources</Link>
          <span>/</span>
          <span style={{ color: "var(--color-ink)" }}>{catMap[guide.category] ?? "General"}</span>
        </nav>
      </div>

      <div className="wrap">
        <article className="gd-wrap">
          {coverUrl && (
            <div className="gd-cover">
              <Image src={coverUrl} alt={guide.title} fill className="object-cover" priority sizes="(max-width:760px) 100vw, 760px" />
            </div>
          )}
          <div className="gd-meta">
            <span className="gd-tag">{catMap[guide.category] ?? "General"}</span>
            {guide.readTime && <span style={{ fontSize: "0.8rem", color: "rgba(20,16,8,0.5)" }}>{guide.readTime} min read</span>}
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4.4vw, 3rem)", fontWeight: 400, lineHeight: 1.15, marginBottom: 16 }}>
            {guide.title}
          </h1>
          <p style={{ fontSize: "1.12rem", color: "rgba(20,16,8,0.62)", lineHeight: 1.7, marginBottom: 36 }}>
            {guide.excerpt}
          </p>

          {guide.body && (
            <div className="gd-body">
              <PortableText value={guide.body as Parameters<typeof PortableText>[0]["value"]} components={portableComponents} />
            </div>
          )}

          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--color-line)" }}>
            <Link href="/guides" className="btn btn-ghost">← All Guides</Link>
          </div>
        </article>
      </div>
    </>
  );
}
