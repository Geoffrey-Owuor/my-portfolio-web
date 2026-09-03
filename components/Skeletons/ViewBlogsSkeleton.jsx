import TOCSkeleton from "./TOCSkeleton";

const ViewBlogsSkeleton = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-8 lg:flex-row lg:gap-6">
      {/* LEFT COLUMN: Main Blog Content Skeleton */}
      <article className="w-full max-w-none min-w-0">
        {/* Header Section */}
        <header className="mb-6">
          {/* Title skeleton */}
          <div className="mb-6 space-y-3">
            <div className="bg-border-subtle h-9 w-full animate-pulse rounded-xl sm:h-10" />
            <div className="bg-border-subtle h-9 w-3/4 animate-pulse rounded-xl sm:h-10" />
          </div>

          {/* Tagline skeleton */}
          <div className="bg-accent/10 mb-6 h-6 w-40 animate-pulse rounded-lg" />

          {/* Meta Information skeleton — author, date, read time, edit, back */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Author: icon + text */}
            <div className="flex items-center gap-2">
              <div className="bg-border-subtle h-4 w-4 animate-pulse rounded-full sm:h-5 sm:w-5" />
              <div className="bg-border-subtle h-4 w-24 animate-pulse rounded-xl sm:h-5 sm:w-28" />
            </div>
            {/* Date: icon + text */}
            <div className="flex items-center gap-2">
              <div className="bg-border-subtle h-4 w-4 animate-pulse rounded-full sm:h-5 sm:w-5" />
              <div className="bg-border-subtle h-4 w-20 animate-pulse rounded-xl sm:h-5 sm:w-24" />
            </div>
            {/* Read time: icon + text */}
            <div className="flex items-center gap-2">
              <div className="bg-border-subtle h-4 w-4 animate-pulse rounded-full sm:h-5 sm:w-5" />
              <div className="bg-border-subtle h-4 w-16 animate-pulse rounded-xl sm:h-5 sm:w-20" />
            </div>
            {/* Edit button: icon + text */}
            <div className="flex items-center gap-2">
              <div className="bg-border-subtle h-4 w-4 animate-pulse rounded-full sm:h-5 sm:w-5" />
              <div className="bg-border-subtle h-4 w-8 animate-pulse rounded-xl sm:h-5 sm:w-10" />
            </div>
            {/* Back button: icon + text */}
            <div className="flex items-center gap-2">
              <div className="bg-border-subtle h-4 w-4 animate-pulse rounded-full sm:h-5 sm:w-5" />
              <div className="bg-border-subtle h-4 w-20 animate-pulse rounded-xl sm:h-5 sm:w-24" />
            </div>
          </div>

          {/* Share row: "Share:" label + 4 icon buttons */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="bg-border-subtle h-4 w-4 animate-pulse rounded" />
              <div className="bg-border-subtle h-4 w-10 animate-pulse rounded" />
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border-border-subtle bg-border-subtle h-7 w-7 animate-pulse rounded-full border"
                />
              ))}
            </div>
          </div>
        </header>

        {/* Top Divider */}
        <div className="bg-border-subtle mb-8 h-px sm:mb-12" />

        {/* Content Section skeleton — headings + paragraphs */}
        <div className="max-w-none space-y-6">
          <div className="bg-border-subtle h-7 w-2/3 animate-pulse rounded-xl sm:h-8" />
          <div className="space-y-3">
            <div className="bg-border-subtle h-5 w-full animate-pulse rounded-xl sm:h-6" />
            <div className="bg-border-subtle h-5 w-full animate-pulse rounded-xl sm:h-6" />
            <div className="bg-border-subtle h-5 w-5/6 animate-pulse rounded-xl sm:h-6" />
          </div>
          <div className="space-y-3">
            <div className="bg-border-subtle h-5 w-full animate-pulse rounded-xl sm:h-6" />
            <div className="bg-border-subtle h-5 w-full animate-pulse rounded-xl sm:h-6" />
            <div className="bg-border-subtle h-5 w-4/5 animate-pulse rounded-xl sm:h-6" />
          </div>
          <div className="bg-border-subtle h-7 w-1/2 animate-pulse rounded-xl sm:h-8" />
          <div className="space-y-3">
            <div className="bg-border-subtle h-5 w-full animate-pulse rounded-xl sm:h-6" />
            <div className="bg-border-subtle h-5 w-full animate-pulse rounded-xl sm:h-6" />
            <div className="bg-border-subtle h-5 w-full animate-pulse rounded-xl sm:h-6" />
            <div className="bg-border-subtle h-5 w-3/4 animate-pulse rounded-xl sm:h-6" />
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="bg-border-subtle mt-12 h-px sm:mt-16" />

        {/* Prev / Next nav card row */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`border-border-subtle flex flex-col gap-2 rounded-xl border p-5 ${
                i === 1 ? "items-end sm:col-start-2" : "items-start"
              }`}
            >
              {/* icon + label */}
              <div
                className={`flex items-center gap-1.5 ${i === 1 ? "flex-row-reverse" : ""}`}
              >
                <div className="bg-border-subtle h-4 w-4 animate-pulse rounded-full" />
                <div className="bg-border-subtle h-3 w-16 animate-pulse rounded" />
              </div>

              {/* title */}
              <div className="w-full space-y-2">
                <div className="bg-border-subtle h-5 w-full animate-pulse rounded-xl" />
                <div className="bg-border-subtle h-5 w-2/3 animate-pulse rounded-xl" />
              </div>

              {/* read time */}
              <div
                className={`flex items-center gap-1.5 ${i === 1 ? "flex-row-reverse" : ""}`}
              >
                <div className="bg-border-subtle h-3.5 w-3.5 animate-pulse rounded-full" />
                <div className="bg-border-subtle h-3 w-12 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* RIGHT COLUMN: Table of Contents Skeleton */}
      <TOCSkeleton />
    </div>
  );
};

export default ViewBlogsSkeleton;
