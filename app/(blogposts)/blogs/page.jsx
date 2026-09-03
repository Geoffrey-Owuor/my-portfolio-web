import BlogCards from "@/components/blog/BlogCards";
import { BlogsData } from "@/cache/BlogsData";
import { Suspense } from "react";
import BlogCardsSkeleton from "@/components/Skeletons/BlogCardsSkeleton";

export const metadata = {
  title: "Tech Blogs | Insights on Software, Security & Emerging Technologies",
  description:
    "Explore easy-to-understand tech blogs covering software development, cybersecurity, cryptocurrency, cloud computing, and emerging technologies.",

  openGraph: {
    title: "Tech Blog | Technology Insights & Practical Guides",
    description:
      "Explore tech blogs with clear explanations on programming, security, cryptocurrency, and modern software technologies.",
    type: "website",
    url: "/blogs",
    siteName: "Tech Blogs",
  },
};

const BlogCardsData = async () => {
  const blogs = await BlogsData();

  return <BlogCards blogs={blogs} />;
};

const page = () => {
  return (
    <Suspense fallback={<BlogCardsSkeleton />}>
      <BlogCardsData />
    </Suspense>
  );
};

export default page;
