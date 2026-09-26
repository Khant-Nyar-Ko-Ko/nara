import "dotenv/config";

export interface ApifyCrawlerConfig {
  token: string;
  facebookPostsActorId: string;
  facebookPagesActorId: string;
  resultsLimit: number;
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
