import { Layers2 } from "lucide-react";

/**
 * A loading skeleton component for the Stack section.
 * It mimics the layout of the Stack component and uses animate-pulse.
 */
const StackSkeleton = () => {
  return (
    <section
      id="stack-skeleton"
      className="mx-auto min-h-screen w-full max-w-6xl px-4 py-24 md:px-8 2xl:max-w-7xl"
    >
      <div className="mx-auto">
        {/* Section Title Skeleton */}
        <div className="mx-auto mb-16 h-8 w-48 animate-pulse rounded-md bg-border-subtle"></div>

        {/* Core Technologies marquee skeleton */}
        <div className="border-border-subtle mx-auto flex w-full max-w-4xl items-center justify-center gap-10 overflow-hidden rounded-lg border py-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-10 shrink-0 animate-pulse rounded-md bg-border-subtle"
            ></div>
          ))}
        </div>

        {/* Other Tools strip skeleton */}
        <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col items-center gap-3 sm:flex-row sm:items-start">
          <span className="text-text-muted flex shrink-0 items-center gap-1.5 pt-0.5 text-xs tracking-wide uppercase">
            <Layers2 className="h-3.5 w-3.5" />
            Also using
          </span>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {Array.from({ length: 6 }).map((_, index) => (
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

export default StackSkeleton;
