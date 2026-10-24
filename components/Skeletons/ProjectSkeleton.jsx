export const ProjectSkeleton = () => {
  return (
    <section className="container-page py-8">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb + Back Skeleton */}
        <div className="bg-border-subtle rounded-chip mb-3 h-3 w-28 animate-pulse" />
        <div className="mb-8 flex items-center gap-2">
          <div className="bg-border-subtle rounded-chip h-4 w-4 animate-pulse" />
          <div className="bg-border-subtle rounded-chip h-4 w-28 animate-pulse" />
        </div>

        {/* Title Skeleton */}
        <div className="bg-border-subtle rounded-control mb-5 h-9 w-3/4 max-w-sm animate-pulse" />

        {/* Meta row Skeleton: stack pills + CTA */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-border-subtle rounded-chip h-6 w-16 animate-pulse"
              />
            ))}
          </div>
          <div className="bg-border-subtle rounded-control h-9 w-32 shrink-0 animate-pulse" />
        </div>

        {/* Preview pane Skeleton */}
        <div className="border-border-subtle rounded-card mb-6 overflow-hidden border">
          <div className="border-border-subtle border-b px-4 py-2.5">
            <div className="bg-border-subtle rounded-chip h-3 w-20 animate-pulse" />
          </div>
          <div className="bg-border-subtle h-64 w-full animate-pulse sm:h-80 md:h-[400px]" />
        </div>

        {/* README pane Skeleton */}
        <div className="border-border-subtle rounded-card overflow-hidden border">
          <div className="border-border-subtle border-b px-4 py-2.5">
            <div className="bg-border-subtle rounded-chip h-3 w-24 animate-pulse" />
          </div>
          <div className="space-y-3 px-6 py-8">
            <div className="bg-border-subtle rounded-chip h-4 w-full animate-pulse" />
            <div className="bg-border-subtle rounded-chip h-4 w-full animate-pulse" />
            <div className="bg-border-subtle rounded-chip h-4 w-5/6 animate-pulse" />
            <div className="bg-border-subtle rounded-chip h-4 w-4/5 animate-pulse" />
          </div>
        </div>

        {/* Prev/next project nav Skeleton */}
        <div className="bg-border-subtle mt-10 h-px" />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className={`border-border-subtle rounded-card flex flex-col gap-2 border p-5 ${
                i === 0 ? "items-start" : "items-end"
              }`}
            >
              <div className="bg-border-subtle rounded-chip h-3 w-20 animate-pulse" />
              <div className="bg-border-subtle rounded-chip h-5 w-40 animate-pulse" />
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
