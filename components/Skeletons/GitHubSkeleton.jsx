import SectionTitleSkeleton from "./SectionTitleSkeleton";
/**
 * A loading skeleton component for the GitHub section.
 * It mimics the layout of the GitHub component and uses animate-pulse.
 */
const GitHubSkeleton = () => {
  return (
    <section id="activity-skeleton" className="section-shell">
      <div>
        <SectionTitleSkeleton />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile + languages column */}
          <div className="flex flex-col gap-6">
            <div className="border-border-subtle rounded-card flex flex-col items-center border p-6">
              <div className="bg-border-subtle h-28 w-28 animate-pulse rounded-full"></div>
              <div className="bg-border-subtle rounded-chip mt-4 h-5 w-40 animate-pulse"></div>
              <div className="bg-border-subtle rounded-chip mt-2 h-4 w-28 animate-pulse"></div>
              <div className="bg-border-subtle rounded-chip mt-4 h-4 w-48 animate-pulse"></div>
              <div className="bg-border-subtle rounded-control mt-5 h-9 w-36 animate-pulse"></div>
            </div>
            <div className="border-border-subtle rounded-card border p-6">
              <div className="bg-border-subtle h-2.5 w-full animate-pulse rounded-full"></div>
              <div className="mt-4 flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-border-subtle rounded-chip h-4 w-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Contributions + repos column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="border-border-subtle rounded-card border p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-border-subtle rounded-card h-16 animate-pulse"
                  ></div>
                ))}
              </div>
              <div className="bg-border-subtle rounded-card mt-6 h-28 w-full animate-pulse"></div>
            </div>
            <div className="border-border-subtle rounded-card grid grid-cols-1 gap-3 border p-6 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-border-subtle rounded-card h-24 animate-pulse"
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
