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
  sex?: string; age?: string; price?: string; status: string; staffPick?: boolean;
  photo?: SanityImageSource;
};

export default async function PetsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const pets = await sanityFetch<Pet[]>({ query: ALL_PETS_QUERY, tags: ["pet"], fallback: [] });

  return (
    <>
      <div className="coll-head">
        <div className="wrap">
          <h1>Available <em>pets.</em></h1>
          <p>Each companion is photographed individually, health-certified and named. Tap any card to meet them properly.</p>
        </div>
      </div>
      <div className="wrap">
        <PetCollection pets={pets} initial={category ?? "all"} />
      </div>
    </>
  );
}
