import { SITE_URL } from "@/utils/metadata";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Auth and authoring pages, and the JSON API, have nothing to index.
      disallow: ["/api/", "/login", "/createblog"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
