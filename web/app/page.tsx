import Link from "next/link";
import { LandingDemo, DigestPreview } from "./landing-demo";
import { HeroLive } from "./hero-live";

export default function HomePage() {
  return (
    <main id="top">
      <a className="skip-link" href="#preview">Skip to preview</a>
      <header className="hero">
        <div className="container">
          <nav aria-label="Main navigation"><a className="brand" href="#top"><span className="brand-mark">N</span>NaraNews</a><Link className="nav-link" href="/settings">Sign in / Email settings <span aria-hidden="true">↗</span></Link></nav>
          <div className="hero-grid"><div className="hero-copy"><p className="eyebrow">THAILAND NEWS, WITHOUT THE TAB OVERLOAD</p><h1>Every Thai headline,<br />one clean list.</h1><p>A Chrome extension that gathers headlines from Thailand’s news sources into one digest. Scan a one-line summary, then jump straight to the source.</p>
            <div className="hero-actions"><Link className="primary-button" href="/digest">Read the live digest →</Link><Link href="/install">Get the Chrome extension ↗</Link></div><div className="feature-tags"><span>Aggregated feed</span><span>One-line summaries</span><span>Email fallback</span><span>Built for Chrome</span></div>
          </div>
          <HeroLive /></div>
        </div>
      </header>
      <div className="container showcases">
        <section className="showcase" id="preview" aria-labelledby="setup-title"><div className="section-copy"><p className="eyebrow">INTERACTIVE PREVIEW</p><h2 id="setup-title">Setup to digest</h2><p>Pick the topics you want to see first, explore delivery preferences, and open your digest. Try the preview to see how it fits into your day.</p><p className="fine-print">A hands-on demo. Your choices stay on this page; no account or email address is needed.</p></div><LandingDemo /></section>
        <section className="showcase" aria-labelledby="popup-title"><div className="section-copy"><p className="eyebrow">IN CHROME</p><h2 id="popup-title">The popup digest</h2><p>A little less searching. A little more knowing. Open the toolbar popup for a scrollable list of headlines and one-line summaries, with a link back to every source.</p><a className="text-link" href="#preview">Try the setup above <span aria-hidden="true">↑</span></a></div><div><DigestPreview /><Link className="text-link" href="/digest">Open the live digest →</Link></div></section>
        <section className="showcase" aria-labelledby="email-title"><div className="section-copy"><p className="eyebrow">AWAY FROM YOUR DESK</p><h2 id="email-title">Your digest, by email</h2><p>When Chrome detects that you’re idle or your screen is locked, the extension can request an email digest. Sign in with an emailed code and choose to turn it on in Settings.</p><Link className="text-link" href="/settings">Sign in and manage email delivery →</Link><p className="fine-print">Email delivery currently requires Chrome to be running. Scheduled delivery is still in development.</p></div><div className="preview-card email-card"><div className="email-sender"><span className="mail-icon" aria-hidden="true">✉</span><div><strong>NaraNews Digest</strong><small>Email preview · sample content</small></div></div><div className="email-body"><p className="eyebrow">A LITTLE NEWS. A CLEARER DAY.</p><h3>Your Thailand digest</h3><p>The stories you can catch up on, one line at a time.</p><div className="email-story"><small>THAILAND · POLITICS</small><h4>The latest from Thai politics</h4><p>A short summary helps you decide what to read next.</p></div><div className="email-story"><small>THAILAND · ECONOMY</small><h4>Business and economy, at a glance</h4><p>Scan the key points, then visit the original source.</p></div><div className="email-story"><small>THAILAND · BANGKOK</small><h4>Stay in the loop with city news</h4><p>Your daily catch-up, without opening a dozen tabs.</p></div></div><div className="card-footer">Email digest is opt-in. You can turn it off in extension Settings.</div></div></section>
        <section className="showcase" aria-labelledby="notification-title"><div className="section-copy"><p className="eyebrow">ON THE HORIZON</p><h2 id="notification-title">A gentle heads-up</h2><p>Chrome notifications and quiet hours are planned for a future release. For now, catch up in the popup or opt in to email while you’re away.</p></div><div className="preview-card notification-card"><span className="badge">Coming soon</span><div className="notification-content"><span className="brand-mark">N</span><div><small>NaraNews · Chrome notification preview</small><h3>A new story, when you have a moment.</h3><p>A quiet nudge to help you catch up.</p></div></div></div></section>
        <section className="closing"><span className="brand-mark">N</span><h2>Less scrolling. More catching up.</h2><p>Get a feel for your next news habit.</p><Link className="primary-button" href="/digest">Read the live digest <span aria-hidden="true">→</span></Link></section>
      </div>
      <footer className="site-footer"><div className="container"><a className="brand" href="#top">NaraNews</a><p>Thailand news digest for Chrome · Project preview</p><nav className="footer-links" aria-label="Footer"><Link href="/privacy">Privacy notice</Link><Link href="/install">Get the extension</Link></nav></div></footer>
    </main>
  );
}
