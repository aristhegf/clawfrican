import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { TESTIMONIALS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { stars } from "@/lib/utils";
import type { SanityImageSource } from "@sanity/image-url";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "What Clawfrican customers say about their pet adoption experience in Lagos, Nigeria.",
};

export const revalidate = 3600;

type Testimonial = { _id: string; name: string; location?: string; quote: string; rating: number; photo?: SanityImageSource };
type SiteSettings = { whatsapp?: string };

export default async function ReviewsPage() {
  const [testimonials, settings] = await Promise.all([
    sanityFetch<Testimonial[]>({ query: TESTIMONIALS_QUERY, tags: ["testimonial"], fallback: [] }),
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"], fallback: {} }),
  ]);

  const wa = settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : "#";

  return (
    <div style={{ paddingTop: "5rem" }}>
      <div style={{ background: "var(--color-emerald-deep)", padding: "4rem 1.5rem 3rem", textAlign: "center" }}>
        <span className="kicker kicker--light">HAPPY FAMILIES</span>
        <h1 style={{ color: "var(--color-cream)", fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>What our customers say.</h1>
        <p style={{ color: "rgba(245,245,220,0.6)", marginTop: "1rem", maxWidth: 480, margin: "1rem auto 0", fontSize: "1.0625rem" }}>
          Real stories from real families across Nigeria.
        </p>
      </div>

      <section className="section" style={{ background: "var(--color-emerald-deep)" }}>
        <div className="container" style={{ maxWidth: 1160, margin: "0 auto" }}>
          {testimonials.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "rgba(245,245,220,0.4)" }}>
              <p>Reviews coming soon!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {testimonials.map((t) => (
                <div key={t._id} className="review-card">
                  <div style={{ color: "var(--color-gold)", fontSize: "1.125rem", letterSpacing: "0.05em" }}>{stars(t.rating)}</div>
                  <p style={{ color: "rgba(245,245,220,0.85)", fontSize: "0.9375rem", lineHeight: 1.75, fontStyle: "italic", flex: 1 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {t.photo && (
                      <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                        <Image src={urlFor(t.photo).width(88).height(88).url()} alt={t.name} width={44} height={44} className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p style={{ color: "var(--color-cream)", fontWeight: 600, fontSize: "0.9375rem" }}>{t.name}</p>
                      {t.location && <p style={{ color: "rgba(245,245,220,0.45)", fontSize: "0.75rem" }}>{t.location}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: "var(--color-cream)", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", marginBottom: "1.25rem" }}>Ready to write your own story?</h2>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/pets" className="btn btn-gold">Find Your Pet</Link>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
