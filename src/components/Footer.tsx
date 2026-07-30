import Link from "next/link";

type SiteSettings = {
  whatsapp?: string;
  email?: string;
  instagram?: string;
  tiktok?: string;
  address?: string;
};

export default function Footer({ settings }: { settings: SiteSettings }) {
  const wa = settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : "#";
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--color-emerald-deep)", color: "var(--color-cream)" }}>
      {/* CTA band */}
      <div className="section" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container mx-auto text-center" style={{ maxWidth: 680 }}>
          <p className="kicker kicker--light">READY TO MEET YOUR COMPANION?</p>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", marginBottom: "1.5rem" }}>
            Find your perfect match.
          </h2>
          <p style={{ color: "rgba(245,245,220,0.6)", marginBottom: "2rem", fontSize: "1.0625rem" }}>
            Browse our current inventory or chat with Tayo — our AI consultant — to discover which companion suits your life.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/pets" className="btn btn-gold">Browse All Pets</Link>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="section-sm">
        <div
          className="container mx-auto grid gap-8"
          style={{ maxWidth: 1160, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
        >
          <div>
            <p style={{ fontFamily: "var(--font-wordmark)", letterSpacing: "0.02em", fontSize: "1.25rem", fontWeight: 500, marginBottom: "0.75rem" }}>
              Clawfrican
            </p>
            <p style={{ color: "rgba(245,245,220,0.5)", fontSize: "0.813rem", lineHeight: 1.6 }}>
              {settings?.address || "Lagos · By appointment"}
            </p>
          </div>

          <div>
            <p style={{ fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,245,220,0.45)", marginBottom: "0.75rem" }}>
              Explore
            </p>
            <nav className="flex flex-col gap-2">
              {[
                ["Pets", "/pets"],
                ["Care Guides", "/guides"],
                ["About", "/about"],
                ["Reviews", "/reviews"],
                ["FAQ", "/faq"],
              ].map(([label, href]) => (
                <Link key={href} href={href} style={{ color: "rgba(245,245,220,0.65)", fontSize: "0.875rem" }}
                  className="hover:text-cream transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p style={{ fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,245,220,0.45)", marginBottom: "0.75rem" }}>
              Contact
            </p>
            <div className="flex flex-col gap-2">
              {settings?.email && (
                <a href={`mailto:${settings.email}`} style={{ color: "rgba(245,245,220,0.65)", fontSize: "0.875rem" }}
                  className="hover:text-cream transition-colors">
                  {settings.email}
                </a>
              )}
              {settings?.whatsapp && (
                <a href={wa} target="_blank" rel="noopener noreferrer"
                  style={{ color: "rgba(245,245,220,0.65)", fontSize: "0.875rem" }}
                  className="hover:text-cream transition-colors">
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          <div>
            <p style={{ fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,245,220,0.45)", marginBottom: "0.75rem" }}>
              Follow
            </p>
            <div className="flex flex-col gap-2">
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                  style={{ color: "rgba(245,245,220,0.65)", fontSize: "0.875rem" }}
                  className="hover:text-cream transition-colors">
                  Instagram
                </a>
              )}
              {settings?.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer"
                  style={{ color: "rgba(245,245,220,0.65)", fontSize: "0.875rem" }}
                  className="hover:text-cream transition-colors">
                  TikTok
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 1.5rem" }}>
        <div className="container mx-auto flex flex-wrap gap-4 justify-between items-center" style={{ maxWidth: 1160 }}>
          <p style={{ color: "rgba(245,245,220,0.35)", fontSize: "0.75rem" }}>
            © {year} Clawfrican. All rights reserved.
          </p>
          <p style={{ color: "rgba(245,245,220,0.35)", fontSize: "0.75rem" }}>
            Ethically sourced · Health certified · Nigeria-wide delivery
          </p>
        </div>
      </div>
    </footer>
  );
}
