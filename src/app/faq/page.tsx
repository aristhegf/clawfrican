import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import { sanityFetch } from "@/sanity/lib/fetch";
import { FAQS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Clawfrican — pets, delivery, reservations, and care.",
};

export const revalidate = 3600;

type Faq = { _id: string; question: string; answer: string; category?: string };
type SiteSettings = { whatsapp?: string };

const DEFAULT_FAQS: Faq[] = [
  { _id: "d1", question: "How do I reserve a pet?", answer: "Contact us on WhatsApp using the button above. A reservation holds your chosen pet for 72 hours and is fully refundable if you change your mind.", category: "General" },
  { _id: "d2", question: "Do you deliver outside Lagos?", answer: "Yes! We deliver to all 36 Nigerian states via climate-controlled transport. Lagos typically takes 48 hours after reservation; nationwide is 3–5 business days.", category: "Delivery" },
  { _id: "d3", question: "Do the pets come with health records?", answer: "Every Clawfrican pet comes with a full health record, including vaccination details, deworming history, and a vet certificate where applicable.", category: "General" },
  { _id: "d4", question: "What if I can't find the specific breed I want?", answer: "We offer special orders! If a breed or species isn't currently in-house, we can source it from our trusted breeder network. Reach out on WhatsApp to arrange a special order.", category: "General" },
  { _id: "d5", question: "Are your animals wild-caught?", answer: "Never. All Clawfrican animals are captive-bred by vetted breeders. We do not deal in wild-caught animals under any circumstances.", category: "General" },
  { _id: "d6", question: "What support do I get after buying?", answer: "Every purchase includes 30 days of dedicated WhatsApp support from our team — feeding questions, adjustment tips, and anything else you need to help your pet settle in.", category: "General" },
];

export default async function FaqPage() {
  const [sanityFaqs, settings] = await Promise.all([
    sanityFetch<Faq[]>({ query: FAQS_QUERY, tags: ["faq"], fallback: [] }),
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"], fallback: {} }),
  ]);

  const faqs = sanityFaqs.length > 0 ? sanityFaqs : DEFAULT_FAQS;
  const wa = settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : "#";

  return (
    <div style={{ paddingTop: "5rem" }}>
      <div style={{ background: "var(--color-emerald)", padding: "4rem 1.5rem 3rem", textAlign: "center" }}>
        <span className="kicker kicker--light">COMMON QUESTIONS</span>
        <h1 style={{ color: "var(--color-cream)", fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>Answers before you ask.</h1>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 760, margin: "0 auto" }}>
          <FaqAccordion items={faqs} />

          <div style={{ textAlign: "center", marginTop: "3rem", padding: "2rem", borderRadius: 16, background: "rgba(19,46,39,0.05)", border: "1px solid rgba(19,46,39,0.1)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", marginBottom: "1rem" }}>Still have a question?</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Ask on WhatsApp</a>
              <Link href="/pets" className="btn btn-ghost-dark">Browse Pets</Link>
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
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />
    </div>
  );
}
