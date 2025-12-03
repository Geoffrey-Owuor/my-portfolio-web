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
      className="containerizing min-h-screen w-full px-4 py-20 md:px-8 md:py-32"
    >
      <div className="mx-auto">
        {/* Section Title Skeleton */}
        <div className="mx-auto mb-16 h-8 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>

        {/* Responsive Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="flex h-88 flex-col rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800"
            >
              <div className="flex h-full flex-col justify-between p-6">
                <div>
                  {/* Card Header Skeleton */}
                  <div className="mb-4 flex items-center justify-between">
                    {/* Project Name */}
                    <div className="h-6 w-3/5 animate-pulse rounded-md bg-gray-300 dark:bg-gray-600"></div>
                    {/* Icon */}
                    <div className="h-5 w-5 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                  {/* Card Description Skeleton */}
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-4 w-4/5 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSkeleton;
