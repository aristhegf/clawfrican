import type { Metadata } from "next";
import { Fraunces, Josefin_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TayoChat from "@/components/TayoChat";
import ScrollReveal from "@/components/ScrollReveal";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/lib/queries";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const bernardo = localFont({
  src: "../fonts/bernardo-moda.woff2",
  variable: "--font-bernardo",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Clawfrican — Premium Cats, Birds & Reptiles in Lagos", template: "%s | Clawfrican" },
  description: "Hand-raised cats, birds, and reptiles from trusted breeders. Health certified, ethically sourced, nationwide delivery across Nigeria.",
  keywords: ["pets Lagos", "cats for sale Nigeria", "birds for sale Lagos", "reptiles Nigeria", "exotic pets Nigeria", "Persian cats Lagos"],
  openGraph: {
    siteName: "Clawfrican",
    type: "website",
    locale: "en_NG",
    url: "https://clawfrican.com",
  },
  twitter: { card: "summary_large_image" },
  metadataBase: new URL("https://clawfrican.com"),
};

type SiteSettings = {
  whatsapp?: string;
  email?: string;
  instagram?: string;
  tiktok?: string;
  address?: string;
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await sanityFetch<SiteSettings>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
    fallback: {},
  });

  const wa = settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : "https://wa.me/2349000000000";

  return (
    <html lang="en" className={`${fraunces.variable} ${josefin.variable} ${bernardo.variable}`}>
      <body>
        <Nav wa={wa} />
        <main>{children}</main>
        <Footer settings={settings} />
        <TayoChat wa={wa} />
        <ScrollReveal />
      </body>
    </html>
  );
}
