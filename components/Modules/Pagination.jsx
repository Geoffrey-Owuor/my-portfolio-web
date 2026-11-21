"use client";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import PageSizeMenu from "./PageSizeMenu";

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
  indexOfFirstBlog,
  indexOfLastBlog,
  blogsLength,
  // Optional "per page" menu. It stays while there's more than the smallest
  // size to page through, even on one page, so a bigger size can be undone.
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
}) => {
  const showSizeMenu =
    Boolean(onPageSizeChange && pageSizeOptions?.length) &&
    blogsLength > Math.min(...pageSizeOptions);

  if (totalPages <= 1 && !showSizeMenu) return null;

  const sizeMenu = showSizeMenu && (
    <PageSizeMenu
      value={pageSize}
      options={pageSizeOptions}
      onChange={onPageSizeChange}
    />
  );

  return (
    <div className="mt-6 flex flex-col gap-4 py-3 md:flex-row md:items-center md:justify-between">
      {/* Mobile Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between md:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-border-subtle bg-surface-raised text-text-primary hover:bg-border-subtle/50 rounded-control relative inline-flex items-center gap-1 border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="border-border-subtle bg-surface-raised text-text-primary hover:bg-border-subtle/50 rounded-control relative ml-3 inline-flex items-center gap-1 border px-6 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {sizeMenu && (
        <div className="flex justify-center md:hidden">{sizeMenu}</div>
      )}

      {/* Desktop Navigation: count | pages | per-page; the outer two share the
          spare width equally, so the page numbers stay centred. */}
      <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
        <div className="flex flex-1 basis-0 items-center">
          {totalPages > 1 && (
            <div className="hidden pr-3 lg:flex">
              <p className="text-text-muted text-sm">
                Showing{" "}
                <span className="font-semibold">{indexOfFirstBlog + 1}</span> to{" "}
                <span className="font-semibold">
                  {Math.min(indexOfLastBlog, blogsLength)}
                </span>{" "}
                of <span className="font-semibold">{blogsLength}</span>{" "}
                {`result${blogsLength > 1 ? "s" : ""}`}
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-1"
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="text-text-muted hover:bg-surface-raised hover:text-text-primary rounded-control inline-flex items-center justify-center p-2 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="mx-2 flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;

                // Show first page, last page, current page, and pages around current
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      aria-label={`Page ${pageNumber}`}
                      aria-current={
                        currentPage === pageNumber ? "page" : undefined
                      }
                      className={`rounded-control inline-flex h-8 w-8 items-center justify-center truncate text-sm font-semibold transition-colors ${
                        currentPage === pageNumber
                          ? "bg-text-primary text-surface"
                          : "text-text-muted hover:bg-surface-raised hover:text-text-primary"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span
                      key={pageNumber}
                      className="text-text-muted inline-flex items-center justify-center px-4 py-2 text-sm font-semibold"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="text-text-muted hover:bg-surface-raised hover:text-text-primary rounded-control inline-flex items-center justify-center p-2 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </button>
          </nav>
        )}
        <div className="flex flex-1 basis-0 justify-end">{sizeMenu}</div>
      </div>
    </div>
  );
};

export default Pagination;
