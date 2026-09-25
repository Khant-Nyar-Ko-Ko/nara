import { createClient, type WebSocketLikeConstructor } from "@supabase/supabase-js";
import WebSocket from "ws";
import { getSupabaseConfig, type SupabaseConfig } from "./config.js";
import type { HeadlinedPost } from "./types.js";

interface NewsInsert {
  headline_en: string;
  headline_th: string;
  headline_mm: string;
  content: string;
  date: string | null;
  source: string;
}

const WebSocketTransport = WebSocket as unknown as WebSocketLikeConstructor;

function toNewsInsert(news: HeadlinedPost): NewsInsert {
  return {
    headline_en: news.headline_en,
    headline_th: news.headline_th,
    headline_mm: news.headline_mm,
    content: news.content,
    date: news.created_at,
    source: news.source,
  };
}

export async function insertNews(
  news: HeadlinedPost[],
  config: SupabaseConfig = getSupabaseConfig(),
): Promise<void> {
  if (news.length === 0) return;

  const supabase = createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      transport: WebSocketTransport,
    },
  });

  const { error } = await supabase.from(config.newsTable).insert(news.map(toNewsInsert));
  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }
}
