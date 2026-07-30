import Link from "next/link";
import Image from "next/image";
import { nameToSlug } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

type Pet = {
  _id: string;
  name: string;
  breed: string;
  colour?: string;
  category: string;
  sex?: string;
  age?: string;
  price?: string;
  status: string;
  staffPick?: boolean;
  photo?: SanityImageSource;
};

const STATUS_BADGE: Record<string, { t: string; cls: string }> = {
  available: { t: "Available", cls: "" },
  reserved: { t: "Reserved", cls: "reserved" },
  "coming-soon": { t: "Coming Soon", cls: "soon" },
  "new-arrival": { t: "New Arrival", cls: "new" },
};

export default function PetCard({ pet }: { pet: Pet }) {
  const slug = nameToSlug(pet.name);
  const imgUrl = pet.photo ? urlFor(pet.photo).width(600).height(660).url() : null;
  const b = STATUS_BADGE[pet.status] ?? STATUS_BADGE.available;
  const meta = [pet.colour, pet.sex, pet.age].filter(Boolean).join(" · ");

  return (
    <Link href={`/pets/${slug}`} className="pet-card">
      <div className="pet-img">
        {imgUrl ? (
          <Image src={imgUrl} alt={`${pet.name}, ${pet.breed}`} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
        ) : (
          <span className="sil">{pet.name[0]}.</span>
        )}
        <span className={`badge ${b.cls}`}><span className="pulse" />{b.t}</span>
        {pet.staffPick && <span className="staffpick">⭐ Staff Pick</span>}
      </div>

      <div className="pet-body">
        <div className="pet-name">{pet.name}</div>
        <div className="pet-meta"><b>{pet.breed}</b>{meta && <> · {meta}</>}</div>
        <div className="pet-foot">
          <span className="pet-price">{pet.price || "Enquire"}</span>
          <span className="pet-go">Meet {pet.name} →</span>
        </div>
      </div>
    </Link>
  );
}
