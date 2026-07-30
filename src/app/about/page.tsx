import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ABOUT_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Clawfrican — a Lagos-based premium pet shop built on a love of extraordinary animals.",
};

export const revalidate = 3600;

type AboutData = { headline?: string; story?: string; portrait?: SanityImageSource; signature?: string };
type SiteSettings = { whatsapp?: string };

export default async function AboutPage() {
  const [about, settings] = await Promise.all([
    sanityFetch<AboutData>({ query: ABOUT_QUERY, tags: ["aboutPage"], fallback: {} }),
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"], fallback: {} }),
  ]);

  const wa = settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : "#";
  const portraitUrl = about?.portrait ? urlFor(about.portrait).width(600).height(700).url() : null;

  return (
    <div style={{ paddingTop: "5rem" }}>
      {/* Hero */}
      <div style={{ background: "var(--color-emerald)", padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
        <span className="kicker kicker--light">OUR STORY</span>
        <h1 style={{ color: "var(--color-cream)", fontSize: "clamp(2.5rem, 6vw, 4rem)", maxWidth: 680, margin: "0 auto" }}>
          {about?.headline || "We believe every animal deserves a loving home."}
        </h1>
      </div>

      {/* Story + portrait */}
      <section className="section">
        <div
          className="container"
          style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}
        >
          <div>
            <span className="kicker">THE FOUNDER</span>
            <div style={{ color: "rgba(20,16,8,0.75)", lineHeight: 1.85, fontSize: "1rem" }}>
              {about?.story
                ? about.story.split("\n").map((para, i) => <p key={i} style={{ marginBottom: "1.25rem" }}>{para}</p>)
                : (
                  <>
                    <p style={{ marginBottom: "1.25rem" }}>Clawfrican was born out of a simple belief: the right pet, matched to the right person, can transform a life. I started this journey because I experienced that transformation firsthand.</p>
                    <p style={{ marginBottom: "1.25rem" }}>Every animal in our care is hand-raised, health-certified, and socialised before they meet their forever family. We work only with trusted breeders who share our values.</p>
                    <p>Our promise is simple: we will help you find the right companion, and we will support you long after the adoption.</p>
                  </>
                )}
            </div>
            {about?.signature && (
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontStyle: "italic", marginTop: "2rem", color: "var(--color-bronze)" }}>
                — {about.signature}
              </p>
            )}
          </div>

          <div style={{ borderRadius: 20, overflow: "hidden", aspectRatio: "3/4", background: "linear-gradient(135deg, var(--color-emerald), var(--color-gold-deep))", position: "relative" }}>
            {portraitUrl ? (
              <Image src={portraitUrl} alt="Founder" fill className="object-cover" sizes="(max-width:768px) 100vw, 480px" />
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6rem" }}>🌿</div>
            )}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: "var(--color-emerald)" }}>
        <div className="container" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="kicker kicker--light">WHAT WE STAND FOR</span>
            <h2 style={{ color: "var(--color-cream)", fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>Our values.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: "🌱", title: "Ethical sourcing", body: "No wild-caught animals. Ever. Every pet is captive-bred by vetted partners." },
              { icon: "❤️", title: "Animal welfare first", body: "Health, enrichment, and socialisation come before profit at every stage." },
              { icon: "🤝", title: "Long-term support", body: "We stay with you — 30 days of dedicated WhatsApp support post-adoption." },
              { icon: "🔬", title: "Transparency", body: "Full health records, honest descriptions, no surprises." },
            ].map((v) => (
              <div key={v.title} style={{ padding: "1.5rem", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{v.icon}</div>
                <h3 style={{ color: "var(--color-cream)", fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 400, marginBottom: "0.5rem" }}>{v.title}</h3>
                <p style={{ color: "rgba(245,245,220,0.6)", fontSize: "0.875rem", lineHeight: 1.65 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", marginBottom: "1.25rem" }}>Ready to meet your companion?</h2>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/pets" className="btn btn-gold">Browse All Pets</Link>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
