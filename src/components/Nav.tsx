"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Nav({ wa }: { wa: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="logo">Clawfrican</Link>

        <div className="nav-links">
          <Link href="/pets">Available Pets</Link>
          <Link href="/guides">Care Resources</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/about">About</Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/pets" className="nav-cta" style={{ textDecoration: "none" }}>Browse Pets</Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Menu"
            className="nav-burger"
            style={{ display: "none", flexDirection: "column", gap: 5, padding: 4 }}
          >
            <span style={{ display: "block", height: 2, width: 24, background: "var(--color-ink)", transition: "transform .25s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
            <span style={{ display: "block", height: 2, width: 24, background: "var(--color-ink)", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", height: 2, width: 24, background: "var(--color-ink)", transition: "transform .25s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "var(--color-cream)", paddingTop: 90, display: "flex", flexDirection: "column", gap: 24, padding: "90px 32px 32px" }}>
          <Link href="/pets" style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-ink)" }}>Available Pets</Link>
          <Link href="/guides" style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-ink)" }}>Care Resources</Link>
          <Link href="/reviews" style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-ink)" }}>Reviews</Link>
          <Link href="/about" style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-ink)" }}>About</Link>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ marginTop: 16, alignSelf: "flex-start" }}>
            Browse Pets on WhatsApp
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-burger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
