import { createClient, type SupabaseClient, type WebSocketLikeConstructor } from "@supabase/supabase-js";
import WebSocket from "ws";
import { getSupabaseConfig, type SupabaseConfig } from "./config.js";
import type { DedupedPost, HeadlinedPost, NewsCategory } from "./types.js";

interface NewsInsert {
  headline_en: string;
  headline_th: string;
  headline_mm: string;
  category: NewsCategory;
  content: string;
  url: string;
  date: string | null;
  source: string;
}

const WebSocketTransport = WebSocket as unknown as WebSocketLikeConstructor;

let client: SupabaseClient | null = null;

function getClient(config: SupabaseConfig): SupabaseClient {
  client ??= createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      transport: WebSocketTransport,
    },
  });
  return client;
}

function toNewsInsert(news: HeadlinedPost): NewsInsert {
  return {
    headline_en: news.headline_en,
    headline_th: news.headline_th,
    headline_mm: news.headline_mm,
    category: news.category,
    content: news.content,
    url: news.url,
    date: news.created_at,
    source: news.source,
  };
}

export async function filterUnseenPosts(
  posts: DedupedPost[],
  config: SupabaseConfig = getSupabaseConfig(),
): Promise<DedupedPost[]> {
  if (posts.length === 0) return posts;

  const { data, error } = await getClient(config)
    .from(config.newsTable)
    .select("url")
    .in("url", posts.map((post) => post.url));
  if (error) {
    throw new Error(`Supabase lookup failed: ${error.message}`);
  }

  const seen = new Set((data ?? []).map((row) => row.url as string));
  return posts.filter((post) => !seen.has(post.url));
}

export async function insertNews(
  news: HeadlinedPost[],
  config: SupabaseConfig = getSupabaseConfig(),
): Promise<void> {
  if (news.length === 0) return;

  const { error } = await getClient(config)
    .from(config.newsTable)
    .upsert(news.map(toNewsInsert), { onConflict: "url", ignoreDuplicates: true });
  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }
}
