import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/digest", "/install", "/privacy"].map((path) => ({ url: `${SITE_URL}${path}` }));
}
