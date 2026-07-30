import Link from "next/link";

type SiteSettings = {
  whatsapp?: string;
  email?: string;
  instagram?: string;
  tiktok?: string;
  address?: string;
};

function formatPhone(raw?: string): string {
  if (!raw) return "WhatsApp";
  const d = String(raw).replace(/\D/g, "");
  if (d.startsWith("234") && d.length >= 13) {
    return `+234 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
  }
  return "+" + d;
}

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.2c.2-.3.5-.3.6-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.3 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2 1.3 2.3 1.5.2.1.4.1.6-.1l.7-.9c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.3.1.6-.1 1.2Z" /></svg>
);
const IconLocation = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7}><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none" /></svg>
);
const IconTiktok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M16.6 2h-3.1v13.2a2.5 2.5 0 1 1-2.1-2.5v-3.1a5.6 5.6 0 1 0 5.2 5.6V8.9a7 7 0 0 0 4 1.3V7a4.1 4.1 0 0 1-4-4Z" /></svg>
);

export default function Footer({ settings }: { settings: SiteSettings }) {
  const wa = settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : "https://wa.me/2349000000000";
  const hasSocial = settings?.instagram || settings?.tiktok;

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-cta reveal">
          <h2>Your companion is <em>already waiting.</em></h2>
          <Link href="/pets" className="btn btn-gold">Browse Available Pets <span className="arr">→</span></Link>
        </div>

        <div className="foot-grid">
          <div className="foot-brand">
            <span className="logo">Clawfrican</span>
            <p>A Nigerian Exotic Pet Cafe. Rare companions, extraordinary care.</p>
          </div>

          <div className="foot-col">
            <h5>Shop</h5>
            <Link href="/pets?category=cat">Cats</Link>
            <Link href="/pets?category=bird">Birds</Link>
            <Link href="/pets?category=reptile">Reptiles</Link>
          </div>

          <div className="foot-col">
            <h5>Company</h5>
            <Link href="/guides">Care Resources</Link>
            <Link href="/reviews">Reviews</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/about">About</Link>
          </div>

          <div className="foot-col">
            <h5>Contact</h5>
            {settings?.email && (
              <a className="ic-link" href={`mailto:${settings.email}`}><IconMail /><span>{settings.email}</span></a>
            )}
            <a className="ic-link" href={wa} target="_blank" rel="noopener noreferrer"><IconWhatsApp /><span>{formatPhone(settings?.whatsapp)}</span></a>
            {settings?.address && (
              <span className="ic-link"><IconLocation /><span>{settings.address}</span></span>
            )}
            {hasSocial && (
              <div className="foot-social">
                {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconInstagram /></a>}
                {settings?.tiktok && <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><IconTiktok /></a>}
              </div>
            )}
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2026 Clawfrican. All rights reserved.</span>
          <span>Lagos, Nigeria</span>
        </div>
      </div>
    </footer>
  );
}
