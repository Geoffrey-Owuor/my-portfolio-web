import BlogCards from "@/components/blog/BlogCards";
import { BlogsData } from "@/cache/BlogsData";
import { headers } from "next/headers";
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

const page = async () => {
  const blogs = await BlogsData();

  const headerList = await headers();
  const userId = headerList.get("x-user-id");
  const userName = headerList.get("x-user-name");
  const userEmail = headerList.get("x-user-email");

  const userObject = {
    id: userId,
    name: userName,
    email: userEmail,
  };

  return (
    <Suspense fallback={<BlogCardsSkeleton />}>
      <BlogCards blogs={blogs} user={userObject} />
    </Suspense>
  );
};

export default page;
