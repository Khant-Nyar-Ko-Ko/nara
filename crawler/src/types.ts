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
}
