import BlogCards from "@/components/blog/BlogCards";
import { BlogsData } from "@/cache/BlogsData";
import { Suspense } from "react";
import BlogCardsSkeleton from "@/components/Skeletons/BlogCardsSkeleton";
import { pageMetadata } from "@/utils/metadata";
import { stripMarkdown } from "@/utils/Helpers";

export const metadata = pageMetadata({
  title: "Tech Blog: Software, Security & Emerging Tech",
  description:
    "Explore easy-to-understand tech blogs covering software development, cybersecurity, cryptocurrency, cloud computing, and emerging technologies.",
  path: "/blogs",
});

const BlogCardsData = async () => {
  const blogs = await BlogsData();

  // Only what the listing shows crosses to the client.
  const cards = (blogs ?? []).map(({ content_head, ...blog }) => ({
    ...blog,
    excerpt: stripMarkdown(content_head, 220),
  }));

  return <BlogCards blogs={cards} failed={blogs === null} />;
};

const page = () => {
  return (
    <Suspense fallback={<BlogCardsSkeleton />}>
      <BlogCardsData />
    </Suspense>
  );
};

export default page;
