import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import { sanityFetch } from "@/sanity/lib/fetch";
import { FAQS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import { getFaqGroups, type Faq } from "@/lib/faqs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Clawfrican — pets, delivery, reservations, care, payments, and ethics.",
};

export const revalidate = 3600;

export default async function FaqPage() {
  const [sanityFaqs, settings] = await Promise.all([
    sanityFetch<Faq[]>({ query: FAQS_QUERY, tags: ["faq"], fallback: [] }),
    sanityFetch<{ whatsapp?: string }>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"], fallback: {} }),
  ]);

  const groups = getFaqGroups(sanityFaqs);
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
