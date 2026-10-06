import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Google Search Console ownership check (URL-prefix property, HTML tag method).
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  title: "NaraNews — Thailand news, one clean list",
  description: "Catch up on Thai news with a Chrome extension that brings headlines and one-line summaries into one digest. Explore the interactive NaraNews preview.",
  openGraph: {
    title: "NaraNews — Every Thai headline, one clean list",
    description: "Less scrolling. More catching up. Explore the NaraNews Chrome extension preview.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
