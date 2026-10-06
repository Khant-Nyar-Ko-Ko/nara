import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
