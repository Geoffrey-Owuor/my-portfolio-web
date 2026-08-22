import { HeartHandshake } from "lucide-react";

/**
 * A loading skeleton component for the Skills section.
 * It mimics the layout of the Skills component and uses animate-pulse.
 */
const SkillsSkeleton = () => {
  return (
    <section
      id="skills-skeleton"
      className="mx-auto min-h-app w-full max-w-6xl px-4 py-24 md:px-8 2xl:max-w-7xl"
    >
      <div className="mx-auto">
        {/* Section Title Skeleton */}
        <div className="mx-auto mb-16 h-8 w-48 animate-pulse rounded-md bg-border-subtle"></div>

        {/* Technical Skills terminal panel skeleton */}
        <div className="border-border-subtle mx-auto w-full max-w-4xl overflow-hidden rounded-lg border">
          <div className="border-border-subtle bg-surface-raised/50 flex items-center gap-2 border-b px-4 py-3">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-border-subtle"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-border-subtle"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-border-subtle"></span>
            </span>
            <div className="ml-2 h-3 w-32 animate-pulse rounded-md bg-border-subtle"></div>
          </div>
          <div className="divide-border-subtle grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {[0, 1].map((col) => (
              <div key={col} className="divide-border-subtle divide-y">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 px-5 py-3">
                    <div className="h-3 w-4 animate-pulse rounded-md bg-border-subtle"></div>
                    <div className="h-4 w-full animate-pulse rounded-md bg-border-subtle"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills strip skeleton */}
        <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col items-center gap-3 sm:flex-row sm:items-start">
          <span className="text-text-muted flex shrink-0 items-center gap-1.5 pt-0.5 text-xs tracking-wide uppercase">
            <HeartHandshake className="h-3.5 w-3.5" />
            Also brings
          </span>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-6 w-20 animate-pulse rounded-full bg-border-subtle"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSkeleton;
