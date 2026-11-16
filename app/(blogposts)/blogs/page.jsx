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

  // This page is static, so rendering a "couldn't load" state would cache it
  // until the next blog edit. Throwing keeps the last good page in the cache
  // and lets the next request try again; a visitor who does hit the failure
  // gets error.jsx.
  if (blogs === null) throw new Error("Couldn't load the blog listing");

  // Only what the listing shows crosses to the client.
  const cards = blogs.map(({ content_head, ...blog }) => ({
    ...blog,
    excerpt: stripMarkdown(content_head, 220),
  }));

  return <BlogCards blogs={cards} />;
};

const page = () => {
  return (
    <Suspense fallback={<BlogCardsSkeleton />}>
      <BlogCardsData />
    </Suspense>
  );
};

export default page;
