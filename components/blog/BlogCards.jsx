"use client";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, UserRound } from "lucide-react";

const formatDate = (dateInput) => {
  return new Date(dateInput).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
const BlogCards = ({ blogs }) => {
  // Function to remove asterisks and get preview text
  const getPreviewText = (content, maxLength = 150) => {
    // Remove asterisks (both single and double)
    const cleanedContent = content.replace(/\*\*/g, "").replace(/\*/g, "");

    // Get first part of content
    const preview = cleanedContent.slice(0, maxLength);

    // Add ellipsis if content was truncated
    return preview.length < cleanedContent.length ? `${preview}...` : preview;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
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
              href={`/blog/${blog.id}`}
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-900 underline-offset-4 hover:underline dark:text-white"
            >
              Read more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogCards;
