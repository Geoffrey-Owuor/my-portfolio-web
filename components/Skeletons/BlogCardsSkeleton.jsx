const BlogCardsSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Header */}
      <div className="relative mb-10 flex items-center justify-center">
        <div className="bg-border-subtle h-9 w-48 animate-pulse rounded-xl" />
      </div>

      {/* Toolbar: Create + Search + View Toggle */}
      <div className="mb-10 flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        {/* Search input skeleton */}
        <div className="bg-border-subtle h-11 w-80 animate-pulse rounded-xl" />

        {/* View toggle pill skeleton */}
        <div className="bg-surface-raised h-10 w-36 animate-pulse rounded-xl" />
      </div>

      {/* Card Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <article
            key={index}
            className="border-border-subtle bg-surface-raised flex flex-col rounded-xl border p-6"
          >
            {/* Title skeleton */}
            <div className="bg-border-subtle mb-3 h-7 w-3/4 animate-pulse rounded-xl" />

            {/* Meta information skeleton */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="bg-border-subtle h-4 w-24 animate-pulse rounded-xl" />
              <span className="text-text-muted">•</span>
              <div className="bg-border-subtle h-4 w-20 animate-pulse rounded-xl" />
              <span className="text-text-muted">•</span>
              <div className="bg-border-subtle h-4 w-16 animate-pulse rounded-xl" />
            </div>

            {/* Content preview skeleton */}
            <div className="mb-6 grow space-y-2">
              <div className="bg-border-subtle h-4 w-full animate-pulse rounded-xl" />
              <div className="bg-border-subtle h-4 w-full animate-pulse rounded-xl" />
              <div className="bg-border-subtle h-4 w-2/3 animate-pulse rounded-xl" />
            </div>

            {/* Read more button skeleton */}
            <div className="bg-border-subtle h-5 w-24 animate-pulse rounded-xl" />
          </article>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="mt-10 flex items-center justify-center gap-2">
        <div className="bg-border-subtle h-9 w-9 animate-pulse rounded-lg" />
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-border-subtle h-9 w-9 animate-pulse rounded-lg"
          />
        ))}
        <div className="bg-border-subtle h-9 w-9 animate-pulse rounded-lg" />
      </div>
    </div>
  );
};

export default BlogCardsSkeleton;
