import { query } from "@/lib/db";
import ViewBlog from "@/components/blog/ViewBlog";
import { cache, Suspense } from "react";
import ViewBlogsSkeleton from "@/components/Skeletons/ViewBlogsSkeleton";

const getBlogInfo = cache(async (id) => {
  try {
    const blogQuery = `SELECT id, blog_title, blog_author, blog_date, read_time, blog_content, author_tagline
                       FROM blogs
                       WHERE id = $1`;
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
      authors: [blogPost.blog_author],
    },
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
