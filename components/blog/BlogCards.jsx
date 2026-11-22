"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Search, X, LayoutGrid, List } from "lucide-react";
import Pagination from "../Modules/Pagination";
import BlogCardView from "./BlogCardView";
import PageHeader from "../Layout/PageHeader";
import BlogTableView from "./BlogTableView";

const PAGE_SIZES = [6, 12, 24];

const BlogCards = ({ blogs }) => {
  const toolbarRef = useRef(null);

  // View toggle: "card" | "table"
  const [viewMode, setViewMode] = useState("card");

  // Search query states
  const [searchQuery, setSearchQuery] = useState("");

  // Matches a post's title or its excerpt.
  const filteredBlogs = useMemo(() => {
    const lowerQuery = searchQuery.trim().toLowerCase();
    if (!lowerQuery) return blogs;
    return blogs.filter(
      (blog) =>
        blog.blog_title?.toLowerCase().includes(lowerQuery) ||
        blog.excerpt?.toLowerCase().includes(lowerQuery),
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

  // Pagination. The page is clamped when read, so a stale ?page= from the
  // URL can't land past the end of a shorter list.
  const [requestedPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(PAGE_SIZES[0]);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const currentPage = Math.min(requestedPage, Math.max(totalPages, 1));

  // Search, page, page size and view live in the URL, so coming back from a post (or
  // sharing the link) lands on the same list. They are read after mount
  // rather than with useSearchParams, which would take the whole listing out
  // of the prerendered HTML.
  const [urlRead, setUrlRead] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = Number(params.get("page"));
    const perPage = Number(params.get("per"));
    setSearchQuery(params.get("q") ?? "");
    if (Number.isInteger(page) && page > 1) setCurrentPage(page);
    if (PAGE_SIZES.includes(perPage)) setBlogsPerPage(perPage);
    if (params.get("view") === "table") setViewMode("table");
    setUrlRead(true);
  }, []);

  useEffect(() => {
    if (!urlRead) return;
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (currentPage > 1) params.set("page", String(currentPage));
    if (blogsPerPage !== PAGE_SIZES[0]) params.set("per", String(blogsPerPage));
    if (viewMode === "table") params.set("view", "table");
    const search = params.toString();
    const url = `${window.location.pathname}${search ? `?${search}` : ""}`;
    if (url !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, "", url);
    }
  }, [urlRead, searchQuery, currentPage, blogsPerPage, viewMode]);
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

  const clearSearch = () => {
    setCurrentPage(1);
    setSearchQuery("");
  };

  // A new page starts at the top of the list, not wherever the last one ended.
  const changePage = (update) => {
    setCurrentPage(update);
    toolbarRef.current?.scrollIntoView({ block: "start" });
  };

  // A new size keeps the first post on screen on the page it lands on.
  const changePageSize = (size) => {
    setBlogsPerPage(size);
    setCurrentPage(Math.floor(indexOfFirstBlog / size) + 1);
  };

  // Published nothing yet: not an error, so nothing to retry.
  if (blogs.length === 0) {
    return (
      <div className="container-page py-section">
        <PageHeader
          path="blogs"
          title="Blog Space"
          subtitle="Thoughts and writing on software, security and emerging tech"
        />
        <div className="border-border-subtle rounded-card flex min-h-[40vh] flex-col items-center justify-center gap-4 border-[1.5px] border-dashed px-4 text-center">
          <p className="text-text-muted text-lg font-semibold">
            No posts yet. Check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-page py-section">
        <PageHeader
          path="blogs"
          title="Blog Space"
          subtitle="Thoughts and writing on software, security and emerging tech"
        />
        {/* Toolbar: Search + View Toggle */}
        <div
          ref={toolbarRef}
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          {/* Search input */}
          <div className="relative w-full md:w-80">
            <Search className="text-text-muted absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for a blog..."
              aria-label="Search blogs"
              value={searchQuery}
              onChange={handleSearchQuery}
              className="border-border-subtle bg-surface-raised text-text-primary placeholder-text-muted focus:border-accent rounded-field w-full border py-3 pr-10 pl-11 text-sm transition-colors focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                className="text-text-muted hover:bg-surface rounded-control absolute top-1/2 right-4 -translate-y-1/2 p-1"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row">
            {/* Toggle pill */}
            <div className="border-border-subtle bg-surface-raised rounded-card flex items-center gap-0.5 border p-1">
              <button
                onClick={() => setViewMode("card")}
                aria-label="Card view"
                aria-pressed={viewMode === "card"}
                className={`rounded-control flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors duration-150 ${
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
                aria-pressed={viewMode === "table"}
                className={`rounded-control flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors duration-150 ${
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
          />
        ) : (
          <BlogTableView
            currentBlogs={currentBlogs}
            searchQuery={searchQuery}
            highlightText={highlightText}
            startIndex={indexOfFirstBlog}
          />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={changePage}
          totalPages={totalPages}
          indexOfFirstBlog={indexOfFirstBlog}
          indexOfLastBlog={indexOfLastBlog}
          blogsLength={filteredBlogs.length}
          pageSize={blogsPerPage}
          pageSizeOptions={PAGE_SIZES}
          onPageSizeChange={changePageSize}
        />
      </div>
    </>
  );
};

export default BlogCards;
