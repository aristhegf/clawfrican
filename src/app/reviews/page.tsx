import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { TESTIMONIALS_QUERY } from "@/lib/queries";
import type { SanityImageSource } from "@sanity/image-url";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "What Clawfrican customers say about their pet adoption experience in Lagos, Nigeria.",
};

export const revalidate = 3600;

type Testimonial = { _id: string; name: string; location?: string; quote: string; rating: number; photo?: SanityImageSource };

export default async function ReviewsPage() {
  const testimonials = await sanityFetch<Testimonial[]>({ query: TESTIMONIALS_QUERY, tags: ["testimonial"], fallback: [] });

  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <div className="kicker">Customer Reviews</div>
          <h1>Loved by <em>their humans.</em></h1>
          <p>Every review here comes from someone who welcomed a Clawfrican companion into their home.</p>
        </div>
      </div>

      <section className="sec rev-band" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ paddingTop: 60, paddingBottom: 60 }}>
          {testimonials.length === 0 ? (
            <div className="rev-empty" style={{ color: "rgba(245,245,220,0.5)" }}>No reviews yet — yours could be the first.</div>
          ) : (
            <div className="revs-all">
              {testimonials.map((t) => (
                <div key={t._id} className="rev">
                  <div className="stars">{"★".repeat(Math.round(t.rating || 5))}</div>
                  <p>&ldquo;{t.quote}&rdquo;</p>
                  <div className="who">
                    <div className="av">{t.name?.[0] ?? "C"}</div>
                    <div>
                      <div className="nm">{t.name}</div>
                      {t.location && <div className="lc">{t.location}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
