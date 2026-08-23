"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronFirst,
  ChevronLast,
  Clock,
} from "lucide-react";

// One half of the prev/next pair. `direction` decides which way the card leans:
// "previous" is arrow-first and left aligned, "next" is arrow-last and right
// aligned, so the pair reads outward from the middle of the page.
const NeighbourCard = ({
  id,
  title,
  readTime,
  direction,
  isWrapping,
  onNavigate,
}) => {
  const isPrevious = direction === "previous";

  // At the ends of the list navigation wraps, so the label says where you
  // actually land rather than a "previous" that walks forwards.
  const label = isWrapping
    ? isPrevious
      ? "last blog"
      : "first blog"
    : direction;

  const Icon = isWrapping
    ? isPrevious
      ? ChevronFirst
      : ChevronLast
    : isPrevious
      ? ArrowLeft
      : ArrowRight;

  return (
    <Link
      href={`/blog/${id}`}
      onClick={onNavigate}
      aria-label={`${isPrevious ? "Previous" : "Next"} blog: ${title}`}
      className={`group border-border-subtle hover:border-accent focus-visible:border-accent flex flex-col gap-2 rounded-xl border p-5 transition-colors duration-150 focus-visible:outline-none ${
        isPrevious ? "items-start" : "items-end text-right sm:col-start-2"
      }`}
    >
      <span
        className={`font-dm-mono text-text-muted group-hover:text-accent flex items-center gap-1.5 text-xs transition-colors ${
          isPrevious ? "" : "flex-row-reverse"
        }`}
      >
        <Icon
          className={`h-4 w-4 transition-transform duration-200 ${
            isPrevious
              ? "group-hover:-translate-x-1"
              : "group-hover:translate-x-1"
          }`}
        />
        {label}
      </span>

      {/* Titles run long, so they are clamped to two lines and allowed to break
          mid-word — a single unbroken token would otherwise overflow the card. */}
      <h2 className="text-text-primary group-hover:text-accent line-clamp-2 text-lg font-semibold wrap-break-word transition-colors">
        {title}
      </h2>

      {readTime && (
        <span
          className={`font-dm-mono text-text-muted flex items-center gap-1.5 text-xs ${
            isPrevious ? "" : "flex-row-reverse"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          {readTime}
        </span>
      )}
    </Link>
  );
};

const BlogNav = ({ blogPost, onNavigate }) => {
  const hasPrevious =
    blogPost.previous_blog_id && blogPost.previous_blog_id !== blogPost.id;
  const hasNext =
    blogPost.next_blog_id && blogPost.next_blog_id !== blogPost.id;

  // A lone blog is its own neighbour on both sides — nothing to page through.
  if (!hasPrevious && !hasNext) return null;

  return (
    <nav
      aria-label="Blog navigation"
      className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2"
    >
      {hasPrevious && (
        <NeighbourCard
          id={blogPost.previous_blog_id}
          title={blogPost.previous_blog_title}
          readTime={blogPost.previous_blog_read_time}
          direction="previous"
          isWrapping={blogPost.is_first_blog}
          onNavigate={onNavigate}
        />
      )}
      {hasNext && (
        <NeighbourCard
          id={blogPost.next_blog_id}
          title={blogPost.next_blog_title}
          readTime={blogPost.next_blog_read_time}
          direction="next"
          isWrapping={blogPost.is_last_blog}
          onNavigate={onNavigate}
        />
      )}
    </nav>
  );
};

export default BlogNav;
