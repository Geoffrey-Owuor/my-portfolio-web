"use client";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
  indexOfFirstBlog,
  indexOfLastBlog,
  blogsLength,
}) => {
  return (
    <div className="mt-6 flex items-center justify-between py-3">
      {totalPages > 1 && (
        <div className="flex flex-1 justify-between md:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center gap-1 rounded-full border border-gray-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center gap-1 rounded-full border border-gray-300 bg-slate-50 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="hidden md:flex md:flex-1 md:items-center md:justify-center lg:justify-between">
        {totalPages >= 1 && (
          <div className="flex items-center gap-4">
            <div className="hidden pr-3 lg:flex">
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold">{indexOfFirstBlog + 1}</span> to{" "}
                <span className="font-semibold">
                  {Math.min(indexOfLastBlog, blogsLength)}
                </span>{" "}
                of <span className="font-semibold">{blogsLength}</span>{" "}
                {`result${blogsLength > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center rounded-lg p-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
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
                      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg text-sm font-semibold ${
                        currentPage === pageNumber
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
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
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-400 dark:text-slate-500"
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
              className="inline-flex items-center justify-center rounded-lg p-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </button>
          </nav>
        )}
        {/* An invisible div to push pagination to the center */}
        <div className="hidden lg:inline-flex lg:w-40"></div>
      </div>
    </div>
  );
};

export default Pagination;
