import TOCSkeleton from "./TOCSkeleton";

const ViewBlogsSkeleton = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col px-4 py-8 lg:flex-row lg:gap-6">
      {/* LEFT COLUMN: Main Blog Content Skeleton */}
      <article className="w-full max-w-none">
        {/* Header Section */}
        <header className="mb-6">
          {/* Title skeleton */}
          <div className="mb-6 space-y-3">
            <div className="bg-border-subtle h-9 w-full animate-pulse rounded-xl sm:h-10" />
            <div className="bg-border-subtle h-9 w-3/4 animate-pulse rounded-xl sm:h-10" />
          </div>

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

        {/* Prev / Author Card / Next row */}
        <div className="mt-8 flex items-center justify-between sm:mt-12">
          {/* Previous button: chevron + label */}
          <div className="flex items-center gap-1 rounded-full py-2 pr-2 pl-2 sm:pr-4">
            <div className="bg-border-subtle h-7 w-7 animate-pulse rounded-full" />
            <div className="bg-border-subtle hidden h-4 w-16 animate-pulse rounded-xl sm:block" />
          </div>

          {/* Author card: avatar + name/tagline */}
          <div className="inline-flex items-center gap-4 rounded-2xl p-2">
            <div className="bg-border-subtle h-12 w-12 shrink-0 animate-pulse rounded-full sm:h-16 sm:w-16" />
            <div className="hidden space-y-2 sm:block">
              <div className="bg-border-subtle h-5 w-32 animate-pulse rounded-xl sm:h-6 sm:w-40" />
              <div className="bg-border-subtle h-4 w-44 animate-pulse rounded-xl sm:h-5 sm:w-52" />
            </div>
          </div>

          {/* Next button: label + chevron */}
          <div className="flex items-center gap-1 rounded-full py-2 pr-2 pl-2 sm:pl-4">
            <div className="bg-border-subtle hidden h-4 w-10 animate-pulse rounded-xl sm:block" />
            <div className="bg-border-subtle h-7 w-7 animate-pulse rounded-full" />
          </div>
        </div>
      </article>

      {/* RIGHT COLUMN: Table of Contents Skeleton */}
      <TOCSkeleton />
    </div>
  );
};

export default ViewBlogsSkeleton;
