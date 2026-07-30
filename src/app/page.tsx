import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PetCard from "@/components/PetCard";
import FaqAccordion from "@/components/FaqAccordion";
import { sanityFetch } from "@/sanity/lib/fetch";
import { FEATURED_PETS_QUERY, TESTIMONIALS_QUERY, FEATURED_GUIDES_QUERY, FAQS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { stars } from "@/lib/utils";
import type { SanityImageSource } from "@sanity/image-url";

export const metadata: Metadata = {
  title: "Clawfrican — Premium Cats, Birds & Reptiles in Lagos",
  description: "Hand-raised cats, birds, and reptiles from trusted breeders in Lagos. Health certified, ethically sourced, nationwide delivery across Nigeria.",
};

export const revalidate = 3600;

type Pet = {
  _id: string; name: string; breed: string; colour?: string; category: string;
  age?: string; price?: string; status: string; staffPick?: boolean;
  photo?: SanityImageSource; tags?: string[];
};

type Testimonial = { _id: string; name: string; location?: string; quote: string; rating: number; photo?: SanityImageSource };
type Guide = { _id: string; title: string; slug: { current: string }; category: string; excerpt: string; cover?: SanityImageSource; readTime?: number };
type Faq = { _id: string; question: string; answer: string; category?: string };
type SiteSettings = { whatsapp?: string; email?: string; instagram?: string; tiktok?: string; address?: string };

const categoryMap: Record<string, string> = { cat: "Cats", bird: "Birds", reptile: "Reptiles", general: "General" };

export default async function HomePage() {
  const [featuredPets, testimonials, guides, faqs, settings] = await Promise.all([
    sanityFetch<Pet[]>({ query: FEATURED_PETS_QUERY, tags: ["pet"], fallback: [] }),
    sanityFetch<Testimonial[]>({ query: TESTIMONIALS_QUERY, tags: ["testimonial"], fallback: [] }),
    sanityFetch<Guide[]>({ query: FEATURED_GUIDES_QUERY, tags: ["guide"], fallback: [] }),
    sanityFetch<Faq[]>({ query: FAQS_QUERY, tags: ["faq"], fallback: [] }),
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"], fallback: {} }),
  ]);

  const wa = settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : "https://wa.me/2349000000000";

  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100svh",
          background: "radial-gradient(ellipse at 60% 40%, var(--color-gold-hot) 0%, var(--color-gold) 60%, #e8a800 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "7rem 1.5rem 5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "60vmin", height: "60vmin", borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: "50vmin", height: "50vmin", borderRadius: "50%", background: "rgba(20,16,8,0.05)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 740, position: "relative" }}>
          {/* Eyebrow pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(20,16,8,0.08)", backdropFilter: "blur(8px)", borderRadius: 50, padding: "0.4rem 1rem", marginBottom: "1.75rem" }}>
            <span style={{ fontSize: "1rem" }}>🐾</span>
            <span style={{ fontSize: "0.813rem", fontWeight: 600, color: "var(--color-ink)" }}>Premium Companion Animals · Lagos, Nigeria</span>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.75rem, 8vw, 5.5rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--color-ink)", marginBottom: "1.5rem" }}>
            Discover extraordinary<br />companions.
          </h1>

          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.1875rem)", color: "rgba(20,16,8,0.72)", marginBottom: "2.5rem", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 2.5rem" }}>
            Hand-raised cats, birds, and reptiles — ethically bred in Lagos, delivered nationwide.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem", justifyContent: "center" }}>
            <Link href="/pets" className="btn btn-ghost-dark" style={{ fontSize: "0.9375rem", padding: "0.875rem 2rem" }}>
              Browse All Pets
            </Link>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: "var(--color-ink)", color: "var(--color-cream)", fontSize: "0.9375rem", padding: "0.875rem 2rem", borderRadius: 50 }}>
              WhatsApp Us ↗
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem", opacity: 0.5 }}>
          <div style={{ width: 1, height: 40, background: "var(--color-ink)" }} />
          <span style={{ fontSize: "0.688rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll</span>
        </div>
      </section>

      {/* ── FEATURED PETS ── */}
      {featuredPets.length > 0 && (
        <section className="section" style={{ background: "var(--color-cream)" }}>
          <div className="container" style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span className="kicker">LATEST ARRIVALS</span>
                <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Meet the family.</h2>
              </div>
              <Link href="/pets" className="btn btn-ghost-dark" style={{ fontSize: "0.875rem", padding: "0.625rem 1.5rem" }}>
                See all pets →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {featuredPets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORY BANDS ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">

          {/* Cats */}
          <div className="cat-band">
            <div className="cat-txt">
              <span className="kicker">Cats</span>
              <h3>Rare breeds, <em>raised with love.</em></h3>
              <p>Persians, Bengals and Maine Coons — socialised from birth, vaccinated, and paired with a lifetime care plan.</p>
              <Link href="/pets?category=cat" className="btn btn-gold">Browse Cats <span>→</span></Link>
            </div>
            <div className="cat-vis">
              <span className="big">Cats</span>
            </div>
          </div>

          {/* Birds */}
          <div className="cat-band alt flip">
            <div className="cat-txt">
              <span className="kicker">Birds</span>
              <h3>Companions that <em>talk back.</em></h3>
              <p>Hand-raised African greys, macaws and cockatoos — DNA-sexed, tame and ready to bond.</p>
              <Link href="/pets?category=bird" className="btn btn-gold">Browse Birds <span>→</span></Link>
            </div>
            <div className="cat-vis">
              <span className="big">Birds</span>
            </div>
          </div>

          {/* Reptiles */}
          <div className="cat-band">
            <div className="cat-txt">
              <span className="kicker">Reptiles</span>
              <h3>The collection <em>expands soon.</em></h3>
              <p>Ball python morphs, geckos and more — join the waitlist to be first in line when the reptile house opens.</p>
              <Link href="/pets?category=reptile" className="btn btn-ghost" style={{ borderColor: "rgba(245,245,220,0.4)", color: "var(--color-cream)" }}>See Reptiles</Link>
            </div>
            <div className="cat-vis">
              <span className="big">Soon</span>
              <span className="soon">Coming 2026</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── WHY CLAWFRICAN ── */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container" style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="kicker">THE CLAWFRICAN DIFFERENCE</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Born from passion. Built on trust.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
            {[
              { icon: "🌱", title: "Ethically Sourced", body: "No wild-caught animals. Every pet is captive-bred by vetted breeders or raised in-house." },
              { icon: "🩺", title: "Health Certified", body: "All pets arrive with a full health record — vaccinations, deworming, and vet certificate." },
              { icon: "📦", title: "Nationwide Delivery", body: "Climate-controlled transport to all 36 Nigerian states. Lagos 48h, nationwide 3–5 days." },
              { icon: "💬", title: "30-Day Support", body: "Your journey doesn't end at adoption. WhatsApp support from our team for 30 days post-purchase." },
            ].map((card) => (
              <div key={card.title} style={{ padding: "2rem", borderRadius: 16, border: "1px solid var(--color-line)", background: "var(--color-cream)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{card.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", marginBottom: "0.625rem", fontWeight: 400 }}>{card.title}</h3>
                <p style={{ color: "rgba(20,16,8,0.6)", fontSize: "0.9375rem", lineHeight: 1.65 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      {testimonials.length > 0 && (
        <section className="section" style={{ background: "var(--color-emerald-deep)" }}>
          <div className="container" style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span className="kicker kicker--light">WHAT PEOPLE SAY</span>
              <h2 style={{ color: "var(--color-cream)", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                They say it better.
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {testimonials.slice(0, 3).map((t) => (
                <div key={t._id} className="review-card">
                  <div style={{ color: "var(--color-gold)", fontSize: "1.125rem", letterSpacing: "0.05em" }}>{stars(t.rating)}</div>
                  <p style={{ color: "rgba(245,245,220,0.85)", fontSize: "0.9375rem", lineHeight: 1.7, fontStyle: "italic" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "auto" }}>
                    {t.photo && (
                      <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.1)" }}>
                        <Image src={urlFor(t.photo).width(80).height(80).url()} alt={t.name} width={40} height={40} className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p style={{ color: "var(--color-cream)", fontWeight: 600, fontSize: "0.875rem" }}>{t.name}</p>
                      {t.location && <p style={{ color: "rgba(245,245,220,0.45)", fontSize: "0.75rem" }}>{t.location}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {testimonials.length > 3 && (
              <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                <Link href="/reviews" className="btn btn-ghost-light">See all reviews</Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── GUIDES ── */}
      {guides.length > 0 && (
        <section className="section">
          <div className="container" style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span className="kicker">PET CARE RESOURCES</span>
                <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Guides to help you thrive.</h2>
              </div>
              <Link href="/guides" className="btn btn-ghost-dark" style={{ fontSize: "0.875rem", padding: "0.625rem 1.5rem" }}>
                All guides →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {guides.map((g) => (
                <Link key={g._id} href={`/guides/${g.slug.current}`} className="guide-card">
                  <div className="guide-card__img">
                    {g.cover ? (
                      <Image src={urlFor(g.cover).width(600).height(338).url()} alt={g.title} fill sizes="33vw" className="object-cover" />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, var(--color-emerald), var(--color-gold-deep))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
                        {g.category === "cat" ? "🐱" : g.category === "bird" ? "🦜" : g.category === "reptile" ? "🦎" : "🐾"}
                      </div>
                    )}
                  </div>
                  <div className="guide-card__body">
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span className="kicker" style={{ marginBottom: 0 }}>Guide · {categoryMap[g.category] ?? "General"}</span>
                      {g.readTime && <span style={{ fontSize: "0.688rem", color: "rgba(20,16,8,0.45)" }}>{g.readTime} min read</span>}
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 400 }}>{g.title}</h3>
                    <p style={{ color: "rgba(20,16,8,0.6)", fontSize: "0.875rem", lineHeight: 1.6 }}>{g.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {faqs.length > 0 && (
        <section className="section" style={{ borderTop: "1px solid var(--color-line)" }}>
          <div className="container" style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span className="kicker">COMMON QUESTIONS</span>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Answers before you ask.</h2>
            </div>
            <FaqAccordion items={faqs.slice(0, 8)} />
            {faqs.length > 8 && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Link href="/faq" className="btn btn-ghost-dark">See all questions</Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PetStore",
            name: "Clawfrican",
            url: "https://clawfrican.com",
            description: "Premium cats, birds, and reptiles in Lagos, Nigeria.",
            areaServed: { "@type": "Country", name: "Nigeria" },
            contactPoint: settings?.whatsapp ? { "@type": "ContactPoint", contactType: "Sales", telephone: `+${settings.whatsapp}` } : undefined,
            address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
          }),
        }}
      />
    </>
  );
}
