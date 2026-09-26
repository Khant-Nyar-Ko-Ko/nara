import { crawlOneNewsPerSource } from "./apifyFacebookCrawler.js";
import { dedupePostsByUrl } from "./dedupe.js";
import { generateHeadlinesForPosts } from "./groqHeadlines.js";
import { filterUnseenPosts, insertNews } from "./supabaseNews.js";

const posts = await crawlOneNewsPerSource();
const newPosts = await filterUnseenPosts(dedupePostsByUrl(posts));
const news = await generateHeadlinesForPosts(newPosts);

await insertNews(news);

console.log(JSON.stringify(news, null, 2));
