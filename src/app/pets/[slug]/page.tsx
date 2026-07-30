import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PET_BY_SLUG_QUERY, ALL_PETS_FOR_PARAMS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { nameToSlug, statusLabel, formatPrice } from "@/lib/utils";
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

export async function generateStaticParams() {
  const pets = await sanityFetch<{ name: string }[]>({
    query: ALL_PETS_FOR_PARAMS_QUERY,
    fallback: [],
  });
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
  const mainImgUrl = pet.photo ? urlFor(pet.photo).width(800).height(800).url() : null;
  const galleryUrls = (pet.gallery ?? []).map((img) => urlFor(img).width(400).height(400).url());

  const isAvailable = pet.status === "available" || pet.status === "new-arrival";

  const quickFacts: [string, string][] = [
    ["Category", pet.category === "cat" ? "Cat" : pet.category === "bird" ? "Bird" : "Reptile"],
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

  return (
    <div style={{ paddingTop: "4.5rem" }}>
      {/* Breadcrumb */}
      <div className="container" style={{ maxWidth: 1160, margin: "0 auto", padding: "1.25rem 1.5rem" }}>
        <nav style={{ fontSize: "0.813rem", color: "rgba(20,16,8,0.45)", display: "flex", gap: "0.5rem" }}>
          <Link href="/" className="hover:opacity-70">Home</Link>
          <span>/</span>
          <Link href="/pets" className="hover:opacity-70">Pets</Link>
          <span>/</span>
          <span style={{ color: "var(--color-ink)" }}>{pet.name}</span>
        </nav>
      </div>

      {/* Main content */}
      <section className="section-sm">
        <div
          className="container pet-detail-grid"
          style={{ maxWidth: 1160, margin: "0 auto", padding: "0 1.5rem" }}
        >
          {/* ── Left: Images ── */}
          <div>
            {/* Main photo */}
            <div style={{ position: "relative", aspectRatio: "1/1", borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, var(--color-emerald), var(--color-gold-deep))", marginBottom: "1rem" }}>
              {mainImgUrl ? (
                <Image src={mainImgUrl} alt={pet.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" priority />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6rem" }}>
                  {pet.category === "cat" ? "🐱" : pet.category === "bird" ? "🦜" : "🦎"}
                </div>
              )}
              {pet.staffPick && (
                <span style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--color-gold)", color: "var(--color-ink)", padding: "0.25rem 0.75rem", borderRadius: 50, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  ⭐ Staff Pick
                </span>
              )}
            </div>

            {/* Gallery thumbnails */}
            {galleryUrls.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.625rem" }}>
                {galleryUrls.slice(0, 4).map((url, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "1/1", borderRadius: 10, overflow: "hidden", background: "linear-gradient(135deg, var(--color-emerald), var(--color-gold-deep))" }}>
                    <Image src={url} alt={`${pet.name} photo ${i + 2}`} fill sizes="80px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span
                style={{
                  padding: "0.25rem 0.75rem", borderRadius: 50, fontSize: "0.75rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  background: pet.status === "available" ? "#22c55e" : pet.status === "new-arrival" ? "#3b82f6" : pet.status === "reserved" ? "#eab308" : "#a855f7",
                  color: pet.status === "reserved" ? "#141008" : "#fff",
                }}
              >
                {statusLabel(pet.status)}
              </span>
              <span className="kicker" style={{ marginBottom: 0 }}>{pet.category === "cat" ? "Cat" : pet.category === "bird" ? "Bird" : "Reptile"}</span>
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.375rem" }}>{pet.name}</h1>
            <p style={{ color: "rgba(20,16,8,0.55)", fontSize: "1rem", marginBottom: "1.5rem" }}>
              {[pet.breed, pet.colour].filter(Boolean).join(" · ")}
            </p>

            {pet.price && (
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--color-bronze)", marginBottom: "1.5rem" }}>
                {pet.price}
              </p>
            )}

            {/* Personality tags */}
            {pet.tags && pet.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {pet.tags.map((tag) => <span key={tag} className="pill pill--gold">{tag}</span>)}
              </div>
            )}

            {/* About */}
            {pet.story && (
              <div style={{ marginBottom: "1.75rem" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 400, marginBottom: "0.75rem" }}>About {pet.name}</h2>
                <p style={{ color: "rgba(20,16,8,0.72)", lineHeight: 1.75, fontSize: "0.9375rem" }}>{pet.story}</p>
              </div>
            )}

            {/* Quick facts */}
            <div style={{ borderRadius: 12, border: "1px solid var(--color-line)", padding: "1.25rem", marginBottom: "1.5rem", background: "#fff" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 400, marginBottom: "1rem", color: "rgba(20,16,8,0.55)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Quick Facts
              </h3>
              <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem 1rem" }}>
                {quickFacts.map(([label, value]) => (
                  <div key={label}>
                    <dt style={{ fontSize: "0.75rem", color: "rgba(20,16,8,0.4)", marginBottom: "0.125rem" }}>{label}</dt>
                    <dd style={{ fontSize: "0.9375rem", fontWeight: 600 }}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Health */}
            {pet.health && pet.health.length > 0 && (
              <div style={{ marginBottom: "1.75rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(20,16,8,0.55)", marginBottom: "0.75rem" }}>
                  Health & Certifications
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {pet.health.map((h) => (
                    <span key={h} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.3rem 0.75rem", borderRadius: 50, background: "rgba(34,197,94,0.1)", color: "#166534", fontSize: "0.813rem", fontWeight: 600 }}>
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: "0.9375rem", flex: 1 }}>
                {isAvailable ? `Reserve ${pet.name} on WhatsApp` : "Join the Waitlist"}
              </a>
              {email && (
                <a href={`mailto:${email}?subject=Enquiry about ${pet.name}&body=Hi, I'm interested in ${pet.name} (${pet.breed}).`}
                  className="btn btn-ghost-dark" style={{ fontSize: "0.9375rem" }}>
                  Email
                </a>
              )}
            </div>

            {/* Included */}
            <div style={{ marginTop: "1.75rem", padding: "1.25rem", borderRadius: 12, background: "rgba(19,46,39,0.05)", border: "1px solid rgba(19,46,39,0.1)" }}>
              <p style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.625rem" }}>Every Clawfrican pet includes:</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {["Health records & vet certificate", "Breed-specific care guide", "Starter nutrition pack", "30 days of WhatsApp support", "Nationwide climate-controlled delivery"].map((item) => (
                  <li key={item} style={{ fontSize: "0.875rem", color: "rgba(20,16,8,0.7)", display: "flex", gap: "0.5rem" }}>
                    <span style={{ color: "var(--color-gold-deep)", flexShrink: 0 }}>→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

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
