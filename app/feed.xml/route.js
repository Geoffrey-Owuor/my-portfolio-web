import { BlogsData } from "@/cache/BlogsData";
import { stripMarkdown } from "@/utils/Helpers";
import { SITE_URL } from "@/utils/metadata";

// Rebuilt when the BlogsData tag is revalidated (after a blog create, update
// or delete); the hourly revalidate is only a backstop.
export const revalidate = 3600;

const FEED_TITLE = "Jeff's Portfolio — Blog";
const FEED_DESCRIPTION =
  "Posts on software development, tools and lessons learned.";

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toItem = (blog) => {
  const link = `${SITE_URL}/blog/${blog.id}`;
  return `    <item>
      <title>${escapeXml(blog.blog_title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      ${blog.blog_date ? `<pubDate>${new Date(blog.blog_date).toUTCString()}</pubDate>` : ""}
      ${blog.blog_author ? `<dc:creator>${escapeXml(blog.blog_author)}</dc:creator>` : ""}
      <description>${escapeXml(stripMarkdown(blog.blog_content, 300))}</description>
    </item>`;
};

export async function GET() {
  const blogs = await BlogsData();

  // A failed read must not publish an empty feed — readers would treat every
  // post as gone. A 503 makes them keep what they have and retry later.
  if (!blogs) {
    return new Response("Feed temporarily unavailable", {
      status: 503,
      headers: { "Retry-After": "300" },
    });
  }

  const lastBuildDate = blogs[0]?.blog_date
    ? new Date(blogs[0].blog_date).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/blogs</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${blogs.map(toItem).join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
