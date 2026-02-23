const ViewBlogsSkeleton = () => {
  return (
    // Updated container to match ViewBlog: flex-col on mobile, row on large screens
    <div className="mx-auto flex max-w-7xl flex-col py-24 lg:flex-row">
      {/* LEFT COLUMN: Main Blog Content Skeleton */}
      {/* Added w-full, min-w-0 to match real article constraints */}
      <article className="w-full min-w-0 flex-1 px-4 py-12 sm:px-6 lg:px-16">
        {/* Header Section */}
        <header className="mb-6">
          {/* Title skeleton */}
          <div className="mb-6 space-y-3">
            <div className="h-9 w-full animate-pulse rounded-xl bg-gray-200 sm:h-10 dark:bg-gray-800" />
            <div className="h-9 w-3/4 animate-pulse rounded-xl bg-gray-200 sm:h-10 dark:bg-gray-800" />
          </div>

          {/* Meta Information skeleton */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="h-5 w-28 animate-pulse rounded-xl bg-gray-200 sm:h-6 sm:w-32 dark:bg-gray-800" />
            <div className="h-5 w-24 animate-pulse rounded-xl bg-gray-200 sm:h-6 sm:w-28 dark:bg-gray-800" />
            <div className="h-5 w-20 animate-pulse rounded-xl bg-gray-200 sm:h-6 sm:w-24 dark:bg-gray-800" />

            {/* Edit/Back buttons simulation */}
            <div className="h-5 w-16 animate-pulse rounded-xl bg-gray-200 sm:h-6 sm:w-20 dark:bg-gray-800" />
            <div className="h-5 w-28 animate-pulse rounded-xl bg-gray-200 sm:h-6 sm:w-32 dark:bg-gray-800" />
          </div>

          {/* Share buttons skeleton */}
          <div className="mt-6 flex items-center gap-4">
            <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          </div>
        </header>

        {/* Divider */}
        <div className="mb-8 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent sm:mb-12 dark:via-gray-700" />

        {/* Content Section skeleton */}
        <div className="max-w-none space-y-6">
          {/* Simulating multiple paragraphs and headings */}
          <div className="h-8 w-2/3 animate-pulse rounded-xl bg-gray-200 sm:h-9 dark:bg-gray-800" />

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

          <div className="h-8 w-1/2 animate-pulse rounded-xl bg-gray-200 sm:h-9 dark:bg-gray-800" />

          <div className="space-y-3">
            <div className="h-5 w-full animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
            <div className="h-5 w-full animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
            <div className="h-5 w-full animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
            <div className="h-5 w-3/4 animate-pulse rounded-xl bg-gray-200 sm:h-6 dark:bg-gray-800" />
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="mt-12 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent sm:mt-16 dark:via-gray-700" />

        {/* Author Card skeleton */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-4 rounded-2xl p-6 sm:mt-12 sm:p-8">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-200 sm:h-16 sm:w-16 dark:bg-gray-800" />
            <div className="space-y-2">
              <div className="h-6 w-32 animate-pulse rounded-xl bg-gray-200 sm:h-7 sm:w-40 dark:bg-gray-800" />
              <div className="h-4 w-48 animate-pulse rounded-xl bg-gray-200 sm:h-5 sm:w-56 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </article>

      {/* RIGHT COLUMN: Table Of Contents Skeleton */}
      {/* Matched classes: hidden on mobile, sticky, w-70, consistent styling */}
      <div className="custom-content:flex sticky top-12 mr-6 hidden h-fit w-70 shrink-0 flex-col gap-4 rounded-xl p-4">
        {/* "On this page" Title */}
        <div className="mb-4 border-b-2 border-gray-200 pb-2 dark:border-gray-800">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* List Items */}
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-3/4 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-5/6 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-4/5 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default ViewBlogsSkeleton;
