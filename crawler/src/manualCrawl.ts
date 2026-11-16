import { crawlLatestNews } from "./apifyFacebookCrawler.js";
import { dedupePostsByUrl } from "./dedupe.js";
import { generateHeadlinesForPosts } from "./groqHeadlines.js";
import { filterUnseenPosts, insertNews } from "./supabaseNews.js";

const { posts, failedSources } = await crawlLatestNews();
const newPosts = await filterUnseenPosts(dedupePostsByUrl(posts));
const news = await generateHeadlinesForPosts(newPosts);

await insertNews(news);

console.log(JSON.stringify(news, null, 2));

// Posts from the sources that worked are already saved. Exit non-zero so the
// GitHub Actions run turns red instead of hiding a failed source (Nov 12–17:
// an invalid Apify token failed every source for 5 days behind green runs).
if (failedSources.length > 0) {
  console.error(`crawler: ${failedSources.length} source(s) failed: ${failedSources.join(", ")}`);
  process.exitCode = 1;
}
