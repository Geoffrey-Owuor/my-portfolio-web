// Absolute origin for anything that needs full URLs: metadataBase, the
// sitemap, robots.txt and the RSS feed.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://jeff-portfolio-web.vercel.app"
).replace(/\/+$/, "");

// The site-wide social preview card (app/opengraph-image.jsx). Next merges
// metadata shallowly, so a page that sets its own `openGraph` drops the
// inherited image unless it lists this one again.
export const OG_IMAGE = "/opengraph-image";
