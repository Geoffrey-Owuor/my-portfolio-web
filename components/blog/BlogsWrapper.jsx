import BlogCards from "./BlogCards";
import { BlogsData } from "@/cache/BlogsData";

const BlogsWrapper = async () => {
  const blogs = await BlogsData();
  return <BlogCards blogs={blogs} />;
};

export default BlogsWrapper;
