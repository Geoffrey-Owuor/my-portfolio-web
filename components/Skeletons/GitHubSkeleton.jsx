/**
 * A loading skeleton component for the GitHub section.
 * It mimics the layout of the GitHub component and uses animate-pulse.
 */
const GitHubSkeleton = () => {
  return (
    <section
      id="activity-skeleton"
      className="min-h-app mx-auto w-full max-w-7xl px-4 py-24"
    >
      <div className="mx-auto">
        {/* Section Title Skeleton */}
        <div className="bg-border-subtle mx-auto mb-16 h-8 w-48 animate-pulse rounded-md"></div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile + languages column */}
          <div className="flex flex-col gap-6">
            <div className="border-border-subtle flex flex-col items-center rounded-xl border p-6">
              <div className="bg-border-subtle h-28 w-28 animate-pulse rounded-full"></div>
              <div className="bg-border-subtle mt-4 h-5 w-40 animate-pulse rounded-md"></div>
              <div className="bg-border-subtle mt-2 h-4 w-28 animate-pulse rounded-md"></div>
              <div className="bg-border-subtle mt-4 h-4 w-48 animate-pulse rounded-md"></div>
              <div className="bg-border-subtle mt-5 h-9 w-36 animate-pulse rounded-lg"></div>
            </div>
            <div className="border-border-subtle rounded-xl border p-6">
              <div className="bg-border-subtle h-2.5 w-full animate-pulse rounded-full"></div>
              <div className="mt-4 flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-border-subtle h-4 w-full animate-pulse rounded-md"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Contributions + repos column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="border-border-subtle rounded-xl border p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-border-subtle h-16 animate-pulse rounded-lg"
                  ></div>
                ))}
              </div>
              <div className="bg-border-subtle mt-6 h-28 w-full animate-pulse rounded-md"></div>
            </div>
            <div className="border-border-subtle grid grid-cols-1 gap-3 rounded-xl border p-6 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-border-subtle h-24 animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubSkeleton;
