const BlogCardsSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl px-5 py-24 sm:px-6 lg:px-8 2xl:max-w-7xl">
      {/* Header */}
      <div className="relative mb-10 flex items-center justify-center">
        <div className="h-9 w-48 animate-pulse rounded-full bg-border-subtle" />
      </div>

      {/* Toolbar: Create + Search + View Toggle */}
      <div className="mb-10 flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        {/* Search input skeleton */}
        <div className="h-11 w-80 animate-pulse rounded-full bg-border-subtle" />

        {/* View toggle pill skeleton */}
        <div className="bg-surface-raised h-10 w-36 animate-pulse rounded-full" />
      </div>

      {/* Card Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <article
            key={index}
            className="border-border-subtle bg-surface-raised flex flex-col rounded-xl border p-6"
          >
            {/* Title skeleton */}
            <div className="mb-3 h-7 w-3/4 animate-pulse rounded-xl bg-border-subtle" />

            {/* Meta information skeleton */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="h-4 w-24 animate-pulse rounded-xl bg-border-subtle" />
              <span className="text-text-muted">•</span>
              <div className="h-4 w-20 animate-pulse rounded-xl bg-border-subtle" />
              <span className="text-text-muted">•</span>
              <div className="h-4 w-16 animate-pulse rounded-xl bg-border-subtle" />
            </div>

            {/* Content preview skeleton */}
            <div className="mb-6 grow space-y-2">
              <div className="h-4 w-full animate-pulse rounded-xl bg-border-subtle" />
              <div className="h-4 w-full animate-pulse rounded-xl bg-border-subtle" />
              <div className="h-4 w-2/3 animate-pulse rounded-xl bg-border-subtle" />
            </div>

            {/* Read more button skeleton */}
            <div className="h-5 w-24 animate-pulse rounded-xl bg-border-subtle" />
          </article>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="mt-10 flex items-center justify-center gap-2">
        <div className="h-9 w-9 animate-pulse rounded-full bg-border-subtle" />
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-9 w-9 animate-pulse rounded-full bg-border-subtle"
          />
        ))}
        <div className="h-9 w-9 animate-pulse rounded-full bg-border-subtle" />
      </div>
    </div>
  );
};

export default BlogCardsSkeleton;
