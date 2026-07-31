"use client";

import { useState, useEffect } from "react";
import PetCard from "./PetCard";
import type { SanityImageSource } from "@sanity/image-url";

type Pet = {
  _id: string; name: string; breed: string; colour?: string; category: string;
  sex?: string; age?: string; price?: string; status: string; staffPick?: boolean;
  photo?: SanityImageSource;
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "cat", label: "Cats" },
  { value: "bird", label: "Birds" },
  { value: "reptile", label: "Reptiles" },
];

export default function PetCollection({ pets, initial = "all" }: { pets: Pet[]; initial?: string }) {
  const [active, setActive] = useState(initial);

  // Read ?category= from the URL on the client so the page can stay fully static.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("category");
    if (c && FILTERS.some((f) => f.value === c)) setActive(c);
  }, []);

  const filtered = active === "all" ? pets : pets.filter((p) => p.category === active);

  return (
    <>
      <div className="filters" style={{ marginTop: 0, marginBottom: 44 }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`filter${active === f.value ? " on" : ""}`}
            onClick={() => setActive(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0 120px", color: "rgba(20,16,8,0.45)" }}>
          <p style={{ fontSize: "1.0625rem" }}>No pets available in this category right now.</p>
          <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Check back soon — new arrivals happen regularly!</p>
        </div>
      ) : (
        <div className="coll-grid">
          {filtered.map((pet) => <PetCard key={pet._id} pet={pet} />)}
        </div>
      )}
    </>
  );
}
