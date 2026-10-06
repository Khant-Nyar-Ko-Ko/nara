import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// API routes and the account page aren't content to index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/settings"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
