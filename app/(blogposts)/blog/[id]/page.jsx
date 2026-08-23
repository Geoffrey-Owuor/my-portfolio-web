import { query } from "@/lib/db";
import ViewBlog from "@/components/blog/ViewBlog";
import { cache } from "react";
import { Suspense } from "react";
import ViewBlogsSkeleton from "@/components/Skeletons/ViewBlogsSkeleton";

import { headers } from "next/headers";

const getBlogInfo = cache(async (id) => {
  try {
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
          WHERE b.id = $1
        )
        SELECT
          b.id, b.blog_title, b.blog_author, b.blog_date, b.read_time, b.blog_content, b.author_tagline,

          n.is_first_blog,
          n.is_last_blog,

          prev.id AS previous_blog_id,
          prev.blog_title AS previous_blog_title,
          prev.read_time AS previous_blog_read_time,

          nxt.id AS next_blog_id,
          nxt.blog_title AS next_blog_title,
          nxt.read_time AS next_blog_read_time

        FROM blogs b
        JOIN neighbours n ON n.id = b.id
        LEFT JOIN blogs prev ON prev.id = n.previous_blog_id
        LEFT JOIN blogs nxt ON nxt.id = n.next_blog_id
        WHERE b.id = $1
         `;

    const blogPost = await query(blogQuery, [id]);

    return blogPost[0];
  } catch (error) {
    console.error("Error fetching the blog post", error);
    return [];
  }
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blogPost = await getBlogInfo(id);

  if (!blogPost || blogPost.length === 0) {
    return {
      title: "Blog not found",
    };
  }

  return {
    title: blogPost.blog_title,
    description: blogPost.author_tagline,

    openGraph: {
      title: blogPost.blog_title,
      description: blogPost.author_tagline,
      type: "article",
      url: `/blog/${id}`,
      siteName: blogPost.blog_title,
    },

    authors: [{ name: blogPost.blog_author }],
  };
}

const page = async ({ params }) => {
  const { id } = await params;
  const blogPost = await getBlogInfo(id);

  const headerList = await headers();
  const userId = headerList.get("x-user-id");

  return (
    <Suspense fallback={<ViewBlogsSkeleton />}>
      <ViewBlog blogPost={blogPost} userId={userId} />
    </Suspense>
  );
};

export default page;
