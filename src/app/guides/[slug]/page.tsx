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
  const slugs = await sanityFetch<{ slug: { current: string } }[]>({
    query: ALL_GUIDE_SLUGS_QUERY,
    fallback: [],
  });
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
      <div style={{ margin: "2rem 0", borderRadius: 12, overflow: "hidden" }}>
        <Image
          src={urlFor(value).width(800).url()}
          alt=""
          width={800}
          height={450}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    ),
  },
};

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await sanityFetch<Guide | null>({ query: GUIDE_BY_SLUG_QUERY, params: { slug }, tags: ["guide"], fallback: null });
  if (!guide) notFound();

  const coverUrl = guide.cover ? urlFor(guide.cover).width(1200).height(600).url() : null;

  return (
    <div style={{ paddingTop: "4.5rem" }}>
      {/* Breadcrumb */}
      <div className="container" style={{ maxWidth: 760, margin: "0 auto", padding: "1.25rem 1.5rem" }}>
        <nav style={{ fontSize: "0.813rem", color: "rgba(20,16,8,0.45)", display: "flex", gap: "0.5rem" }}>
          <Link href="/" className="hover:opacity-70">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:opacity-70">Guides</Link>
          <span>/</span>
          <span style={{ color: "var(--color-ink)" }}>{guide.title}</span>
        </nav>
      </div>

      {/* Article */}
      <article>
        <div className="container" style={{ maxWidth: 760, margin: "0 auto", padding: "0 1.5rem 5rem" }}>
          <div style={{ marginBottom: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span className="kicker" style={{ marginBottom: 0 }}>Guide · {catMap[guide.category] ?? "General"}</span>
            {guide.readTime && <span style={{ fontSize: "0.75rem", color: "rgba(20,16,8,0.45)" }}>{guide.readTime} min read</span>}
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, marginBottom: "1.25rem" }}>
            {guide.title}
          </h1>

          <p style={{ fontSize: "1.125rem", color: "rgba(20,16,8,0.65)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            {guide.excerpt}
          </p>

          {coverUrl && (
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", marginBottom: "2.5rem", aspectRatio: "2/1" }}>
              <Image src={coverUrl} alt={guide.title} fill className="object-cover" priority sizes="(max-width:760px) 100vw, 760px" />
            </div>
          )}

          {guide.body && (
            <div
              style={{
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "rgba(20,16,8,0.82)",
              }}
              className="prose-guide"
            >
              <style>{`
                .prose-guide h2 { font-family: var(--font-display); font-size: 1.625rem; font-weight: 400; margin: 2.5rem 0 1rem; color: var(--color-ink); }
                .prose-guide h3 { font-family: var(--font-display); font-size: 1.25rem; font-weight: 400; margin: 2rem 0 0.75rem; color: var(--color-ink); }
                .prose-guide p { margin-bottom: 1.25rem; }
                .prose-guide ul, .prose-guide ol { margin: 1rem 0 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
                .prose-guide li { line-height: 1.7; }
                .prose-guide strong { font-weight: 700; color: var(--color-ink); }
                .prose-guide a { color: var(--color-bronze); text-decoration: underline; }
              `}</style>
              <PortableText value={guide.body as Parameters<typeof PortableText>[0]["value"]} components={portableComponents} />
            </div>
          )}

          {/* Back */}
          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--color-line)" }}>
            <Link href="/guides" className="btn btn-ghost-dark" style={{ fontSize: "0.875rem" }}>← All Guides</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
