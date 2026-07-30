"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Nav({ wa }: { wa: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const onHero = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const isTransparent = onHero && !scrolled;

  const linkCls = `text-sm font-semibold tracking-wide transition-opacity hover:opacity-70 ${
    isTransparent ? "text-cream" : "text-ink"
  }`;

  return (
    <>
      <header
        style={{ transition: "background 0.3s ease, box-shadow 0.3s ease" }}
        className={`fixed top-0 left-0 right-0 z-[90] ${
          isTransparent
            ? "bg-transparent"
            : "bg-cream/95 backdrop-blur-md shadow-[0_1px_0_rgba(20,16,8,0.08)]"
        }`}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between" style={{ maxWidth: 1160 }}>
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span
              style={{ fontFamily: "var(--font-wordmark)", letterSpacing: "0.02em", fontSize: "1.5rem", fontWeight: 500 }}
              className={`font-medium ${isTransparent ? "text-cream" : "text-ink"}`}
            >
              Clawfrican
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/pets" className={linkCls}>Pets</Link>
            <Link href="/guides" className={linkCls}>Guides</Link>
            <Link href="/about" className={linkCls}>About</Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-gold text-sm py-2 px-5 hidden sm:inline-flex">
              Browse Pets
            </a>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className={`md:hidden flex flex-col gap-1.5 p-1 ${isTransparent ? "text-cream" : "text-ink"}`}
              aria-label="Menu"
            >
              <span className={`block h-0.5 w-6 bg-current transition-transform origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-6 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-current transition-transform origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[80] bg-cream pt-16 flex flex-col px-6 py-8 gap-6 md:hidden">
          <Link href="/pets" className="text-2xl font-display text-ink">Pets</Link>
          <Link href="/guides" className="text-2xl font-display text-ink">Guides</Link>
          <Link href="/about" className="text-2xl font-display text-ink">About</Link>
          <Link href="/reviews" className="text-2xl font-display text-ink">Reviews</Link>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-4 self-start">
            Browse Pets on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
