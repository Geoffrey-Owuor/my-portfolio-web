import BlogCards from "@/components/blog/BlogCards";
import { BlogsData } from "@/cache/BlogsData";
import { Suspense } from "react";
import BlogCardsSkeleton from "@/components/Skeletons/BlogCardsSkeleton";

const page = async () => {
  const blogs = await BlogsData();
  return (
    <Suspense fallback={<BlogCardsSkeleton />}>
      <BlogCards blogs={blogs} />
    </Suspense>
  );
};

export default page;
