import { crawlOneNewsPerSource } from "./apifyFacebookCrawler.js";
import { filterPostsAfterCutoff, newestCreatedAt, readCrawlState, writeCrawlState } from "./crawlState.js";
import { dedupePostsByUrl } from "./dedupe.js";
import { generateHeadlinesForPosts } from "./groqHeadlines.js";
import { insertNews } from "./supabaseNews.js";

const crawlState = await readCrawlState();
const posts = await crawlOneNewsPerSource();
const newPosts = filterPostsAfterCutoff(posts, crawlState.last_crawled_at);
const dedupedPosts = dedupePostsByUrl(newPosts);
const news = await generateHeadlinesForPosts(dedupedPosts);
const latestCreatedAt = newestCreatedAt(dedupedPosts);

await insertNews(news);

if (latestCreatedAt) {
  await writeCrawlState(latestCreatedAt);
}

console.log(JSON.stringify(news, null, 2));
