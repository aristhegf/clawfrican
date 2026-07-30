import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ALL_GUIDES_QUERY } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

export const metadata: Metadata = {
  title: "Care Resources",
  description: "Practical guides for caring for cats, birds, and reptiles. Written by the Clawfrican team.",
};

export const revalidate = 3600;

type Guide = { _id: string; title: string; slug: { current: string }; category: string; excerpt: string; cover?: SanityImageSource; readTime?: number };
const catMap: Record<string, string> = { cat: "Cats", bird: "Birds", reptile: "Reptiles", general: "General" };

export default async function GuidesPage() {
  const guides = await sanityFetch<Guide[]>({ query: ALL_GUIDES_QUERY, tags: ["guide"], fallback: [] });

  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <div className="kicker">Care Resources</div>
          <h1>Own it <em>confidently.</em></h1>
          <p>Practical guides written by our team — settling in, feeding, grooming, behaviour and everything in between.</p>
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: 120 }}>
        {guides.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "rgba(20,16,8,0.45)" }}>
            <p>Guides coming soon — check back shortly!</p>
          </div>
        ) : (
          <div className="guides-grid">
            {guides.map((g) => (
              <Link key={g._id} href={`/guides/${g.slug.current}`} className="gcard">
                <div className="gimg">
                  {g.cover ? (
                    <Image src={urlFor(g.cover).width(600).height(375).url()} alt={g.title} fill sizes="33vw" className="object-cover" />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem", color: "rgba(255,193,7,0.3)" }}>
                      {g.category === "cat" ? "🐱" : g.category === "bird" ? "🦜" : g.category === "reptile" ? "🦎" : "🐾"}
                    </div>
                  )}
                </div>
                <div className="gbody">
                  <span className="tag">{catMap[g.category] ?? "General"}{g.readTime ? ` · ${g.readTime} min` : ""}</span>
                  <h4>{g.title}</h4>
                  <p>{g.excerpt}</p>
                  <span className="rd">Read guide →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
