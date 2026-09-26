// Coordinates setup state and digest loading. Screen-specific UI lives in
// TopicSetup, DeliverySetup, and DigestView.

import { useEffect, useState } from "react";
import { fetchDigest } from "../lib/api";
import { readCachedDigest, writeCachedDigest } from "../lib/digestCache";
import type { Headline } from "../types";
import { DeliverySetup } from "./DeliverySetup";
import { DigestView, EmptyState } from "./DigestView";
import { MOCK_HEADLINES } from "./mockHeadlines";
import { TopicSetup } from "./TopicSetup";
import "./Popup.css";

type Status = "loading" | "ready" | "error";
type SetupPage = 1 | 2;

const SETUP_COMPLETE_KEY = "naranews.setupComplete";
const TOPICS_KEY = "naranews.topics";
const DIGEST_TIMES_KEY = "naranews.digestTimes";
const DEFAULT_TOPICS = ["Politics", "Economy", "Bangkok"];
const DEFAULT_DIGEST_TIMES = ["07:00", "18:00"];

export function Popup() {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [isDemoData, setIsDemoData] = useState(false);
  const [setupPage, setSetupPage] = useState<SetupPage | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(DEFAULT_TOPICS);
  const [digestTimes, setDigestTimes] = useState<string[]>(DEFAULT_DIGEST_TIMES);
  const [emailFallback, setEmailFallback] = useState(true);
  const [notifyWhenIdle, setNotifyWhenIdle] = useState(true);
  const [quietHours, setQuietHours] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const setup = await chrome.storage.local.get([SETUP_COMPLETE_KEY, TOPICS_KEY, DIGEST_TIMES_KEY]);
      if (!setup[SETUP_COMPLETE_KEY]) {
        if (!cancelled) {
          const savedTopics = setup[TOPICS_KEY];
          const savedTimes = setup[DIGEST_TIMES_KEY];
          setSelectedTopics(Array.isArray(savedTopics) ? savedTopics : DEFAULT_TOPICS);
          setDigestTimes(Array.isArray(savedTimes) ? savedTimes : DEFAULT_DIGEST_TIMES);
          setSetupPage(1);
        }
        return;
      }

      const cached = await readCachedDigest();
      if (cached && !cancelled) {
        setHeadlines(cached.headlines);
        setStatus("ready");
      }

      try {
        const fresh = await fetchDigest();
        if (cancelled) return;
        setHeadlines(fresh);
        setStatus("ready");
        void writeCachedDigest(fresh);
      } catch (err) {
        console.error("naranews: popup digest fetch failed", err);
        if (!cancelled && !cached) {
          setHeadlines(MOCK_HEADLINES);
          setIsDemoData(true);
          setStatus("ready");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function toggleTopic(topic: string) {
    setSelectedTopics((current) => current.includes(topic)
      ? current.filter((item) => item !== topic)
      : [...current, topic]);
  }

  function addDigestTime(time: string) {
    if (time && !digestTimes.includes(time)) {
      setDigestTimes((current) => [...current, time].sort());
    }
  }

  function removeDigestTime(time: string) {
    setDigestTimes((current) => current.filter((item) => item !== time));
  }

  async function completeSetup() {
    await chrome.storage.local.set({
      [SETUP_COMPLETE_KEY]: true,
      [TOPICS_KEY]: selectedTopics,
      [DIGEST_TIMES_KEY]: digestTimes,
    });
    window.location.reload();
  }

  async function resetSetup() {
    await chrome.storage.local.remove(SETUP_COMPLETE_KEY);
    window.location.reload();
  }

  if (setupPage === 1) {
    return <TopicSetup selectedTopics={selectedTopics} onToggle={toggleTopic} onNext={() => setSetupPage(2)} />;
  }

  if (setupPage === 2) {
    return (
      <DeliverySetup
        digestTimes={digestTimes}
        emailFallback={emailFallback}
        notifyWhenIdle={notifyWhenIdle}
        quietHours={quietHours}
        onEmailFallbackChange={setEmailFallback}
        onNotifyWhenIdleChange={setNotifyWhenIdle}
        onQuietHoursChange={setQuietHours}
        onAddTime={addDigestTime}
        onRemoveTime={removeDigestTime}
        onBack={() => setSetupPage(1)}
        onSave={() => void completeSetup()}
      />
    );
  }

  if (status === "loading") {
    return (
      <main className="popup-shell" aria-busy="true">
        <section className="state-panel" aria-live="polite">
          <span className="loader" aria-hidden="true" />
          <p>Refreshing your digest...</p>
        </section>
      </main>
    );
  }

  if (status === "error") return <main className="popup-shell"><EmptyState message="Couldn't load headlines. Try again later." /></main>;
  if (headlines.length === 0) return <main className="popup-shell"><EmptyState message="No headlines right now." /></main>;

  return <DigestView headlines={headlines} isDemoData={isDemoData} onResetSetup={() => void resetSetup()} />;
}
