"use client";
import { ProgressLink } from "../Modules/RouteProgress";
import { Calendar, Clock, ArrowRight, UserRound } from "lucide-react";
import { formatDate } from "@/utils/Helpers";

const BlogCardView = ({ currentBlogs, searchQuery, highlightText }) => {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {currentBlogs.length > 0 ? (
        currentBlogs.map((blog) => (
          <article
            key={blog.id}
            className="border-border-subtle group hover:border-accent has-[a:focus-visible]:border-accent rounded-card relative flex flex-col border p-6 transition-colors duration-150"
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
            <p className="text-text-muted mb-6 line-clamp-3 grow">
              {blog.excerpt}
            </p>

            {/* The card's one link, stretched over the whole card by its
                ::after, so the card can be middle-clicked or opened in a new
                tab like any other link. */}
            <ProgressLink
              href={`/blog/${blog.slug}`}
              aria-label={`Read more: ${blog.blog_title}`}
              className="text-accent inline-flex w-fit items-center gap-1.5 text-sm font-medium underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-none"
            >
              Read more
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
            </ProgressLink>
          </article>
        ))
      ) : (
        <div className="border-border-subtle rounded-card col-span-full flex min-h-[50vh] flex-col items-center justify-center border-[1.5px] border-dashed text-center">
          <div className="text-text-muted max-w-md px-4">
            <p className="text-lg font-semibold">
              No posts match your search. Try something else.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCardView;
