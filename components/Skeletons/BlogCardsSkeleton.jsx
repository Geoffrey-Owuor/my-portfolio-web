import { PageHeaderSkeleton } from "../Layout/PageHeader";

const BlogCardsSkeleton = () => {
  return (
    <div className="container-page py-section">
      <PageHeaderSkeleton />

      {/* Toolbar: Create + Search + View Toggle */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search input skeleton */}
        <div className="bg-border-subtle rounded-control h-11 w-full animate-pulse md:w-80" />

        {/* View toggle pill, Login & Create Blog skeleton */}
        <div className="flex flex-col items-center gap-4 md:flex-row">
          {/* Login & Create Blog links skeleton */}
          <div className="flex items-center gap-4">
            <div className="bg-border-subtle rounded-chip h-4 w-12 animate-pulse" />
            <div className="bg-border-subtle rounded-chip h-4 w-20 animate-pulse" />
          </div>

          {/* Toggle pill skeleton */}
          <div className="bg-surface-raised rounded-control h-10 w-36 animate-pulse" />
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <article
            key={index}
            className="border-border-subtle bg-surface-raised rounded-card flex flex-col border p-6"
          >
            {/* Title skeleton */}
            <div className="bg-border-subtle rounded-chip mb-3 h-7 w-3/4 animate-pulse" />

            {/* Meta information skeleton */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="bg-border-subtle rounded-chip h-4 w-24 animate-pulse" />
              <span className="text-text-muted">•</span>
              <div className="bg-border-subtle rounded-chip h-4 w-20 animate-pulse" />
              <span className="text-text-muted">•</span>
              <div className="bg-border-subtle rounded-chip h-4 w-16 animate-pulse" />
            </div>

            {/* Content preview skeleton */}
            <div className="mb-6 grow space-y-2">
              <div className="bg-border-subtle rounded-chip h-4 w-full animate-pulse" />
              <div className="bg-border-subtle rounded-chip h-4 w-full animate-pulse" />
              <div className="bg-border-subtle rounded-chip h-4 w-2/3 animate-pulse" />
            </div>

            {/* Read more button skeleton */}
            <div className="bg-border-subtle rounded-chip h-5 w-24 animate-pulse" />
          </article>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="mt-10 flex items-center justify-center gap-2">
        <div className="bg-border-subtle rounded-control h-9 w-9 animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-border-subtle rounded-control h-9 w-9 animate-pulse"
          />
        ))}
        <div className="bg-border-subtle rounded-control h-9 w-9 animate-pulse" />
      </div>
    </div>
  );
};

export default BlogCardsSkeleton;
