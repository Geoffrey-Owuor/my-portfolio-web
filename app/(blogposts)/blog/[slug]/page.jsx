import { query } from "@/lib/db";
import ViewBlog from "@/components/blog/ViewBlog";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { BlogsData } from "@/cache/BlogsData";
import { notFound, permanentRedirect } from "next/navigation";

import { stripMarkdown } from "@/utils/Helpers";
import JsonLd from "@/components/Modules/JsonLd";
import { OG_IMAGE, pageMetadata, PERSON_ID, SITE_URL } from "@/utils/metadata";

// Resolves to null for an unknown post. A failed read throws instead, so it
// reaches the error page rather than telling crawlers the post is gone, and
// unstable_cache never stores it.
const readBlogInfo = async (slug) => {
  // Neighbours follow the same order the blogs listing renders in (newest
  // first), matching the projects page: "previous" is the card above this one
  // on /blogs and "next" is the card below it. Both ends wrap: the newest
  // post's previous is the oldest, and the oldest post's next is the newest.
  // The neighbour titles are joined in so the nav can name where each link
  // lands before the reader commits to it.
  const blogQuery = `
      WITH bounds AS (
        SELECT MIN(id) AS min_id, MAX(id) AS max_id FROM blogs
      ),
      neighbours AS (
        SELECT
          b.id,

          (b.id = bounds.max_id) AS is_first_blog,
          (b.id = bounds.min_id) AS is_last_blog,

          COALESCE(
            (SELECT id FROM blogs WHERE id > b.id ORDER BY id ASC LIMIT 1),
            bounds.min_id
          ) AS previous_blog_id,

          COALESCE(
            (SELECT id FROM blogs WHERE id < b.id ORDER BY id DESC LIMIT 1),
            bounds.max_id
          ) AS next_blog_id

        FROM blogs b, bounds
        WHERE b.slug = $1
      )
      SELECT
        b.id, b.slug, b.blog_title, b.blog_author, b.blog_date, b.read_time, b.blog_content, b.author_tagline,

        n.is_first_blog,
        n.is_last_blog,

        prev.id AS previous_blog_id,
        prev.slug AS previous_blog_slug,
        prev.blog_title AS previous_blog_title,
        prev.read_time AS previous_blog_read_time,

        nxt.id AS next_blog_id,
        nxt.slug AS next_blog_slug,
        nxt.blog_title AS next_blog_title,
        nxt.read_time AS next_blog_read_time

      FROM blogs b
      JOIN neighbours n ON n.id = b.id
      LEFT JOIN blogs prev ON prev.id = n.previous_blog_id
      LEFT JOIN blogs nxt ON nxt.id = n.next_blog_id
      WHERE b.slug = $1
       `;

  const blogPost = await query(blogQuery, [slug]);

  return blogPost[0] ?? null;
};

// Tagged with the listing, so publishing, editing or deleting any post also
// refreshes the neighbour links on the others.
const getBlogInfo = cache(
  unstable_cache(readBlogInfo, ["blogInfo"], { tags: ["BlogsData"] }),
);

// Posts used to live at /blog/<id>, and those links are already out there.
const readSlugForLegacyId = async (id) => {
  // Anything else would make Postgres reject the integer parameter.
  if (!/^\d{1,9}$/.test(id)) return null;

  const rows = await query("SELECT slug FROM blogs WHERE id = $1", [id]);
  return rows[0]?.slug ?? null;
};

const getSlugForLegacyId = unstable_cache(
  readSlugForLegacyId,
  ["blogSlugForLegacyId"],
  { tags: ["BlogsData"] },
);

// Known posts are prerendered; a newer one renders on first visit, then stays
// cached like the rest.
export async function generateStaticParams() {
  const blogs = await BlogsData();
  return (blogs ?? []).map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blogPost = await getBlogInfo(slug);

  if (!blogPost) {
    return { title: "Blog not found" };
  }

  return {
    ...pageMetadata({
      title: blogPost.blog_title,
      // Taglines are short labels like "#WebPerformance", so the snippet comes
      // from the post itself.
      description: stripMarkdown(blogPost.blog_content, 155),
      path: `/blog/${blogPost.slug}`,
      type: "article",
      openGraph: {
        publishedTime: new Date(blogPost.blog_date).toISOString(),
        authors: [blogPost.blog_author],
      },
    }),
    authors: [{ name: blogPost.blog_author }],
  };
}

const page = async ({ params }) => {
  const { slug } = await params;
  const blogPost = await getBlogInfo(slug);

  if (!blogPost) {
    const currentSlug = await getSlugForLegacyId(slug);
    if (currentSlug) permanentRedirect(`/blog/${currentSlug}`);
    notFound();
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: blogPost.blog_title,
          description: stripMarkdown(blogPost.blog_content, 155),
          datePublished: new Date(blogPost.blog_date).toISOString(),
          url: `${SITE_URL}/blog/${blogPost.slug}`,
          mainEntityOfPage: `${SITE_URL}/blog/${blogPost.slug}`,
          image: `${SITE_URL}${OG_IMAGE}`,
          author: { "@id": PERSON_ID, name: blogPost.blog_author },
        }}
      />
      <ViewBlog blogPost={blogPost} />
    </>
  );
};

export default page;
