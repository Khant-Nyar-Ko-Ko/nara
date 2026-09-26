export const NEWS_CATEGORIES = [
  "Politics",
  "Economy",
  "Bangkok",
  "Weather",
  "Society",
  "Travel",
  "Health",
  "Sport",
  "Other",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export interface CrawledPost {
  source: string;
  content: string;
  url: string;
  created_at: string | null;
}

export interface DedupedPost extends CrawledPost {
  sources: string[];
}

export interface HeadlinedPost extends DedupedPost {
  headline_en: string;
  headline_th: string;
  headline_mm: string;
  category: NewsCategory;
}
