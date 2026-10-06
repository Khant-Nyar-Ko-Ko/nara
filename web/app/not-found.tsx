import Link from "next/link";
import { SiteNav } from "./site-nav";

export const metadata = { title: "Page not found — NaraNews" };

export default function NotFound() {
  return <><SiteNav /><main className="container app-content prose"><p className="eyebrow">404</p><h1>This page isn’t here</h1><p>The link may be old or mistyped. Today’s headlines are one click away.</p><div className="page-actions"><Link className="primary-button" href="/digest">Read the live digest</Link><Link className="text-link" href="/">Back to home →</Link></div></main></>;
}
