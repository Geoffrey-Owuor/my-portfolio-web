"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  RefreshCcw,
  Search,
  X,
  LayoutGrid,
  List,
} from "lucide-react";
import LoadingLine from "../Modules/LoadingLine";
import Pagination from "../Modules/Pagination";
import BlogCardView from "./BlogCardView";
import BlogTableView from "./BlogTableView";
import BlogAvatar from "./BlogAvatar";

const BlogCards = ({ blogs, user }) => {
  const [isLoadingLine, setIsLoadingLine] = useState(false);
  const router = useRouter();

  // View toggle: "card" | "table"
  const [viewMode, setViewMode] = useState("card");

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

  // Highlight matching text in titles
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

  // Truncate content for card preview
  const getPreviewText = (content, maxLength = 150) => {
    const preview = content.slice(0, maxLength);
    return preview.length < content.length ? `${preview}...` : preview;
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(
    indexOfFirstBlog,
    Math.min(indexOfLastBlog, filteredBlogs.length),
  );

  const handleSearchQuery = (e) => {
    setCurrentPage(1);
    setSearchQuery(e.target.value);
  };

  if (!blogs || blogs.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-5 py-24 sm:px-6 lg:px-8">
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
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-6 lg:px-8 2xl:max-w-7xl">
        {/* Header */}
        <div className="relative mb-10 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Heading */}
            <span className="font-dm-mono text-sm font-medium tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500">
              Thoughts & Writings
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
              Blog Space
            </h2>
            <div className="mt-1 h-px w-12 bg-gray-300 dark:bg-gray-700" />
          </div>
          <div className="absolute top-18 right-0 sm:top-0">
            <BlogAvatar user={user} />
          </div>
        </div>
        {/* Toolbar: Create + Search + View Toggle */}
        <div className="mb-10 flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a blog..."
              value={searchQuery}
              onChange={handleSearchQuery}
              className="w-80 rounded-full border border-gray-300 bg-white py-3 pr-10 pl-11 text-sm text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
            />
            <button
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* View toggle pill */}
          <div className="flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-100/50 p-1 dark:border-gray-700 dark:bg-gray-800/50">
            <button
              onClick={() => setViewMode("card")}
              aria-label="Card view"
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                viewMode === "card"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              aria-label="Table view"
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>

        {/* View */}
        {viewMode === "card" ? (
          <BlogCardView
            currentBlogs={currentBlogs}
            searchQuery={searchQuery}
            highlightText={highlightText}
            getPreviewText={getPreviewText}
            setIsLoadingLine={setIsLoadingLine}
          />
        ) : (
          <BlogTableView
            currentBlogs={currentBlogs}
            searchQuery={searchQuery}
            highlightText={highlightText}
            setIsLoadingLine={setIsLoadingLine}
          />
        )}

        {/* Pagination */}
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
