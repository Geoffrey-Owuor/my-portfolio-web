import { BlogsData } from "@/cache/BlogsData";
import WritingWrapper from "../Wrappers/WritingWrapper";
import { stripMarkdown } from "@/utils/Helpers";

const LATEST_COUNT = 3;

const Writing = async () => {
  const blogs = await BlogsData(); // newest first; null if the read failed

  // Only a short plain-text excerpt crosses to the client, not whole posts.
  const posts = blogs?.slice(0, LATEST_COUNT).map((blog) => ({
    id: blog.id,
    title: blog.blog_title,
    date: blog.blog_date,
    readTime: blog.read_time,
    excerpt: stripMarkdown(blog.blog_content, 180),
  }));

  return (
    <section
      id="writing" // For the command palette and scroll-spy
      className="mx-auto flex w-full max-w-7xl justify-center px-4 py-20 md:py-28"
    >
      <WritingWrapper posts={posts ?? null} />
    </section>
  );
};

export default Writing;
