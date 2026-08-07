import type { Metadata } from "next";
import Link from "next/link";
import PetCard from "@/components/PetCard";
import FaqAccordion from "@/components/FaqAccordion";
import { sanityFetch } from "@/sanity/lib/fetch";
import { FEATURED_PETS_QUERY, TESTIMONIALS_QUERY, FEATURED_GUIDES_QUERY, FAQS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import { getFaqGroups } from "@/lib/faqs";
import { formatReviewDate } from "@/lib/utils";
import type { SanityImageSource } from "@sanity/image-url";

export const metadata: Metadata = {
  title: "Clawfrican — Premium Cats, Birds & Reptiles in Lagos",
  description: "Hand-raised cats, birds, and reptiles from trusted breeders in Lagos. Health certified, ethically sourced, nationwide delivery across Nigeria.",
};

export const revalidate = 3600;

type Pet = {
  _id: string; name: string; breed: string; colour?: string; category: string;
  sex?: string; age?: string; price?: string; status: string; staffPick?: boolean;
  photo?: SanityImageSource;
};
type Testimonial = { _id: string; name: string; location?: string; quote: string; rating: number; submittedAt?: string };
type Guide = { _id: string; title: string; slug: { current: string }; category: string; excerpt: string; readTime?: number };
type Faq = { _id: string; question: string; answer: string; category?: string };
type SiteSettings = { whatsapp?: string; email?: string; instagram?: string; tiktok?: string; address?: string };

const catLabel: Record<string, string> = { cat: "Cats", bird: "Birds", reptile: "Reptiles", general: "General" };

export default async function HomePage() {
  const [featuredPets, testimonials, guides, faqs, settings] = await Promise.all([
    sanityFetch<Pet[]>({ query: FEATURED_PETS_QUERY, tags: ["pet"], fallback: [] }),
    sanityFetch<Testimonial[]>({ query: TESTIMONIALS_QUERY, tags: ["testimonial"], fallback: [] }),
    sanityFetch<Guide[]>({ query: FEATURED_GUIDES_QUERY, tags: ["guide"], fallback: [] }),
    sanityFetch<Faq[]>({ query: FAQS_QUERY, tags: ["faq"], fallback: [] }),
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"], fallback: {} }),
  ]);

  return (
    <>
      {/* ─────────── HERO ─────────── */}
      <header className="hero">
        <div className="hero-sun" aria-hidden="true" />
        <div className="hero-rings" aria-hidden="true"><div /><div /><div /></div>
        <div className="hero-content">
          <div className="hero-eyebrow"><span className="dot" />A Nigerian Exotic Pet Cafe</div>
          <h1>
            <span className="row"><span>Discover</span></span>
            <span className="row"><span><em>extraordinary</em> pets.</span></span>
          </h1>
          <p className="hero-sub">Every companion at Clawfrican has a name, a story, and a certificate of health. Meet yours.</p>
          <div className="hero-cta">
            <Link href="/pets" className="btn btn-dark">Browse Available Pets <span className="arr">→</span></Link>
          </div>
        </div>
        <div className="scroll-hint">Scroll</div>
      </header>

      {/* ─────────── FEATURED PETS ─────────── */}
      {featuredPets.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <div className="reveal">
                <div className="kicker">Featured Pets</div>
                <h2 className="sec-title">Meet this season&rsquo;s <em>companions.</em></h2>
              </div>
              <p className="sec-note reveal d1">Each one photographed, health-certified and named.</p>
            </div>
            <div className="feat-grid">
              {featuredPets.slice(0, 3).map((pet) => <PetCard key={pet._id} pet={pet} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─────────── CATEGORY BANDS ─────────── */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cat-band reveal">
            <div className="cat-txt">
              <div className="kicker">Cats</div>
              <h3>Rare breeds, <em>raised with love.</em></h3>
              <p>Persians, Bengals and Maine Coons — socialised from birth, vaccinated, and paired with a lifetime care plan.</p>
              <Link href="/pets?category=cat" className="btn btn-gold">Browse Cats <span className="arr">→</span></Link>
            </div>
            <div className="cat-vis"><span className="big">Cats</span></div>
          </div>

          <div className="cat-band alt flip reveal">
            <div className="cat-txt">
              <div className="kicker">Birds</div>
              <h3>Companions that <em>talk back.</em></h3>
              <p>Hand-raised African greys, macaws and cockatoos — DNA-sexed, tame and ready to bond.</p>
              <Link href="/pets?category=bird" className="btn btn-gold">Browse Birds <span className="arr">→</span></Link>
            </div>
            <div className="cat-vis"><span className="big">Birds</span></div>
          </div>

          <div className="cat-band reveal">
            <div className="cat-txt">
              <div className="kicker">Reptiles</div>
              <h3>The collection <em>expands soon.</em></h3>
              <p>Ball python morphs, geckos and more — join the waitlist to be first in line when the reptile house opens.</p>
              <Link href="/pets?category=reptile" className="btn btn-ghost" style={{ borderColor: "rgba(245,245,220,0.4)", color: "var(--color-cream)" }}>See Reptiles</Link>
            </div>
            <div className="cat-vis"><span className="big">Soon</span><span className="soon">Coming 2026</span></div>
          </div>
        </div>
      </section>

      {/* ─────────── WHY CLAWFRICAN ─────────── */}
      <section className="sec why">
        <div className="wrap">
          <div className="sec-head">
            <div className="reveal">
              <div className="kicker">Why Clawfrican</div>
              <h2 className="sec-title">Not inventory. <em>Individuals.</em></h2>
            </div>
            <p className="sec-note reveal d1">Every animal here has a name and a story — because that&rsquo;s how you&rsquo;ll love them too.</p>
          </div>
          <div className="why-grid">
            <div className="why-card reveal"><div className="ic">✓</div><h4>Health-certified</h4><p>Vet documentation and a written health guarantee with every companion. No exceptions.</p></div>
            <div className="why-card reveal d1"><div className="ic">✦</div><h4>Ethically sourced</h4><p>Full provenance on every animal — bred responsibly, never wild-caught, always compliant.</p></div>
            <div className="why-card reveal"><div className="ic">◈</div><h4>Lifetime aftercare</h4><p>Feeding plans, habitat guidance and on-call support for as long as you need us.</p></div>
            <div className="why-card reveal d1"><div className="ic">→</div><h4>White-glove delivery</h4><p>Climate-controlled, stress-minimised transport to all 36 states.</p></div>
          </div>
        </div>
      </section>

      {/* ─────────── REVIEWS ─────────── */}
      {testimonials.length > 0 && (
        <section className="sec rev-band">
          <div className="wrap">
            <div className="sec-head">
              <div className="reveal">
                <div className="kicker">Customer Reviews</div>
                <h2 className="sec-title">Loved by <em>their humans.</em></h2>
              </div>
            </div>
            <div className="rev-grid">
              {testimonials.slice(0, 3).map((t, i) => (
                <div key={t._id} className={`rev reveal${i === 1 ? " d1" : i === 2 ? " d2" : ""}`}>
                  <div className="stars">{"★".repeat(Math.round(t.rating || 5))}</div>
                  <p>&ldquo;{t.quote}&rdquo;</p>
                  <div className="who">
                    <div className="av">{t.name?.[0] ?? "C"}</div>
                    <div>
                      <div className="nm">{t.name}</div>
                      {(t.location || formatReviewDate(t.submittedAt)) && (
                        <div className="lc">{[t.location, formatReviewDate(t.submittedAt)].filter(Boolean).join(" · ")}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {testimonials.length > 3 && (
              <div className="sec-more">
                <Link href="/reviews" className="btn btn-ghost" style={{ borderColor: "rgba(245,245,220,0.4)", color: "var(--color-cream)" }}>See all reviews <span className="arr">→</span></Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────── CARE RESOURCES ─────────── */}
      {guides.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <div className="reveal">
                <div className="kicker">Care Resources</div>
                <h2 className="sec-title">Own it <em>confidently.</em></h2>
              </div>
              <p className="sec-note reveal d1">Free guides written by our team — settling in, feeding, grooming and more.</p>
            </div>
            <div className="care-grid">
              {guides.slice(0, 3).map((g) => (
                <Link key={g._id} href={`/guides/${g.slug.current}`} className="care reveal">
                  <span className="tag">{catLabel[g.category] ?? "General"}</span>
                  <h4>{g.title}</h4>
                  <p>{g.excerpt}</p>
                  <span className="rd">Read guide <span className="arr">→</span></span>
                </Link>
              ))}
            </div>
            {guides.length > 3 && (
              <div className="sec-more">
                <Link href="/guides" className="btn btn-ghost">See all guides <span className="arr">→</span></Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────── FAQ ─────────── */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head" style={{ justifyContent: "center", textAlign: "center" }}>
            <div className="reveal" style={{ margin: "0 auto" }}>
              <div className="kicker center">FAQ</div>
              <h2 className="sec-title">Questions, <em>answered.</em></h2>
            </div>
          </div>
          <div className="faq-wrap">
            {getFaqGroups(faqs).map((g) => (
              <div key={g.category} className="faq-cat">
                <h4>{g.category}</h4>
                <FaqAccordion items={g.items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── JSON-LD ─────────── */}
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
