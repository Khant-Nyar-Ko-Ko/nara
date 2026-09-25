import type { Headline } from "../types";

interface DigestViewProps {
  headlines: Headline[];
  isDemoData: boolean;
  onResetSetup: () => void;
}

export function DigestView({ headlines, isDemoData, onResetSetup }: DigestViewProps) {
  return (
    <main className="popup-shell">
      <DigestHeader onResetSetup={onResetSetup} />
      <div className="digest-toolbar">
        <span className="toolbar-label">Priority</span>
        <span className="topic-chip">Politics</span>
        <span className="topic-chip">Economy</span>
        <span className="topic-chip">Bangkok</span>
        <span className="topic-chip">Weather</span>
      </div>
      {isDemoData && <p className="demo-note">Preview digest · connect the backend for live headlines</p>}
      <section className="digest-list" aria-label="Latest headlines">
        {headlines.map((headline) => <HeadlineItem key={headline.id} headline={headline} />)}
      </section>
      <footer className="popup-footer">
        <span>5 Thai sources · email fallback on</span>
        <button type="button" onClick={onResetSetup}>Edit topics</button>
      </footer>
    </main>
  );
}

function DigestHeader({ onResetSetup }: { onResetSetup: () => void }) {
  return (
    <header className="popup-header">
      <div className="brand-mark" aria-hidden="true">N</div>
      <div>
        <h1>NaraNews</h1>
        <p>Thai headline digest</p>
      </div>
      <button className="icon-button" type="button" aria-label="Reset setup" title="Reset setup" onClick={onResetSetup}>↻</button>
      <a className="icon-button" href="options/index.html" aria-label="Open settings" title="Open settings">⚙</a>
    </header>
  );
}

function HeadlineItem({ headline }: { headline: Headline }) {
  return (
    <article className="headline-item">
      <a className="headline-link" href={headline.url} target="_blank" rel="noopener noreferrer">
        <div className="headline-meta">
          <span className="source-name"><span className="source-dot" aria-hidden="true" />{headline.source}</span>
          {headline.category && <><span className="meta-divider">/</span><span>{headline.category}</span></>}
          <time dateTime={headline.fetchedAt}>{formatAge(headline.fetchedAt)}</time>
        </div>
        <h2>{headline.summary}</h2>
        <p>Read the latest details from {headline.source}</p>
      </a>
    </article>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <section className="state-panel"><p>{message}</p></section>;
}

function formatAge(fetchedAt: string) {
  const timestamp = new Date(fetchedAt).getTime();
  if (Number.isNaN(timestamp)) return "Recently";
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  return minutes < 60 ? `${minutes}m ago` : `${Math.round(minutes / 60)}h ago`;
}
