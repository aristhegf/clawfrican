import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem", background: "var(--color-cream)" }}>
      <span style={{ fontSize: "4rem", marginBottom: "1rem" }}>🐾</span>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "1rem" }}>
        Page not found.
      </h1>
      <p style={{ color: "rgba(20,16,8,0.55)", fontSize: "1.0625rem", marginBottom: "2rem", maxWidth: 420 }}>
        This page seems to have wandered off. Let&apos;s find you something better.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn btn-gold">Go Home</Link>
        <Link href="/pets" className="btn btn-ghost-dark">Browse Pets</Link>
      </div>
    </div>
  );
}
