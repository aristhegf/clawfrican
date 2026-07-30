import Link from "next/link";
import Image from "next/image";
import { nameToSlug, statusLabel } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

type Pet = {
  _id: string;
  name: string;
  breed: string;
  colour?: string;
  category: string;
  age?: string;
  price?: string;
  status: string;
  staffPick?: boolean;
  photo?: SanityImageSource;
  tags?: string[];
};

export default function PetCard({ pet }: { pet: Pet }) {
  const slug = nameToSlug(pet.name);
  const imgUrl = pet.photo ? urlFor(pet.photo).width(600).height(660).url() : null;

  return (
    <Link href={`/pets/${slug}`} className="pet-card">
      <div className="pet-card__img">
        {imgUrl ? (
          <Image src={imgUrl} alt={pet.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
        ) : (
          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "5rem", color: "rgba(255,193,7,0.2)" }}>
            {pet.category === "cat" ? "🐱" : pet.category === "bird" ? "🦜" : "🦎"}
          </span>
        )}

        <span className="badge">
          <span className={`badge__dot badge__dot--${pet.status}`} />
          {statusLabel(pet.status)}
        </span>

        {pet.staffPick && <span className="badge-staff-pick">Staff Pick</span>}
      </div>

      <div className="pet-card__body">
        <p className="pet-card__name">{pet.name}</p>
        <p className="pet-card__breed">
          {[pet.breed, pet.colour, pet.age].filter(Boolean).join(" · ")}
        </p>

        <div className="pet-card__footer">
          <p className="pet-card__price">{pet.price || "Price on enquiry"}</p>
          <span className="pet-card__go">View →</span>
        </div>
      </div>
    </Link>
  );
}
