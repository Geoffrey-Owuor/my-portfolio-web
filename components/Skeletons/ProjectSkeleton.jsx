export const ProjectSkeleton = () => {
  return (
    <section className="w-full px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb + Back Skeleton */}
        <div className="bg-border-subtle mb-3 h-3 w-28 animate-pulse rounded" />
        <div className="mb-8 flex items-center gap-2">
          <div className="bg-border-subtle h-4 w-4 animate-pulse rounded" />
          <div className="bg-border-subtle h-4 w-28 animate-pulse rounded" />
        </div>

        {/* Title Skeleton */}
        <div className="bg-border-subtle mb-5 h-9 w-3/4 max-w-sm animate-pulse rounded-lg" />

        {/* Meta row Skeleton: stack pills + CTA */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-border-subtle h-6 w-16 animate-pulse rounded-full"
              />
            ))}
          </div>
          <div className="bg-border-subtle h-9 w-32 shrink-0 animate-pulse rounded-md" />
        </div>

        {/* Preview pane Skeleton */}
        <div className="border-border-subtle mb-6 overflow-hidden rounded-xl border">
          <div className="border-border-subtle border-b px-4 py-2.5">
            <div className="bg-border-subtle h-3 w-20 animate-pulse rounded" />
          </div>
          <div className="bg-border-subtle h-64 w-full animate-pulse sm:h-80 md:h-[400px]" />
        </div>

        {/* README pane Skeleton */}
        <div className="border-border-subtle overflow-hidden rounded-xl border">
          <div className="border-border-subtle border-b px-4 py-2.5">
            <div className="bg-border-subtle h-3 w-24 animate-pulse rounded" />
          </div>
          <div className="space-y-3 px-6 py-8">
            <div className="bg-border-subtle h-4 w-full animate-pulse rounded" />
            <div className="bg-border-subtle h-4 w-full animate-pulse rounded" />
            <div className="bg-border-subtle h-4 w-5/6 animate-pulse rounded" />
            <div className="bg-border-subtle h-4 w-4/5 animate-pulse rounded" />
          </div>
        </div>

        {/* Prev/next project nav Skeleton */}
        <div className="bg-border-subtle mt-10 h-px" />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className={`border-border-subtle flex flex-col gap-2 rounded-xl border p-5 ${
                i === 0 ? "items-start" : "items-end"
              }`}
            >
              <div className="bg-border-subtle h-3 w-20 animate-pulse rounded" />
              <div className="bg-border-subtle h-5 w-40 animate-pulse rounded" />
              <div className="flex gap-1.5">
                <div className="bg-border-subtle h-6 w-16 animate-pulse rounded-full" />
                <div className="bg-border-subtle h-6 w-16 animate-pulse rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
