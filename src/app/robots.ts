import type { MetadataRoute } from "next";
import { site } from "../constant/data";

/**
 * Crawl rules. The dev-only /specimen route stays out of indexes (it also
 * carries route-level noindex). The sitemap directive activates with the
 * production domain; nothing references a guessed host before then.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/specimen" }],
    ...(site.url ? { sitemap: `${site.url}/sitemap.xml` } : {}),
  };
}
