export const ProjectSkeleton = () => {
  return (
    <section className="w-full px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb + Back Skeleton */}
        <div className="mb-3 h-3 w-28 animate-pulse rounded bg-border-subtle" />
        <div className="mb-8 flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-border-subtle" />
          <div className="h-4 w-28 animate-pulse rounded bg-border-subtle" />
        </div>

        {/* Title Skeleton */}
        <div className="mb-5 h-9 w-3/4 max-w-sm animate-pulse rounded-lg bg-border-subtle" />

        {/* Meta row Skeleton: stack pills + CTA */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-16 animate-pulse rounded-full bg-border-subtle"
              />
            ))}
          </div>
          <div className="h-9 w-32 shrink-0 animate-pulse rounded-md bg-border-subtle" />
        </div>

        {/* Preview pane Skeleton */}
        <div className="border-border-subtle mb-6 overflow-hidden rounded-xl border">
          <div className="border-border-subtle border-b px-4 py-2.5">
            <div className="h-3 w-20 animate-pulse rounded bg-border-subtle" />
          </div>
          <div className="bg-border-subtle h-64 w-full animate-pulse sm:h-80 md:h-[400px]" />
        </div>

        {/* README pane Skeleton */}
        <div className="border-border-subtle overflow-hidden rounded-xl border">
          <div className="border-border-subtle border-b px-4 py-2.5">
            <div className="h-3 w-24 animate-pulse rounded bg-border-subtle" />
          </div>
          <div className="space-y-3 px-6 py-8">
            <div className="h-4 w-full animate-pulse rounded bg-border-subtle" />
            <div className="h-4 w-full animate-pulse rounded bg-border-subtle" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-border-subtle" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-border-subtle" />
          </div>
        </div>
      </div>
    </section>
  );
};
