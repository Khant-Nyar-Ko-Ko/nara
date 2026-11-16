import "dotenv/config";

export interface ApifyCrawlerConfig {
  token: string;
  facebookPostsActorId: string;
  facebookPagesActorId: string;
  resultsLimit: number;
  // Memory per Actor run. All sources start at once, and Apify's free plan caps
  // the total at 16 GB; the Actor's 4 GB default let only 4 of 5 sources start.
  actorMemoryMbytes: number;
}

export interface GroqConfig {
  apiKey: string;
  model: string;
}

export interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
  newsTable: string;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function numberEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive number`);
  }

  return parsed;
}

export function getApifyCrawlerConfig(): ApifyCrawlerConfig {
  return {
    token: requiredEnv("APIFY_TOKEN"),
    facebookPostsActorId:
      process.env.APIFY_FACEBOOK_POSTS_ACTOR_ID ??
      process.env.APIFY_FACEBOOK_ACTOR_ID ??
      "apify/facebook-posts-scraper",
    facebookPagesActorId: process.env.APIFY_FACEBOOK_PAGES_ACTOR_ID ?? "apify/facebook-pages-scraper",
    resultsLimit: numberEnv("APIFY_FACEBOOK_RESULTS_LIMIT", 1),
    actorMemoryMbytes: numberEnv("APIFY_ACTOR_MEMORY_MB", 1024),
  };
}

export function getGroqConfig(): GroqConfig {
  return {
    apiKey: requiredEnv("GROQ_API_KEY"),
    model: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
  };
}

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: requiredEnv("SUPABASE_URL"),
    serviceRoleKey: requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    newsTable: process.env.SUPABASE_NEWS_TABLE ?? "news",
  };
}
