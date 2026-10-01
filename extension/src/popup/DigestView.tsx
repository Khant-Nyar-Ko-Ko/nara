import type { Headline } from "../types";

interface DigestViewProps {
  headlines: Headline[];
  topics: string[];
  isDemoData: boolean;
  onResetSetup: () => void;
}

// Headlines in the reader's topics first, everything else after (as TopicSetup promises).
// Array.prototype.sort is stable, so each group keeps the API's newest-first order.
function prioritize(headlines: Headline[], topics: string[]): Headline[] {
  const isPriority = (headline: Headline) => (headline.category ? topics.includes(headline.category) : false);
  return [...headlines].sort((a, b) => Number(isPriority(b)) - Number(isPriority(a)));
}

export function DigestView({ headlines, topics, isDemoData, onResetSetup }: DigestViewProps) {
  return (
    <main className="popup-shell">
      <DigestHeader onResetSetup={onResetSetup} />
      <div className="digest-toolbar">
        <span className="toolbar-label">Priority</span>
        {topics.map((topic) => <span className="topic-chip" key={topic}>{topic}</span>)}
      </div>
      {isDemoData && <p className="demo-note">Preview digest · connect the backend for live headlines</p>}
      <section className="digest-list" aria-label="Latest headlines">
        {prioritize(headlines, topics).map((headline) => <HeadlineItem key={headline.id} headline={headline} />)}
      </section>
      <footer className="popup-footer">
        <span>{headlines.length} headlines</span>
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
      <button className="icon-button" type="button" aria-label="Open settings" title="Open settings" onClick={() => void chrome.runtime.openOptionsPage()}>⚙</button>
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
