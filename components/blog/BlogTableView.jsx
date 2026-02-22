"use client";
import Link from "next/link";
import { Calendar, Clock, ArrowUpRight, UserRound } from "lucide-react";
import { formatDate } from "@/utils/Helpers";

const BlogTableView = ({
  currentBlogs,
  searchQuery,
  highlightText,
  setIsLoadingLine,
}) => {
  if (currentBlogs.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="max-w-md px-4 text-gray-500 dark:text-gray-400">
          <p className="text-lg font-semibold">
            No blog titles matching your search, try searching something else.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_auto] items-center border-b border-gray-200 bg-gray-100/80 px-6 py-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto] dark:border-gray-800 dark:bg-gray-900/80">
        <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400">
          Title
        </span>
        <span className="hidden text-xs font-semibold tracking-widest text-gray-500 uppercase md:block dark:text-gray-400">
          Author
        </span>
        <span className="hidden text-xs font-semibold tracking-widest text-gray-500 uppercase md:block dark:text-gray-400">
          Date
        </span>
        <span className="hidden text-xs font-semibold tracking-widest text-gray-500 uppercase md:block dark:text-gray-400">
          Read time
        </span>
        <span className="hidden text-xs font-semibold tracking-widest text-gray-500 uppercase md:block dark:text-gray-400">
          Go to
        </span>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800/70">
        {currentBlogs.map((blog, index) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.id}`}
            onClick={() => setIsLoadingLine(true)}
            className="group grid grid-cols-[1fr_auto] items-center bg-slate-50 px-6 py-4 transition-colors duration-150 hover:bg-blue-50/60 md:grid-cols-[2fr_1fr_1fr_1fr_auto] dark:bg-gray-900/30 dark:hover:bg-blue-950/20"
          >
            {/* Index + Title */}
            <div className="flex max-w-[400px] min-w-0 items-center gap-4">
              <span className="hidden w-6 shrink-0 truncate text-left text-xs text-gray-300 tabular-nums sm:block dark:text-gray-700">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="truncate font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                {highlightText(blog.blog_title, searchQuery)}
              </span>
            </div>

            {/* Author */}
            <div className="hidden items-center gap-1.5 text-sm text-gray-500 md:flex dark:text-gray-400">
              <UserRound className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{blog.blog_author}</span>
            </div>

            {/* Date */}
            <div className="hidden items-center gap-1.5 text-sm text-gray-500 md:flex dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{formatDate(blog.blog_date)}</span>
            </div>

            {/* Read time */}
            <div className="hidden items-center gap-1.5 text-sm text-gray-500 md:flex dark:text-gray-400">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{blog.read_time}</span>
            </div>

            {/* Arrow */}
            <div className="flex shrink-0 items-center pl-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition-all duration-200 group-hover:bg-blue-100 group-hover:text-blue-500 dark:text-gray-600 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-400">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>

            {/* Mobile: meta row shown below title */}
            <div className="col-span-2 mt-1.5 flex items-center gap-3 text-xs text-gray-400 md:hidden dark:text-gray-500">
              <span className="flex items-center gap-1">
                <UserRound className="h-3 w-3" />
                {blog.blog_author}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(blog.blog_date)}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {blog.read_time}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogTableView;
