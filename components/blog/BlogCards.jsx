"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  UserRound,
  Plus,
  ArrowLeft,
  RefreshCcw,
} from "lucide-react";
import LoadingLine from "../Modules/LoadingLine";
import { formatDate } from "@/utils/Helpers";

const BlogCards = ({ blogs }) => {
  const [isLoadingLine, setIsLoadingLine] = useState(false);
  const router = useRouter();
  // Function to remove asterisks and get preview text
  const getPreviewText = (content, maxLength = 150) => {
    // Remove asterisks (both single and double)
    const cleanedContent = content.replace(/\*\*/g, "").replace(/\*/g, "");

    // Get first part of content
    const preview = cleanedContent.slice(0, maxLength);

    // Add ellipsis if content was truncated
    return preview.length < cleanedContent.length ? `${preview}...` : preview;
  };

  const handleCreateLink = () => {
    setIsLoadingLine(true);
    router.push("/createblog");
  };

  if (!blogs || blogs.length === 0) {
    return (
      <div className="mx-auto mt-10 flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            No Blogs Available
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            We couldn't load any blogs at the moment. This might be due to a
            connection issue.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <RefreshCcw className="h-5 w-5" />
              Try Again
            </button>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoadingLine && <LoadingLine />}
      <div className="mx-auto mt-10 max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-center gap-6">
          <span className="text-3xl font-semibold">My Blogs</span>
          <button
            onClick={handleCreateLink}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-gray-200/50 px-4 py-2.5 transition-colors duration-200 hover:bg-gray-300/50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
          >
            <Plus className="h-5 w-5" />
            Create Blog
          </button>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="flex flex-col rounded-xl border border-gray-200 bg-slate-50 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50"
            >
              {/* Title */}
              <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                {blog.blog_title}
              </h2>

              {/* Meta information */}
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <UserRound className="h-4 w-4" />
                  {blog.blog_author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(blog.blog_date)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {blog.read_time}
                </span>
              </div>

              {/* Content preview */}
              <p className="mb-6 grow text-gray-700 dark:text-gray-300">
                {getPreviewText(blog.blog_content)}
              </p>

              {/* Read more button */}
              <Link
                href={`/blogs/blog/${blog.id}`}
                onClick={() => setIsLoadingLine(true)}
                className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-blue-500 underline-offset-4 hover:underline dark:text-blue-400"
              >
                Read more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogCards;
