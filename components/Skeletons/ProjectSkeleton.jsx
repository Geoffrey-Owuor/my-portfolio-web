export const ProjectSkeleton = () => {
  return (
    <section className="w-full px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button Skeleton */}
        <div className="mb-12 flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Title + CTA Skeleton (Inline, no card) */}
        <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="h-9 w-3/4 max-w-sm animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-10 w-36 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Thin divider */}
        <div className="mb-10 h-px w-full bg-gray-200 dark:bg-gray-800" />

        {/* Project Image Skeleton (Full-width, borderless) */}
        <div className="mb-12 w-full">
          <div className="h-64 w-full animate-pulse rounded-2xl bg-gray-200 sm:h-80 md:h-[400px] dark:bg-gray-800" />
        </div>

        {/* About section Skeleton (No card, typography matching) */}
        <div className="mb-10">
          {/* "About" label */}
          <div className="mb-2 h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          {/* "Overview" title */}
          <div className="mb-5 h-7 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />

          {/* Paragraph lines */}
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>

        {/* Thin divider */}
        <div className="mb-10 h-px w-full bg-gray-200 dark:bg-gray-800" />

        {/* Stack section Skeleton */}
        <div>
          {/* "Stack" label */}
          <div className="mb-2 h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          {/* "Built With" title */}
          <div className="mb-5 h-7 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />

          {/* Stack Pills/Icons Skeleton */}
          <div className="flex flex-wrap gap-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
