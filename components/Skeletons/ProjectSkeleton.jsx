export const ProjectSkeleton = () => {
  return (
    <section className="w-full px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back Button Skeleton */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Project Header Skeleton */}
        <div className="mb-8 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 p-8 dark:from-gray-800 dark:to-gray-900">
          {/* Title Skeleton */}
          <div className="mb-4 space-y-3">
            <div className="h-6 w-3/4 animate-pulse rounded-md bg-gray-300 dark:bg-gray-700" />
            <div className="h-6 w-1/2 animate-pulse rounded-md bg-gray-300 dark:bg-gray-700" />
          </div>

          {/* Button Skeleton */}
          <div className="h-8 w-40 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* --- NEW ADDITION: Project Image Skeleton --- */}
        <div className="mb-8 w-full rounded-2xl border border-gray-200 p-2 dark:border-gray-700">
          <div className="h-64 w-full animate-pulse rounded-xl bg-gray-200 sm:h-80 md:h-96 dark:bg-gray-800" />
        </div>
        {/* -------------------------------------------- */}

        {/* Description Section Skeleton */}
        <div className="rounded-xl bg-white p-8 shadow-sm dark:bg-gray-800">
          {/* Section Title Skeleton */}
          <div className="mb-6 h-8 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />

          {/* Description Lines Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-5/6 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-4/5 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-3/4 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        {/* Decorative Element Skeleton */}
        <div className="mt-8 flex justify-center">
          <div className="h-1 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </section>
  );
};
