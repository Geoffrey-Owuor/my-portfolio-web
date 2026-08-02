import { HeartHandshake, Microchip } from "lucide-react";

/**
 * A loading skeleton component for the Skills section.
 * It mimics the layout of the Skills component and uses animate-pulse.
 */
const SkillsSkeleton = () => {
  return (
    <section
      id="skills-skeleton"
      className="mx-auto min-h-screen w-full max-w-6xl px-4 py-24 md:px-8 2xl:max-w-7xl"
    >
      <div className="mx-auto">
        {/* Section Title Skeleton */}
        <div className="mx-auto mb-16 h-8 w-48 animate-pulse rounded-md bg-border-subtle"></div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* --- Technical Skills (Left) --- */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-center gap-2 md:justify-start">
              <Microchip className="text-text-muted" />
              <div className="h-6 w-40 animate-pulse rounded-md bg-border-subtle"></div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
              {/* Create 6 dummy skill blocks */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-surface-raised flex items-center gap-2 rounded-xl p-4"
                >
                  <div className="h-4 w-4 shrink-0 animate-pulse rounded-full bg-border-subtle"></div>
                  <div className="h-4 w-full animate-pulse rounded-md bg-border-subtle"></div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Soft Skills (Right) --- */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-center gap-2 md:justify-start">
              <HeartHandshake className="text-text-muted" />
              <div className="h-6 w-32 animate-pulse rounded-md bg-border-subtle"></div>
            </div>
            <ul className="flex flex-col gap-3">
              {/* Create 4 dummy skill list items */}
              {Array.from({ length: 4 }).map((_, index) => (
                <li
                  key={index}
                  className="bg-surface-raised flex items-center gap-3 rounded-xl p-4"
                >
                  <div className="h-5 w-5 shrink-0 animate-pulse rounded-full bg-border-subtle"></div>
                  <div className="h-5 w-full animate-pulse rounded-md bg-border-subtle"></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSkeleton;
