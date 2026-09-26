import { useState } from "react";

interface DeliverySetupProps {
  digestTimes: string[];
  emailFallback: boolean;
  notifyWhenIdle: boolean;
  quietHours: boolean;
  onEmailFallbackChange: (value: boolean) => void;
  onNotifyWhenIdleChange: (value: boolean) => void;
  onQuietHoursChange: (value: boolean) => void;
  onAddTime: (time: string) => void;
  onRemoveTime: (time: string) => void;
  onBack: () => void;
  onSave: () => void;
}

export function DeliverySetup({
  digestTimes,
  emailFallback,
  notifyWhenIdle,
  quietHours,
  onEmailFallbackChange,
  onNotifyWhenIdleChange,
  onQuietHoursChange,
  onAddTime,
  onRemoveTime,
  onBack,
  onSave,
}: DeliverySetupProps) {
  return (
    <main className="popup-shell setup-shell">
      <SetupHeader onBack={onBack} />
      <section className="setup-content delivery-content">
        <p className="section-kicker">◷ &nbsp; DIGEST TIMES</p>
        <TimeEntry onAddTime={onAddTime} />
        <div className="time-chips" aria-label="Scheduled digest times">
          {digestTimes.map((time) => (
            <button type="button" key={time} onClick={() => onRemoveTime(time)} aria-label={`Remove ${formatTime(time)}`}>
              {formatTime(time)} ×
            </button>
          ))}
        </div>
        <p className="quick-add">Quick add: <button type="button" onClick={() => onAddTime("12:30")}>+12:30</button> <button type="button" onClick={() => onAddTime("21:30")}>+21:30</button></p>
        <ToggleRow label="Email when away from Chrome" detail="You'll confirm your address and consent in Settings" checked={emailFallback} onChange={onEmailFallbackChange} />
        <ToggleRow label="Notify when Chrome is idle" detail="One notification for the newest headline" checked={notifyWhenIdle} onChange={onNotifyWhenIdleChange} />
        <ToggleRow label="Quiet hours 22:00 – 06:30" detail="Nothing is delivered overnight" checked={quietHours} onChange={onQuietHoursChange} />
        <button className="primary-button" type="button" onClick={onSave}>Save and open my digest <span aria-hidden="true">›</span></button>
      </section>
      <ProgressIndicator page={2} />
    </main>
  );
}

function TimeEntry({ onAddTime }: { onAddTime: (time: string) => void }) {
  const [time, setTime] = useState("08:30");

  return (
    <div className="time-entry">
      <input type="time" value={time} onChange={(event) => setTime(event.target.value)} aria-label="New digest time" />
      <button type="button" aria-label="Add digest time" onClick={() => onAddTime(time)}>＋</button>
    </div>
  );
}

function SetupHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="popup-header setup-header">
      <button className="back-button" type="button" onClick={onBack} aria-label="Back">←</button>
      <div>
        <h1>Delivery schedule</h1>
        <p>Step 2 · When digests arrive</p>
      </div>
    </header>
  );
}

function ToggleRow({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="toggle-row"><span><strong>{label}</strong><small>{detail}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i aria-hidden="true" /></label>;
}

function ProgressIndicator({ page }: { page: 1 | 2 }) {
  return <footer className="progress-footer"><span className={page >= 1 ? "active" : ""} /><span className={page >= 2 ? "active" : ""} /><span /><strong>{page}/3</strong></footer>;
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}
