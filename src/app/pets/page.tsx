import type { Metadata } from "next";
import PetCollection from "@/components/PetCollection";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ALL_PETS_QUERY } from "@/lib/queries";
import type { SanityImageSource } from "@sanity/image-url";

export const metadata: Metadata = {
  title: "All Pets",
  description: "Browse our current selection of hand-raised cats, birds, and reptiles available in Lagos, Nigeria. Health certified and ethically sourced.",
};

export const revalidate = 3600;

type Pet = {
  _id: string; name: string; breed: string; colour?: string; category: string;
  age?: string; price?: string; status: string; staffPick?: boolean;
  photo?: SanityImageSource; tags?: string[];
};

export default async function PetsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const pets = await sanityFetch<Pet[]>({ query: ALL_PETS_QUERY, tags: ["pet"], fallback: [] });

  return (
    <div style={{ paddingTop: "5rem" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--color-emerald)",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
        }}
      >
        <span className="kicker kicker--light">OUR COLLECTION</span>
        <h1 style={{ color: "var(--color-cream)", fontSize: "clamp(2.5rem, 6vw, 4rem)", marginBottom: "1rem" }}>
          Find your companion.
        </h1>
        <p style={{ color: "rgba(245,245,220,0.65)", maxWidth: 520, margin: "0 auto", fontSize: "1.0625rem" }}>
          {pets.length} companion{pets.length !== 1 ? "s" : ""} currently available — hand-raised, health certified, ready to meet you.
        </p>
      </div>

      {/* Collection */}
      <section className="section">
        <div className="container" style={{ maxWidth: 1160, margin: "0 auto" }}>
          <PetCollection pets={pets} initial={category ?? "all"} />
        </div>
      </section>
    </div>
  );
}
