import type { Metadata, Viewport } from "next";
import { Bagel_Fat_One, Nunito } from "next/font/google";
import RevealOnScroll from "@/components/RevealOnScroll";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SITE } from "@/content/site";
import "./globals.css";

// Display face for headlines only; Nunito carries everything else.
const display = Bagel_Fat_One({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Nunito({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} · Toys, beds and bowls for dogs and cats`, template: `%s · ${SITE.name}` },
  description: `${SITE.tagline} Opening soon.`,
  openGraph: { siteName: SITE.name, type: "website" },
};

export const viewport: Viewport = { themeColor: "#A7E8B0" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <RevealOnScroll />
      </body>
    </html>
  );
}
