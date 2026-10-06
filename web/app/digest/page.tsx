import { SiteNav } from "../site-nav";
import { LiveDigest } from "./live-digest";
export const metadata = { title: "Live digest — NaraNews" };
export default function DigestPage() {
  return <><SiteNav /><main className="container app-content"><p className="eyebrow">YOUR THAILAND CATCH-UP</p><h1>Today’s headlines</h1><p>Live headlines from our news feed. Choose a language and the topics to show first.</p><LiveDigest /></main></>;
}
