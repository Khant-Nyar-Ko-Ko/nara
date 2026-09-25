import { getGroqConfig, type GroqConfig } from "./config.js";
import type { DedupedPost, HeadlinedPost } from "./types.js";

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

export async function generateHeadlines(
  post: DedupedPost,
  config: GroqConfig = getGroqConfig(),
): Promise<HeadlinedPost> {
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
            },
            required: ["headline_en", "headline_th", "headline_mm"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: "system",
          content:
            "You write professional, natural, straightforward single-line news headlines. Return only valid JSON with headline_en, headline_th, and headline_mm.",
        },
        {
          role: "user",
          content: [
            "Summarize this Facebook post into one English headline, one Thai headline, and one Burmese headline.",
            "Make each headline professional, natural, and straightforward.",
            "Do not add commentary.",
            "",
            post.content,
          ].join("\n"),
        },
      ],
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

  const headlines = parseHeadlineJson(content);

  return {
    ...post,
    headline_en: headlineValue(headlines.headline_en, "headline_en"),
    headline_th: headlineValue(headlines.headline_th, "headline_th"),
    headline_mm: headlineValue(headlines.headline_mm, "headline_mm"),
  };
}

export async function generateHeadlinesForPosts(posts: DedupedPost[]): Promise<HeadlinedPost[]> {
  return Promise.all(posts.map((post) => generateHeadlines(post)));
}
