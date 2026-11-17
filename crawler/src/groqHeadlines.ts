import { getGroqConfig, type GroqConfig } from "./config.js";
import { NEWS_CATEGORIES, type DedupedPost, type HeadlinedPost, type NewsCategory } from "./types.js";

interface GroqChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface GroqHeadlineResponse {
  headline_en?: unknown;
  headline_th?: unknown;
  headline_mm?: unknown;
  category?: unknown;
}

// The popup shows the Thai headline at 360 px wide in 15 px bold Arial. Measured on
// 50 live headlines (2026-11-17): up to 47 characters fit one line, 49+ wrapped.
// Ask for 40 to leave a margin; anything over 45 gets one stricter retry.
export const THAI_HEADLINE_TARGET_CHARS = 40;
export const THAI_HEADLINE_MAX_CHARS = 45;

// Counts code points, so Thai vowel and tone marks count as characters,
// the same way the popup measurement counted them.
export function headlineLength(text: string): number {
  return [...text].length;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function categoryValue(value: unknown): NewsCategory {
  return NEWS_CATEGORIES.find((category) => category === value) ?? "Other";
}

function parseHeadlineJson(content: string): GroqHeadlineResponse {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return JSON.parse(fenced?.[1] ?? trimmed) as GroqHeadlineResponse;
}

function headlineValue(value: unknown, name: string): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  throw new Error(`Groq response missing ${name}`);
}

async function requestHeadlines(messages: ChatMessage[], config: GroqConfig): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      reasoning_effort: "low",
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "facebook_post_headlines",
          strict: true,
          schema: {
            type: "object",
            properties: {
              headline_en: { type: "string" },
              headline_th: { type: "string" },
              headline_mm: { type: "string" },
              category: { type: "string", enum: [...NEWS_CATEGORIES] },
            },
            required: ["headline_en", "headline_th", "headline_mm", "category"],
            additionalProperties: false,
          },
        },
      },
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API failed: HTTP ${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as GroqChatResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq API returned no message content");
  }

  return content;
}

function toHeadlinedPost(post: DedupedPost, content: string): HeadlinedPost {
  const headlines = parseHeadlineJson(content);

  return {
    ...post,
    headline_en: headlineValue(headlines.headline_en, "headline_en"),
    headline_th: headlineValue(headlines.headline_th, "headline_th"),
    headline_mm: headlineValue(headlines.headline_mm, "headline_mm"),
    category: categoryValue(headlines.category),
  };
}

export async function generateHeadlines(
  post: DedupedPost,
  config: GroqConfig = getGroqConfig(),
): Promise<HeadlinedPost> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You write professional, natural, straightforward single-line news headlines. Return only valid JSON with headline_en, headline_th, headline_mm, and category.",
    },
    {
      role: "user",
      content: [
        "Summarize this Facebook post into one English headline, one Thai headline, and one Burmese headline.",
        "Make each headline professional, natural, and straightforward.",
        `The Thai headline must be at most ${THAI_HEADLINE_TARGET_CHARS} characters so it fits on one line in a narrow popup: keep only the main fact, drop extra detail.`,
        `Pick the single best category from: ${NEWS_CATEGORIES.join(", ")}. Use "Other" if none fit.`,
        "Do not add commentary.",
        "",
        post.content,
      ].join("\n"),
    },
  ];

  const firstContent = await requestHeadlines(messages, config);
  const first = toHeadlinedPost(post, firstContent);
  const firstLength = headlineLength(first.headline_th);
  if (firstLength <= THAI_HEADLINE_MAX_CHARS) return first;

  const retryContent = await requestHeadlines(
    [
      ...messages,
      { role: "assistant", content: firstContent },
      {
        role: "user",
        content: `headline_th has ${firstLength} characters. Rewrite it in at most ${THAI_HEADLINE_TARGET_CHARS} characters, keeping only the main fact. Return the same JSON with all four fields.`,
      },
    ],
    config,
  );
  const retry = toHeadlinedPost(post, retryContent);
  const retryLength = headlineLength(retry.headline_th);
  if (retryLength > THAI_HEADLINE_MAX_CHARS) {
    console.warn(`crawler: Thai headline still ${retryLength} characters after retry for ${post.url}`);
  }

  return retryLength <= firstLength ? retry : first;
}

export async function generateHeadlinesForPosts(posts: DedupedPost[]): Promise<HeadlinedPost[]> {
  const results = await Promise.allSettled(posts.map((post) => generateHeadlines(post)));

  return results.flatMap((result, index) => {
    if (result.status === "fulfilled") return [result.value];

    const reason = result.reason instanceof Error ? result.reason.message : result.reason;
    console.error(`crawler: headline generation failed for ${posts[index].url}`, reason);
    return [];
  });
}
