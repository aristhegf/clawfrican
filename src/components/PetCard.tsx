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
  const imgUrl = pet.photo ? urlFor(pet.photo).width(600).height(600).url() : null;

  return (
    <Link href={`/pets/${slug}`} className="pet-card">
      <div className="pet-card__img">
        {imgUrl ? (
          <Image src={imgUrl} alt={pet.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #132e27, #96731a)" }} />
        )}
        <span className={`badge badge--${pet.status}`}>
          {statusLabel(pet.status)}
        </span>
        {pet.staffPick && <span className="badge-staff-pick">⭐ Staff Pick</span>}
      </div>

      <div className="pet-card__body">
        <p className="pet-card__name">{pet.name}</p>
        <p className="pet-card__breed">
          {[pet.breed, pet.colour].filter(Boolean).join(" · ")}
          {pet.age && <> · {pet.age}</>}
        </p>
        {pet.tags && pet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {pet.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="pill" style={{ fontSize: "0.688rem" }}>{tag}</span>
            ))}
          </div>
        )}
        <p className="pet-card__price">{pet.price || "Price on enquiry"}</p>
      </div>
    </Link>
  );
}
