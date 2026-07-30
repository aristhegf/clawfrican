"use client";

import { useState } from "react";
import PetCard from "./PetCard";
import type { SanityImageSource } from "@sanity/image-url";

type Pet = {
  _id: string; name: string; breed: string; colour?: string; category: string;
  age?: string; price?: string; status: string; staffPick?: boolean;
  photo?: SanityImageSource; tags?: string[];
};

const FILTERS = [
  { value: "all", label: "All Pets" },
  { value: "cat", label: "🐱 Cats" },
  { value: "bird", label: "🦜 Birds" },
  { value: "reptile", label: "🦎 Reptiles" },
];

export default function PetCollection({ pets, initial = "all" }: { pets: Pet[]; initial?: string }) {
  const [active, setActive] = useState(initial);

  const filtered = active === "all" ? pets : pets.filter((p) => p.category === active);

  return (
    <>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: 50,
              fontSize: "0.875rem",
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              transition: "all 0.18s ease",
              background: active === f.value ? "var(--color-ink)" : "transparent",
              color: active === f.value ? "var(--color-cream)" : "var(--color-ink)",
              border: `1.5px solid ${active === f.value ? "var(--color-ink)" : "rgba(20,16,8,0.22)"}`,
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "rgba(20,16,8,0.45)" }}>
          <p style={{ fontSize: "1.0625rem" }}>No pets available in this category right now.</p>
          <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Check back soon — new arrivals happen regularly!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {filtered.map((pet) => <PetCard key={pet._id} pet={pet} />)}
        </div>
      )}
    </>
  );
}
