// Absolute origin for anything that needs full URLs: metadataBase, the
// sitemap, robots.txt and the RSS feed.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://jeff-portfolio-web.vercel.app"
).replace(/\/+$/, "");

// The name people search for, so it leads the titles and the site name.
export const SITE_NAME = "Geoffrey Owuor";
export const SITE_TITLE = "Geoffrey Owuor | Full-Stack Developer in Nairobi";
export const SITE_DESCRIPTION =
  "Geoffrey Owuor is a full-stack developer in Nairobi, Kenya, building production-ready web apps with Next.js, React, Node.js and PostgreSQL.";

// The site-wide social preview cards (app/opengraph-image.jsx and
// app/twitter-image.jsx). Next merges metadata shallowly, so a page that sets
// its own `openGraph` or `twitter` drops the inherited image unless it lists
// this one again.
export const OG_IMAGE = "/opengraph-image";
export const TWITTER_IMAGE = "/twitter-image";

// Lets feed readers and browser extensions discover the blog feed.
export const RSS_ALTERNATES = {
  "application/rss+xml": [{ url: "/feed.xml", title: `${SITE_NAME} — Blog` }],
};

// The per-page SEO block. `alternates`, `openGraph` and `twitter` are replaced
// whole rather than merged with the root layout's, so every indexable page
// builds all three here: otherwise it would inherit the homepage's Twitter
// title and lose the RSS link.
export const pageMetadata = ({
  title,
  socialTitle = title,
  description,
  path,
  type = "website",
  openGraph,
}) => ({
  title,
  description,
  alternates: { canonical: path, types: RSS_ALTERNATES },
  openGraph: {
    title: socialTitle,
    description,
    type,
    url: path,
    siteName: SITE_NAME,
    images: OG_IMAGE,
    ...openGraph,
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description,
    images: TWITTER_IMAGE,
  },
});
