"use client";
import Link from "next/link";
import MarkdownPreview from "../Modules/MarkdownPreview";
import { Calendar, Clock, ArrowRight, UserRound } from "lucide-react";
import { formatDate } from "@/utils/Helpers";
import { useRouter } from "next/navigation";

const BlogCardView = ({
  currentBlogs,
  searchQuery,
  highlightText,
  setIsLoadingLine,
}) => {
  const router = useRouter();
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {currentBlogs.length > 0 ? (
        currentBlogs.map((blog) => (
          <article
            key={blog.id}
            onClick={() => {
              setIsLoadingLine(true);
              router.push(`/blog/${blog.id}`);
            }}
            className="border-border-subtle group hover:border-accent flex cursor-pointer flex-col rounded-xl border p-6 transition-colors duration-150"
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

            {/* Content preview, clamped for a consistent, skimmable card height */}
            <MarkdownPreview className="text-text-muted mb-6 line-clamp-3 grow">
              {blog.blog_content}
            </MarkdownPreview>

            {/* Read more button */}
            <Link
              href={`/blog/${blog.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsLoadingLine(true);
              }}
              className="text-accent inline-flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              Read more
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
            </Link>
          </article>
        ))
      ) : (
        <div className="border-border-subtle col-span-full flex min-h-[50vh] flex-col items-center justify-center rounded-xl border-[1.5px] border-dashed text-center">
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
