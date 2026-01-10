import { query } from "@/lib/db";
import ViewBlog from "@/components/blog/ViewBlog";
import { cache, Suspense } from "react";
import ViewBlogsSkeleton from "@/components/Skeletons/ViewBlogsSkeleton";

const getBlogInfo = cache(async (id) => {
  try {
    const blogQuery = `SELECT 
                       b.id, b.blog_title, b.blog_author, b.blog_date, b.read_time, b.blog_content, b.author_tagline,
                       (SELECT COUNT(*)::int FROM blogs) AS total_blogs
                       FROM blogs b
                       WHERE b.id = $1`;

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
      url: `/blogs/blog/${id}`,
      siteName: blogPost.blog_title,
    },

    authors: [{ name: blogPost.blog_author }],
  };
}

const page = async ({ params }) => {
  const { id } = await params;
  const blogPost = await getBlogInfo(id);
  return (
    <Suspense fallback={<ViewBlogsSkeleton />}>
      <ViewBlog blogPost={blogPost} />
    </Suspense>
  );
};

export default page;
