"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Calendar,
  Clock,
  ArrowRight,
  UserRound,
  Plus,
  ArrowLeft,
  RefreshCcw,
  X,
  Search,
} from "lucide-react";
import LoadingLine from "../Modules/LoadingLine";
import { formatDate } from "@/utils/Helpers";
import Pagination from "../Modules/Pagination";

const BlogCards = ({ blogs }) => {
  const [isLoadingLine, setIsLoadingLine] = useState(false);
  const router = useRouter();

  // Search query states
  const [searchQuery, setSearchQuery] = useState("");

  // Function to filter blogs based on blog title
  const filteredBlogs = useMemo(() => {
    if (!searchQuery) return blogs;

    const lowerQuery = searchQuery.toLowerCase();

    return blogs.filter((blog) =>
      blog.blog_title?.toLowerCase().includes(lowerQuery),
    );
  }, [blogs, searchQuery]);

  // Function to highlight title text that matches search query when a user types in a search query
  const highlightText = (text, query) => {
    if (!query) return text;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="text-blue-500 dark:text-blue-400">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  // Function to remove asterisks and get preview text
  const getPreviewText = (content, maxLength = 150) => {
    // Get first part of content
    const preview = content.slice(0, maxLength);

    // Add ellipsis if content was truncated
    return preview.length < content.length ? `${preview}...` : preview;
  };

  // Pagination states, values and logic
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(
    indexOfFirstBlog,
    Math.min(indexOfLastBlog, filteredBlogs.length),
  );

  const handleCreateLink = () => {
    setIsLoadingLine(true);
    router.push("/createblog");
  };

  const handleSearchQuery = (e) => {
    setCurrentPage(1);
    setSearchQuery(e.target.value);
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
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <RefreshCcw className="h-5 w-5" />
              Try Again
            </button>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
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
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex justify-center">
          <span className="text-3xl font-semibold">My Blog Space</span>
        </div>
        <div className="mb-10 flex flex-col items-center gap-6 md:flex-row md:justify-center">
          <button
            onClick={handleCreateLink}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-200/50 px-6 py-2.5 transition-colors duration-200 hover:bg-gray-300/50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
          >
            <Plus className="h-5 w-5" />
            Create Blog
          </button>

          {/* The search input field */}
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a blog..."
              value={searchQuery}
              onChange={(e) => handleSearchQuery(e)}
              className="w-80 rounded-full border border-gray-300 bg-white py-3 pr-4 pl-11 text-sm text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
            />
            <div
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {currentBlogs.length > 0 ? (
            currentBlogs.map((blog) => (
              <article
                key={blog.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-slate-50 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50"
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
            // THE FIX: Added 'col-span-full'
            <div className="col-span-full flex min-h-[50vh] flex-col items-center justify-center text-center">
              <div className="max-w-md px-4 text-gray-500 dark:text-gray-400">
                <p className="text-lg font-semibold">
                  No blog titles matching your search, try searching something
                  else.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* The Pagination UI */}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          indexOfFirstBlog={indexOfFirstBlog}
          indexOfLastBlog={indexOfLastBlog}
          blogsLength={filteredBlogs.length}
        />
      </div>
    </>
  );
};

export default BlogCards;
