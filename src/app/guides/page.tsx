import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ALL_GUIDES_QUERY } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

export const metadata: Metadata = {
  title: "Care Guides",
  description: "Expert guides for caring for cats, birds, and reptiles. Written by the Clawfrican team.",
};

export const revalidate = 3600;

type Guide = { _id: string; title: string; slug: { current: string }; category: string; excerpt: string; cover?: SanityImageSource; readTime?: number; publishedAt?: string };
const catMap: Record<string, string> = { cat: "Cats", bird: "Birds", reptile: "Reptiles", general: "General" };

export default async function GuidesPage() {
  const guides = await sanityFetch<Guide[]>({ query: ALL_GUIDES_QUERY, tags: ["guide"], fallback: [] });

  return (
    <div style={{ paddingTop: "5rem" }}>
      <div style={{ background: "var(--color-emerald)", padding: "4rem 1.5rem 3rem", textAlign: "center" }}>
        <span className="kicker kicker--light">PET CARE RESOURCES</span>
        <h1 style={{ color: "var(--color-cream)", fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>Care Guides.</h1>
        <p style={{ color: "rgba(245,245,220,0.6)", marginTop: "1rem", maxWidth: 480, margin: "1rem auto 0", fontSize: "1.0625rem" }}>
          Expert guidance from the Clawfrican team — so your companion thrives from day one.
        </p>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 1160, margin: "0 auto" }}>
          {guides.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "rgba(20,16,8,0.45)" }}>
              <p>Guides coming soon — check back shortly!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.75rem" }}>
              {guides.map((g) => (
                <Link key={g._id} href={`/guides/${g.slug.current}`} className="guide-card">
                  <div className="guide-card__img">
                    {g.cover ? (
                      <Image src={urlFor(g.cover).width(600).height(338).url()} alt={g.title} fill sizes="33vw" className="object-cover" />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, var(--color-emerald), var(--color-gold-deep))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem" }}>
                        {g.category === "cat" ? "🐱" : g.category === "bird" ? "🦜" : g.category === "reptile" ? "🦎" : "🐾"}
                      </div>
                    )}
                  </div>
                  <div className="guide-card__body">
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span className="kicker" style={{ marginBottom: 0 }}>Guide · {catMap[g.category] ?? "General"}</span>
                      {g.readTime && <span style={{ fontSize: "0.688rem", color: "rgba(20,16,8,0.4)" }}>{g.readTime} min</span>}
                    </div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 400, lineHeight: 1.2 }}>{g.title}</h2>
                    <p style={{ color: "rgba(20,16,8,0.6)", fontSize: "0.875rem", lineHeight: 1.6 }}>{g.excerpt}</p>
                    <span style={{ color: "var(--color-bronze)", fontSize: "0.875rem", fontWeight: 600, marginTop: "auto" }}>Read guide →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
