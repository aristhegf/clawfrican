import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ABOUT_QUERY, SITE_SETTINGS_QUERY } from "@/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Clawfrican — a Nigerian Exotic Pet Cafe built on a love of extraordinary animals.",
};

export const revalidate = 3600;

type AboutData = { headline?: string; story?: string; portrait?: SanityImageSource; signature?: string };
type SiteSettings = { whatsapp?: string };

export default async function AboutPage() {
  const [about] = await Promise.all([
    sanityFetch<AboutData>({ query: ABOUT_QUERY, tags: ["aboutPage"], fallback: {} }),
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"], fallback: {} }),
  ]);

  const portraitUrl = about?.portrait ? urlFor(about.portrait).width(600).height(750).url() : null;
  const signature = about?.signature || "Aris";
  const storyParas = about?.story
    ? about.story.split("\n").filter(Boolean)
    : [
        "Clawfrican began with one conviction: how it started, the first animal that stole my heart, and why I decided Nigeria deserved a different kind of exotic pet experience.",
        "Every animal in our care is hand-raised, health-certified and socialised before they meet their forever family — and every client is supported long after they take one home.",
      ];

  return (
    <>
      <div className="about-head">
        <div className="wrap">
          <div className="kicker">Our Story</div>
          <h1>{about?.headline || <>The person behind <em>the paws.</em></>}</h1>
        </div>
      </div>

      <div className="wrap">
        <div className="about-grid">
          <div className="about-portrait">
            <div className="frame">
              <div className="frame-inner">
                {portraitUrl ? (
                  <Image src={portraitUrl} alt="Founder" fill className="object-cover" sizes="(max-width:900px) 100vw, 420px" />
                ) : (
                  <span className="sil">A.</span>
                )}
              </div>
            </div>
            <div className="cap">Founder, Clawfrican</div>
          </div>

          <div className="about-story">
            <p className="lead">Clawfrican began with one conviction: that the extraordinary deserves to be treated <em>extraordinarily.</em></p>
            <div>
              {storyParas.map((para, i) => <p key={i}>{para}</p>)}
            </div>
            <div className="about-quote">&ldquo;Every animal that leaves us is already loved before it arrives to you.&rdquo;</div>
            <div className="about-sign">
              <div className="name">{signature}</div>
              <div className="role">Founder · Clawfrican</div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-cta">
        <Link href="/pets" className="btn btn-dark">Meet the companions <span className="arr">→</span></Link>
      </div>
    </>
  );
}
