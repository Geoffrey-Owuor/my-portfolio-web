const ViewBlogsSkeleton = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col px-4 py-24 sm:px-6 lg:flex-row lg:px-16">
      {/* LEFT COLUMN: Main Blog Content Skeleton */}
      <article className="w-full max-w-none">
        {/* Header Section */}
        <header className="mb-6">
          {/* Title skeleton */}
          <div className="mb-6 space-y-3">
            <div className="h-9 w-full animate-pulse rounded-xl bg-gray-200 sm:h-10 dark:bg-gray-800" />
            <div className="h-9 w-3/4 animate-pulse rounded-xl bg-gray-200 sm:h-10 dark:bg-gray-800" />
          </div>

          {/* Meta Information skeleton — author, date, read time, edit, back */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Author: icon + text */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200 sm:h-5 sm:w-5 dark:bg-gray-800" />
              <div className="h-4 w-24 animate-pulse rounded-xl bg-gray-200 sm:h-5 sm:w-28 dark:bg-gray-800" />
            </div>
            {/* Date: icon + text */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200 sm:h-5 sm:w-5 dark:bg-gray-800" />
              <div className="h-4 w-20 animate-pulse rounded-xl bg-gray-200 sm:h-5 sm:w-24 dark:bg-gray-800" />
            </div>
            {/* Read time: icon + text */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200 sm:h-5 sm:w-5 dark:bg-gray-800" />
              <div className="h-4 w-16 animate-pulse rounded-xl bg-gray-200 sm:h-5 sm:w-20 dark:bg-gray-800" />
            </div>
            {/* Edit button: icon + text */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200 sm:h-5 sm:w-5 dark:bg-gray-800" />
              <div className="h-4 w-8 animate-pulse rounded-xl bg-gray-200 sm:h-5 sm:w-10 dark:bg-gray-800" />
            </div>
            {/* Back button: icon + text */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200 sm:h-5 sm:w-5 dark:bg-gray-800" />
              <div className="h-4 w-20 animate-pulse rounded-xl bg-gray-200 sm:h-5 sm:w-24 dark:bg-gray-800" />
            </div>
          </div>

          {/* Share row: "Share:" label + 4 icon buttons */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-10 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-7 w-7 animate-pulse rounded-full border border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-800"
                />
              ))}
            </div>
          </div>
        </header>

        {/* Top Divider */}
        <div className="mb-8 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent sm:mb-12 dark:via-gray-700" />

        {/* Content Section skeleton — headings + paragraphs */}
        <div className="max-w-none space-y-6">
          <div className="h-7 w-2/3 animate-pulse rounded-xl bg-gray-200 sm:h-8 dark:bg-gray-800" />
          <div className="space-y-3">
            <div className="h-5 w-full animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
            <div className="h-5 w-full animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
            <div className="h-5 w-5/6 animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
          </div>
          <div className="space-y-3">
            <div className="h-5 w-full animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
            <div className="h-5 w-full animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
            <div className="h-5 w-4/5 animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
          </div>
          <div className="h-7 w-1/2 animate-pulse rounded-xl bg-gray-200 sm:h-8 dark:bg-gray-800" />
          <div className="space-y-3">
            <div className="h-5 w-full animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
            <div className="h-5 w-full animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
            <div className="h-5 w-full animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
            <div className="h-5 w-3/4 animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="mt-12 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent sm:mt-16 dark:via-gray-700" />

        {/* Prev / Author Card / Next row */}
        <div className="mt-8 flex items-center justify-between sm:mt-12">
          {/* Previous button: chevron + label */}
          <div className="flex items-center gap-1 rounded-full py-2 pr-2 pl-2 sm:pr-4">
            <div className="h-7 w-7 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="hidden h-4 w-16 animate-pulse rounded-xl bg-gray-200 sm:block dark:bg-gray-800" />
          </div>

          {/* Author card: avatar + name/tagline */}
          <div className="inline-flex items-center gap-4 rounded-2xl p-2">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-200 sm:h-16 sm:w-16 dark:bg-gray-800" />
            <div className="hidden space-y-2 sm:block">
              <div className="h-5 w-32 animate-pulse rounded-xl bg-gray-200 sm:h-6 sm:w-40 dark:bg-gray-800" />
              <div className="h-4 w-44 animate-pulse rounded-xl bg-gray-200 sm:h-5 sm:w-52 dark:bg-gray-800" />
            </div>
          </div>

          {/* Next button: label + chevron */}
          <div className="flex items-center gap-1 rounded-full py-2 pr-2 pl-2 sm:pl-4">
            <div className="hidden h-4 w-10 animate-pulse rounded-xl bg-gray-200 sm:block dark:bg-gray-800" />
            <div className="h-7 w-7 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </article>

      {/* RIGHT COLUMN: Table of Contents Skeleton */}
      <nav className="custom-content:flex sticky top-49 mr-6 hidden max-h-[calc(100vh-5rem)] w-70 shrink-0 flex-col overflow-y-auto rounded-xl p-4">
        {/* "On this page" heading */}
        <div className="mb-4 border-b-2 border-gray-200 pb-2 dark:border-gray-800">
          <div className="h-3.5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        {/* TOC list items */}
        <div className="space-y-3">
          {[`full`, `3/4`, `5/6`, `full`, `4/5`, `2/3`].map((w, i) => (
            <div
              key={i}
              className={`h-4 w-${w} animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800`}
            />
          ))}
        </div>
      </nav>
    </div>
  );
};

export default ViewBlogsSkeleton;
