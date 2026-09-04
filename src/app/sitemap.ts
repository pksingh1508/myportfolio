import type { MetadataRoute } from "next";
import { projects, site } from "../constant/data";

/**
 * Public route map. Sitemap entries require absolute URLs, so this returns
 * an empty (valid) map until site.url carries the production domain —
 * a sitemap pointing at a guessed host would be worse than none.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) {
    return [];
  }
  return [
    { url: `${site.url}/` },
    ...projects.map((project) => ({
      url: `${site.url}/work/${project.slug}`,
    })),
  ];
}
