import Link from "next/link";

export function SiteNav() {
  return <header className="app-nav"><div className="container"><Link className="brand" href="/"><span className="brand-mark">N</span>NaraNews</Link><nav aria-label="Main navigation"><Link href="/digest">Live digest</Link><Link href="/settings">Email settings</Link><Link href="/install">Get the extension</Link></nav></div></header>;
}
