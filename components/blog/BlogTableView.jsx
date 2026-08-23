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
      <div className="border-border-subtle col-span-full flex min-h-[50vh] flex-col items-center justify-center rounded-xl border-[1.5px] border-dashed text-center">
        <div className="text-text-muted max-w-md px-4">
          <p className="text-lg font-semibold">
            No blog titles matching your search, try searching something else.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-border-subtle w-full overflow-hidden rounded-xl border">
      {/* Table header */}
      <div className="border-border-subtle bg-surface grid grid-cols-[1fr_auto] items-center border-b px-6 py-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <span className="text-text-muted text-xs font-semibold tracking-widest uppercase">
          Title
        </span>
        <span className="text-text-muted hidden text-xs font-semibold tracking-widest uppercase md:block">
          Author
        </span>
        <span className="text-text-muted hidden text-xs font-semibold tracking-widest uppercase md:block">
          Date
        </span>
        <span className="text-text-muted hidden text-xs font-semibold tracking-widest uppercase md:block">
          Read time
        </span>
        <span className="text-text-muted hidden text-xs font-semibold tracking-widest uppercase md:block">
          Go to
        </span>
      </div>

      {/* Table rows */}
      <div className="divide-border-subtle divide-y">
        {currentBlogs.map((blog, index) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.id}`}
            onClick={() => setIsLoadingLine(true)}
            className="group bg-surface hover:bg-accent/5 grid grid-cols-[1fr_auto] items-center px-6 py-4 transition-colors duration-150 md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
          >
            {/* Index + Title */}
            <div className="flex max-w-[400px] min-w-0 items-center gap-4">
              <span className="text-text-muted hidden w-6 shrink-0 truncate text-left text-xs tabular-nums sm:block">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-text-primary group-hover:text-accent truncate font-semibold transition-colors">
                {highlightText(blog.blog_title, searchQuery)}
              </span>
            </div>

            {/* Author */}
            <div className="text-text-muted hidden items-center gap-1.5 text-sm md:flex">
              <UserRound className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{blog.blog_author}</span>
            </div>

            {/* Date */}
            <div className="text-text-muted hidden items-center gap-1.5 text-sm md:flex">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{formatDate(blog.blog_date)}</span>
            </div>

            {/* Read time */}
            <div className="text-text-muted hidden items-center gap-1.5 text-sm md:flex">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{blog.read_time}</span>
            </div>

            {/* Arrow */}
            <div className="flex shrink-0 items-center pl-4">
              <span className="text-text-muted group-hover:bg-accent/10 group-hover:text-accent flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>

            {/* Mobile: meta row shown below title */}
            <div className="text-text-muted col-span-2 mt-1.5 flex items-center gap-3 text-xs md:hidden">
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
