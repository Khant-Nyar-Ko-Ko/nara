const TOPICS = [
  ["Politics", "การเมือง"],
  ["Economy", "เศรษฐกิจ"],
  ["Bangkok", "กรุงเทพฯ"],
  ["Weather", "สภาพอากาศ"],
  ["Society", "สังคม"],
  ["Travel", "ท่องเที่ยว"],
  ["Health", "สุขภาพ"],
  ["Sport", "กีฬา"],
] as const;

interface TopicSetupProps {
  selectedTopics: string[];
  onToggle: (topic: string) => void;
  onNext: () => void;
}

export function TopicSetup({ selectedTopics, onToggle, onNext }: TopicSetupProps) {
  return (
    <main className="popup-shell setup-shell">
      <SetupHeader />
      <section className="setup-content">
        <p className="setup-intro">Pick the topics you want at the top of every digest. You can change these any time.</p>
        <div className="topic-grid">
          {TOPICS.map(([topic, thai]) => {
            const selected = selectedTopics.includes(topic);
            return (
              <button className={`topic-option${selected ? " selected" : ""}`} type="button" key={topic} onClick={() => onToggle(topic)} aria-pressed={selected}>
                <strong>{topic}</strong>
                <span>{thai}</span>
                {selected && <b aria-hidden="true">✓</b>}
              </button>
            );
          })}
        </div>
        <p className="selection-count">{selectedTopics.length} selected · prioritized first, everything else follows below.</p>
        <button className="primary-button" type="button" disabled={selectedTopics.length === 0} onClick={onNext}>Next: delivery schedule <span aria-hidden="true">›</span></button>
      </section>
      <ProgressIndicator page={1} />
    </main>
  );
}

function SetupHeader() {
  return (
    <header className="popup-header setup-header">
      <div className="brand-mark" aria-hidden="true">N</div>
      <div>
        <h1>Choose your topics</h1>
        <p>Step 1 · Priority categories</p>
      </div>
    </header>
  );
}

function ProgressIndicator({ page }: { page: 1 | 2 }) {
  return <footer className="progress-footer"><span className={page >= 1 ? "active" : ""} /><span className={page >= 2 ? "active" : ""} /><span /><strong>{page}/3</strong></footer>;
}
