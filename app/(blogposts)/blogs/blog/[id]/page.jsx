import { query } from "@/lib/db";
import ViewBlog from "@/components/blog/ViewBlog";

const getBlogInfo = async (id) => {
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
};

const page = async ({ params }) => {
  const { id } = await params;
  const blogPost = await getBlogInfo(id);
  return <ViewBlog blogPost={blogPost} />;
};

export default page;
