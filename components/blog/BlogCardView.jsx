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
            className="border-border-subtle hover:border-accent flex flex-col rounded-xl border p-6 transition-colors duration-150"
          >
            {/* Title */}
            <h2 className="text-text-primary mb-3 line-clamp-2 text-xl font-semibold">
              {highlightText(blog.blog_title, searchQuery)}
            </h2>

            {/* Meta information */}
            <div className="text-text-muted mb-4 flex flex-wrap items-center gap-3 text-sm">
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
            <div className="text-text-muted mb-6 grow">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {getPreviewText(blog.blog_content)}
              </ReactMarkdown>
            </div>

            {/* Read more button */}
            <Link
              href={`/blog/${blog.id}`}
              onClick={() => setIsLoadingLine(true)}
              className="text-accent inline-flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              Read more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))
      ) : (
        <div className="col-span-full flex min-h-[50vh] flex-col items-center justify-center text-center">
          <div className="text-text-muted max-w-md px-4">
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
