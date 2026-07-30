import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PetCard from "@/components/PetCard";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PET_BY_SLUG_QUERY, ALL_PETS_FOR_PARAMS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { nameToSlug, statusLabel } from "@/lib/utils";
import type { SanityImageSource } from "@sanity/image-url";

export const revalidate = 3600;

type Pet = {
  _id: string; name: string; breed: string; colour?: string; category: string;
  sex?: string; age?: string; price?: string; status: string; staffPick?: boolean;
  photo?: SanityImageSource; gallery?: SanityImageSource[]; videoUrl?: string;
  tags?: string[]; health?: string[]; temperament?: string; diet?: string; story?: string;
  litterTrained?: boolean; pedigree?: string; coatType?: string;
  vocabulary?: string; handFed?: boolean; closedRing?: boolean;
  morph?: string; feedingSchedule?: string; lastShed?: string; origin?: string;
};

type SiteSettings = { whatsapp?: string; email?: string };

const CAT_LABEL: Record<string, string> = { cat: "Cats", bird: "Birds", reptile: "Reptiles" };

export async function generateStaticParams() {
  const pets = await sanityFetch<{ name: string }[]>({ query: ALL_PETS_FOR_PARAMS_QUERY, fallback: [] });
  return pets.map((p) => ({ slug: nameToSlug(p.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pets = await sanityFetch<Pet[]>({ query: PET_BY_SLUG_QUERY, tags: ["pet"], fallback: [] });
  const pet = pets.find((p) => nameToSlug(p.name) === slug);
  if (!pet) return { title: "Pet not found" };

  const imgUrl = pet.photo ? urlFor(pet.photo).width(1200).height(630).url() : undefined;

  return {
    title: `${pet.name} — ${pet.breed}`,
    description: pet.story
      ? `${pet.story.slice(0, 155)}…`
      : `${pet.name} is a ${pet.age ?? ""} ${pet.breed} ${pet.category} available at Clawfrican, Lagos.`,
    openGraph: {
      title: `${pet.name} — ${pet.breed} | Clawfrican`,
      description: pet.story?.slice(0, 155) ?? "",
      images: imgUrl ? [{ url: imgUrl, width: 1200, height: 630, alt: pet.name }] : [],
    },
  };
}

export default async function PetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [pets, settings] = await Promise.all([
    sanityFetch<Pet[]>({ query: PET_BY_SLUG_QUERY, tags: ["pet"], fallback: [] }),
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"], fallback: {} }),
  ]);

  const pet = pets.find((p) => nameToSlug(p.name) === slug);
  if (!pet) notFound();

  const wa = settings?.whatsapp
    ? `https://wa.me/${settings.whatsapp}?text=Hi! I'm interested in ${pet.name} (${pet.breed})`
    : `https://wa.me/2349000000000?text=Hi! I'm interested in ${pet.name}`;
  const email = settings?.email;

  const mainImgUrl = pet.photo ? urlFor(pet.photo).width(900).height(900).url() : null;
  const galleryUrls = (pet.gallery ?? []).map((img) => urlFor(img).width(300).height(300).url());
  const isAvailable = pet.status === "available" || pet.status === "new-arrival";

  const facts: [string, string][] = [
    ["Category", CAT_LABEL[pet.category] ?? pet.category],
    pet.sex ? ["Sex", pet.sex] : null,
    pet.age ? ["Age", pet.age] : null,
    pet.colour ? ["Colour", pet.colour] : null,
    pet.temperament ? ["Temperament", pet.temperament] : null,
    pet.diet ? ["Diet", pet.diet] : null,
    pet.category === "cat" && pet.pedigree ? ["Pedigree", pet.pedigree] : null,
    pet.category === "cat" && pet.coatType ? ["Coat type", pet.coatType] : null,
    pet.category === "bird" && pet.vocabulary ? ["Vocabulary", pet.vocabulary] : null,
    pet.category === "reptile" && pet.morph ? ["Morph", pet.morph] : null,
    pet.category === "reptile" && pet.origin ? ["Origin", pet.origin] : null,
    pet.category === "reptile" && pet.lastShed ? ["Last shed", pet.lastShed] : null,
    pet.category === "reptile" && pet.feedingSchedule ? ["Feeding", pet.feedingSchedule] : null,
  ].filter(Boolean) as [string, string][];

  const others = pets.filter((p) => p._id !== pet._id && p.status !== "sold").slice(0, 3);

  return (
    <div className="pet-hero">
      <div className="wrap">
        {/* Breadcrumb */}
        <nav className="crumb">
          <Link href="/pets">← Available Pets</Link>
          <span>/</span>
          <Link href={`/pets?category=${pet.category}`}>{CAT_LABEL[pet.category] ?? ""}</Link>
          <span>/</span>
          <span style={{ color: "var(--color-ink)" }}>{pet.name}</span>
        </nav>

        <div className="pet-layout">
          {/* ── Left: gallery ── */}
          <div>
            <div className="pg-main">
              {mainImgUrl ? (
                <Image src={mainImgUrl} alt={pet.name} fill sizes="(max-width:960px) 100vw, 55vw" className="object-cover" priority />
              ) : (
                <span className="sil">{pet.name[0]}.</span>
              )}
              {pet.staffPick && <span className="staffpick">⭐ Staff Pick</span>}
            </div>
            {galleryUrls.length > 0 && (
              <div className="pg-thumbs">
                {galleryUrls.slice(0, 4).map((url, i) => (
                  <div key={i} className="pg-thumb">
                    <Image src={url} alt={`${pet.name} photo ${i + 2}`} fill sizes="120px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: details ── */}
          <div>
            <div className="pet-title-block">
              <span className="avail">
                {isAvailable && <span className="pulse" />}
                {isAvailable ? "Available now" : statusLabel(pet.status)}
              </span>
              <h1 className="pet-page-name">{pet.name}</h1>
              <p className="pet-page-sub">
                {pet.breed}
                {pet.colour && <><span className="sep">·</span>{pet.colour}</>}
              </p>
              {pet.price && <div className="pet-page-price">{pet.price}</div>}
            </div>

            <div className="pblock">
              <h3>Quick Facts</h3>
              <div className="facts">
                {facts.map(([k, v]) => (
                  <div key={k} className="fact"><div className="k">{k}</div><div className="v">{v}</div></div>
                ))}
              </div>
            </div>

            {pet.tags && pet.tags.length > 0 && (
              <div className="pblock">
                <h3>Personality</h3>
                <div className="chips">
                  {pet.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
                </div>
              </div>
            )}

            {pet.health && pet.health.length > 0 && (
              <div className="pblock">
                <h3>Health</h3>
                <ul className="incl">
                  {pet.health.map((h) => (
                    <li key={h}><span className="tick">✓</span>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {pet.story && (
              <div className="pblock">
                <h3>About {pet.name}</h3>
                <p className="about-txt">{pet.story}</p>
              </div>
            )}

            <div className="pblock">
              <h3>What&rsquo;s Included</h3>
              <ul className="incl">
                <li><span className="tick">✓</span>Complete health records &amp; vet certification</li>
                <li><span className="tick">✓</span>Breed-specific care guide (digital &amp; print)</li>
                <li><span className="tick">✓</span>Starter pack — food, care kit &amp; comfort item</li>
                <li><span className="tick">✓</span>30-day post-adoption support on WhatsApp</li>
              </ul>
            </div>

            <div className="pblock">
              <h3>Delivery</h3>
              <div className="deliv">
                <div className="ic">→</div>
                <p><b>Climate-controlled delivery to all 36 states.</b> Lagos deliveries arrive within 48 hours of reservation; nationwide within 3–5 days. You&rsquo;ll receive photo updates at every step.</p>
              </div>
            </div>

            <div className="pet-cta-zone">
              <a className="btn btn-dark" href={wa} target="_blank" rel="noopener noreferrer">
                {isAvailable ? "Reserve on WhatsApp" : "Join the Waitlist"} <span className="arr">→</span>
              </a>
              {email && (
                <a className="btn btn-ghost" href={`mailto:${email}?subject=Enquiry about ${pet.name}&body=Hi, I'm interested in ${pet.name} (${pet.breed}).`}>
                  Enquire by Email
                </a>
              )}
              <p className="pet-note">Reservation holds this pet for 72 hours · Fully refundable</p>
            </div>
          </div>
        </div>
      </div>

      {/* More pets */}
      {others.length > 0 && (
        <section className="more-strip">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="kicker">Keep exploring</div>
                <h2 className="sec-title">Others you&rsquo;ll <em>adore.</em></h2>
              </div>
            </div>
            <div className="more-grid">
              {others.map((p) => <PetCard key={p._id} pet={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: pet.name,
            description: pet.story ?? `${pet.name} is a ${pet.breed} available at Clawfrican`,
            image: mainImgUrl ?? undefined,
            brand: { "@type": "Brand", name: "Clawfrican" },
            offers: {
              "@type": "Offer",
              priceCurrency: "NGN",
              price: pet.price?.replace(/[₦,]/g, "") ?? undefined,
              availability: isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: "Clawfrican" },
            },
          }),
        }}
      />
    </div>
  );
}
