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
import Link from "next/link";
import BlogTableView from "./BlogTableView";

const BlogCards = ({ blogs }) => {
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
        <span key={index} className="text-accent">
          {part}
        </span>
      ) : (
        part
      ),
    );
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
      <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <h2 className="text-text-primary mb-4 text-3xl font-bold">
            No Blogs Available
          </h2>
          <p className="text-text-muted mb-8">
            We couldn't load any blogs at the moment. This might be due to a
            connection issue.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-text-primary text-surface inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-opacity hover:opacity-90"
            >
              <RefreshCcw className="h-5 w-5" />
              Try Again
            </button>
            <button
              onClick={() => router.back()}
              className="border-border-subtle bg-surface text-text-primary hover:bg-surface-raised inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors"
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
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Header */}
        <div className="relative mb-10 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Heading */}
            <span className="font-mono text-text-muted text-sm font-medium tracking-[0.2em] uppercase">
              Thoughts & Writings
            </span>
            <h2 className="font-mono text-text-primary text-3xl font-semibold tracking-tight md:text-4xl">
              Blog Space
            </h2>
            <div className="bg-accent mt-1 h-px w-12" />
          </div>
        </div>
        {/* Toolbar: Create + Search + View Toggle */}
        <div className="mb-10 flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          {/* Search input */}
          <div className="relative">
            <Search className="text-text-muted absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for a blog..."
              value={searchQuery}
              onChange={handleSearchQuery}
              className="border-border-subtle bg-surface-raised text-text-primary placeholder-text-muted focus:border-accent w-80 rounded-xl border py-3 pr-10 pl-11 text-sm transition-colors focus:outline-none"
            />
            <button
              className="text-text-muted hover:bg-surface absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* View toggle pill, Login & Create Blog */}
          <div className="flex flex-col items-center gap-4 md:flex-row">
            {/* Login & Create Blog links */}
            <div className="inline-flex items-center gap-4">
              <Link
                href="/login"
                onClick={() => setIsLoadingLine(true)}
                className="text-text-muted hover:text-text-primary text-sm underline underline-offset-2 transition-colors duration-150"
              >
                Login
              </Link>
              <Link
                href="/createblog"
                onClick={() => setIsLoadingLine(true)}
                className="text-text-muted hover:text-text-primary text-sm underline underline-offset-2 transition-colors duration-150"
              >
                Create Blog
              </Link>
            </div>

            {/* Toggle pill */}
            <div className="border-border-subtle bg-surface-raised flex items-center gap-0.5 rounded-xl border p-1">
              <button
                onClick={() => setViewMode("card")}
                aria-label="Card view"
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  viewMode === "card"
                    ? "bg-surface text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                aria-label="Table view"
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  viewMode === "table"
                    ? "bg-surface text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* View */}
        {viewMode === "card" ? (
          <BlogCardView
            currentBlogs={currentBlogs}
            searchQuery={searchQuery}
            highlightText={highlightText}
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
