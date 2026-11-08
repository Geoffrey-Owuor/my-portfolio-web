import BlogCards from "@/components/blog/BlogCards";
import { BlogsData } from "@/cache/BlogsData";
import { Suspense } from "react";
import BlogCardsSkeleton from "@/components/Skeletons/BlogCardsSkeleton";
import { pageMetadata } from "@/utils/metadata";

export const metadata = pageMetadata({
  title: "Tech Blog: Software, Security & Emerging Tech",
  description:
    "Explore easy-to-understand tech blogs covering software development, cybersecurity, cryptocurrency, cloud computing, and emerging technologies.",
  path: "/blogs",
});

const BlogCardsData = async () => {
  const blogs = await BlogsData();

  // BlogCards' own empty state already covers a failed read.
  return <BlogCards blogs={blogs ?? []} />;
};

const page = () => {
  return (
    <Suspense fallback={<BlogCardsSkeleton />}>
      <BlogCardsData />
    </Suspense>
  );
};

export default page;
