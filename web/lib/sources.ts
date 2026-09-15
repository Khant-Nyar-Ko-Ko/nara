export interface NewsSource {
  id: string;
  name: string;
  feedUrl: string;
}

// RSS feeds confirmed reachable at implementation time (2026-09).
// Thai PBS was in the original design sketch (01-context-architecture.md)
// but has no discoverable RSS feed — swap it back in if one shows up.
export const NEWS_SOURCES: NewsSource[] = [
  { id: "bangkok-post", name: "Bangkok Post", feedUrl: "https://www.bangkokpost.com/rss/data/topstories.xml" },
  { id: "matichon", name: "Matichon", feedUrl: "https://www.matichon.co.th/feed" },
  { id: "thairath", name: "Thai Rath", feedUrl: "https://www.thairath.co.th/rss/news" },
  { id: "khaosod-english", name: "Khaosod English", feedUrl: "https://www.khaosodenglish.com/feed/" },
  { id: "dailynews", name: "Dailynews", feedUrl: "https://www.dailynews.co.th/feed/" },
];
