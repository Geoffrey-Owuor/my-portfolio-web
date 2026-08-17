/**
 * A loading skeleton component for the Projects section.
 * It mimics the layout of the Projects component and uses animate-pulse.
 */
const ProjectsSkeleton = () => {
  // We'll render 6 skeleton cards by default
  const skeletonCards = Array.from({ length: 6 });

  return (
    <section
      id="projects-skeleton"
      className="mx-auto min-h-screen w-full max-w-6xl px-4 py-24 md:px-8 2xl:max-w-7xl"
    >
      <div className="mx-auto">
        {/* Section Title Skeleton */}
        <div className="mx-auto mb-16 h-8 w-48 animate-pulse rounded-md bg-border-subtle"></div>

        {/* Responsive Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="border-border-subtle flex h-72 flex-col rounded-xl border p-6"
            >
              {/* Card Header Skeleton */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="h-6 w-3/5 animate-pulse rounded-md bg-border-subtle"></div>
                <div className="h-5 w-5 shrink-0 animate-pulse rounded-full bg-border-subtle"></div>
              </div>
              {/* Tech stack pills skeleton */}
              <div className="flex flex-wrap gap-1.5">
                <div className="h-5 w-14 animate-pulse rounded-full bg-border-subtle"></div>
                <div className="h-5 w-16 animate-pulse rounded-full bg-border-subtle"></div>
                <div className="h-5 w-12 animate-pulse rounded-full bg-border-subtle"></div>
              </div>
              {/* Card Description Skeleton */}
              <div className="mt-3 flex flex-1 flex-col gap-2">
                <div className="h-4 w-full animate-pulse rounded-md bg-border-subtle"></div>
                <div className="h-4 w-4/5 animate-pulse rounded-md bg-border-subtle"></div>
                <div className="h-4 w-2/5 animate-pulse rounded-md bg-border-subtle"></div>
              </div>
              {/* Footer skeleton */}
              <div className="border-border-subtle mt-4 border-t pt-4">
                <div className="h-4 w-28 animate-pulse rounded-md bg-border-subtle"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSkeleton;
