// Absolute site URL for metadata, sitemap and robots. Vercel sets
// VERCEL_PROJECT_PRODUCTION_URL (host only) on every deployment.
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = host ? `https://${host}` : "http://localhost:3000";
