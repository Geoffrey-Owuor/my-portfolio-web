import { Calendar, UserRound, Clock } from "lucide-react";
import { formatDate } from "@/utils/Helpers";
const ViewBlog = ({ blogPost }) => {
  return (
    <article className="mx-auto mt-10 w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Section */}
      <header className="mb-8 sm:mb-12">
        <h1 className="mb-6 text-3xl leading-tight font-bold text-gray-900 sm:text-4xl dark:text-white">
          {blogPost.blog_title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 sm:gap-6 sm:text-base dark:text-gray-400">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium">{blogPost.blog_author}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{formatDate(blogPost.blog_date)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{blogPost.read_time}</span>
          </div>
        </div>
      </header>

      {/* Divider */}
      <div className="mb-8 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent sm:mb-12 dark:via-gray-700" />

      {/* Content Section */}
      <div className="prose prose-lg sm:prose-xl prose-gray dark:prose-invert max-w-none">
        <div className="space-y-6 leading-relaxed text-gray-700 dark:text-gray-300">
          {blogPost.blog_content.split("\n\n").map((paragraph, index) => {
            // Check if paragraph is a heading (starts with **)
            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              const headingText = paragraph.replace(/\*\*/g, "");
              return (
                <h2
                  key={index}
                  className="mt-12 mb-4 text-xl font-bold text-gray-900 first:mt-0 sm:text-2xl dark:text-white"
                >
                  {headingText}
                </h2>
              );
            }

            // Regular paragraph
            return (
              <p key={index} className="text-base leading-relaxed sm:text-lg">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="mt-12 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent sm:mt-16 dark:via-gray-700" />

      {/* Author Card */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:mt-12 sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 sm:h-16 sm:w-16">
            <span className="text-lg font-bold text-white sm:text-xl">
              {blogPost.blog_author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
              {blogPost.blog_author}
            </h3>
            <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
              {blogPost.author_tagline}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ViewBlog;
