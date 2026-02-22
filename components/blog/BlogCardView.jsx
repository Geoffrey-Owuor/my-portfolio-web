"use client";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Clock, ArrowRight, UserRound } from "lucide-react";
import { formatDate } from "@/utils/Helpers";

const BlogCardView = ({
  currentBlogs,
  searchQuery,
  highlightText,
  getPreviewText,
  setIsLoadingLine,
}) => {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {currentBlogs.length > 0 ? (
        currentBlogs.map((blog) => (
          <article
            key={blog.id}
            className="flex flex-col rounded-xl border border-gray-200 bg-slate-50 p-6 transition-shadow hover:shadow-sm dark:border-gray-800 dark:bg-gray-900/50"
          >
            {/* Title */}
            <h2 className="mb-3 line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
              {highlightText(blog.blog_title, searchQuery)}
            </h2>

            {/* Meta information */}
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <UserRound className="h-4 w-4" />
                <span className="mt-0.5">{blog.blog_author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span className="mt-0.5">{formatDate(blog.blog_date)}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span className="mt-0.5">{blog.read_time}</span>
              </span>
            </div>

            {/* Content preview */}
            <div className="mb-6 grow text-gray-700 dark:text-gray-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {getPreviewText(blog.blog_content)}
              </ReactMarkdown>
            </div>

            {/* Read more button */}
            <Link
              href={`/blog/${blog.id}`}
              onClick={() => setIsLoadingLine(true)}
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-blue-500 underline-offset-4 hover:underline dark:text-blue-400"
            >
              Read more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))
      ) : (
        <div className="col-span-full flex min-h-[50vh] flex-col items-center justify-center text-center">
          <div className="max-w-md px-4 text-gray-500 dark:text-gray-400">
            <p className="text-lg font-semibold">
              No blog titles matching your search, try searching something else.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCardView;
