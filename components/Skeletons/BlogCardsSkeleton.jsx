const BlogCardsSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center justify-center gap-6">
        <div className="h-9 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="h-11 w-36 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <article
            key={index}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50"
          >
            {/* Title skeleton */}
            <div className="mb-3 h-7 w-3/4 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />

            {/* Meta information skeleton */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="h-4 w-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              <span className="text-gray-400">•</span>
              <div className="h-4 w-20 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              <span className="text-gray-400">•</span>
              <div className="h-4 w-16 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>

            {/* Content preview skeleton */}
            <div className="mb-6 grow space-y-2">
              <div className="h-4 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-2/3 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>

            {/* Read more button skeleton */}
            <div className="h-5 w-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogCardsSkeleton;
