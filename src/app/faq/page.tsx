import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import { sanityFetch } from "@/sanity/lib/fetch";
import { FAQS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Clawfrican — pets, delivery, reservations, care, payments, and ethics.",
};

export const revalidate = 3600;

type Faq = { _id: string; question: string; answer: string; category?: string };

// Full built-in FAQ set (used until FAQs exist in Sanity), grouped by category — matches v10.
const FAQ_GROUPS: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: "About Our Pets",
    items: [
      { q: "Are all your pets healthy?", a: "Every pet undergoes a health assessment before becoming available. We only list pets that meet our health standards, and relevant health records are provided where applicable." },
      { q: "Are your pets vaccinated?", a: "Vaccination depends on the species and age. Any vaccinations or veterinary care received will be clearly stated on each pet's profile." },
      { q: "Are your pets tame?", a: "Many of our birds and companion animals are hand-raised or well-socialized. Each listing describes the individual pet's temperament." },
      { q: "Can I meet a pet before buying?", a: "Yes. Depending on your location and the pet, viewings may be arranged by appointment." },
      { q: "Are the photos of the actual pet?", a: "Yes. We photograph the individual animal whenever possible, so the pet you see is the pet you're enquiring about." },
    ],
  },
  {
    category: "Reservations & Availability",
    items: [
      { q: "How do I reserve a pet?", a: "Simply message us on WhatsApp through the website. We'll confirm availability and guide you through the reservation process." },
      { q: "How long can you hold a pet?", a: "Reservation periods depend on the pet and circumstances. We'll discuss the available holding period before confirming your reservation." },
      { q: "What happens if a pet is marked as Reserved?", a: "A reserved pet is temporarily unavailable while another customer completes the process. If the reservation falls through, it may become available again." },
      { q: "Can I join a waiting list?", a: "Yes. If your preferred breed or species isn't currently available, we can notify you when new arrivals come in." },
    ],
  },
  {
    category: "Delivery",
    items: [
      { q: "Do you deliver nationwide?", a: "Yes. We arrange safe transportation across Nigeria." },
      { q: "Do you deliver outside Lagos?", a: "Absolutely. We coordinate deliveries to customers throughout Nigeria." },
      { q: "Can you deliver internationally?", a: "International exports may be available depending on the destination country's regulations. Contact us to discuss your location." },
      { q: "How is my pet transported?", a: "We prioritize the animal's welfare by using suitable travel arrangements designed to minimize stress during transit." },
    ],
  },
  {
    category: "Care",
    items: [
      { q: "Will I receive care instructions?", a: "Yes. We provide guidance to help you care for your new companion." },
      { q: "I'm a first-time owner. Can you help?", a: "Absolutely. We're happy to advise you before and after you bring your pet home." },
      { q: "Can I contact you after adoption?", a: "Yes. We offer ongoing support if you have questions about feeding, behaviour, or general care." },
    ],
  },
  {
    category: "Payments",
    items: [
      { q: "Do I pay through the website?", a: "Not yet. All enquiries and purchases are currently handled directly through WhatsApp." },
      { q: "Which payment methods do you accept?", a: "We'll provide payment details during your conversation once everything has been confirmed." },
      { q: "Can I pay in installments?", a: "This depends on the pet and the circumstances. Feel free to ask us about available options." },
    ],
  },
  {
    category: "Trust & Ethics",
    items: [
      { q: "Where do your pets come from?", a: "We work with trusted breeders and partners who share our commitment to responsible breeding and animal welfare." },
      { q: "Do you sell wild-caught animals?", a: "No. We do not support the illegal wildlife trade." },
      { q: "How do I know I'm buying from a legitimate business?", a: "We're committed to transparency. We'll answer your questions, provide relevant information about the pet, and guide you through every step of the process." },
    ],
  },
  {
    category: "Before Buying",
    items: [
      { q: "Which pet is best for beginners?", a: "That depends on your lifestyle, available space, experience, and the time you can dedicate. We'll help you choose the right companion." },
      { q: "Can I buy a pet as a gift?", a: "Yes, but we encourage making sure the recipient is prepared for the responsibility of caring for the animal." },
      { q: "Do you sell pet supplies as well?", a: "We're expanding our offerings over time. Contact us to find out what's currently available." },
      { q: "What if I change my mind after reserving a pet?", a: "Reservation and cancellation terms will be explained before any payment is made." },
      { q: "How often do you get new arrivals?", a: "New pets become available regularly, but availability varies by species and breed. Follow us on social media or contact us to stay updated." },
    ],
  },
];

type Group = { category: string; items: Faq[] };

function toGroups(sanityFaqs: Faq[]): Group[] {
  if (sanityFaqs.length === 0) {
    return FAQ_GROUPS.map((g) => ({
      category: g.category,
      items: g.items.map((it, i) => ({ _id: `${g.category}-${i}`, question: it.q, answer: it.a, category: g.category })),
    }));
  }
  // Group Sanity FAQs by their category field, preserving first-seen order.
  const order: string[] = [];
  const map = new Map<string, Faq[]>();
  for (const f of sanityFaqs) {
    const cat = f.category || "General";
    if (!map.has(cat)) { map.set(cat, []); order.push(cat); }
    map.get(cat)!.push(f);
  }
  return order.map((cat) => ({ category: cat, items: map.get(cat)! }));
}

export default async function FaqPage() {
  const [sanityFaqs, settings] = await Promise.all([
    sanityFetch<Faq[]>({ query: FAQS_QUERY, tags: ["faq"], fallback: [] }),
    sanityFetch<{ whatsapp?: string }>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"], fallback: {} }),
  ]);

  const groups = toGroups(sanityFaqs);
  const wa = settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : "#";
  const allItems = groups.flatMap((g) => g.items);

  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <div className="kicker">FAQ</div>
          <h1>Questions, <em>answered.</em></h1>
          <p>Everything you might want to know before welcoming a Clawfrican companion home.</p>
        </div>
      </div>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="faq-wrap">
            {groups.map((g) => (
              <div key={g.category} className="faq-cat">
                <h4>{g.category}</h4>
                <FaqAccordion items={g.items} />
              </div>
            ))}

            <div style={{ textAlign: "center", background: "#fff", border: "1px solid var(--color-line)", borderRadius: 18, padding: "36px 26px", marginTop: 24 }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", marginBottom: 10 }}>Still have a question?</h4>
              <p style={{ fontSize: "0.92rem", color: "rgba(20,16,8,0.6)", maxWidth: "44ch", margin: "0 auto 22px", lineHeight: 1.6 }}>
                Tayo, our AI consultant, or our team on WhatsApp are happy to help.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Ask on WhatsApp</a>
                <Link href="/pets" className="btn btn-ghost">Browse Pets</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: allItems.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />
    </>
  );
}
