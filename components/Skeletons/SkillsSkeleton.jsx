import { HeartHandshake, Microchip } from "lucide-react";

/**
 * A loading skeleton component for the Skills section.
 * It mimics the layout of the Skills component and uses animate-pulse.
 */
const SkillsSkeleton = () => {
  return (
    <section
      id="skills-skeleton"
      className="w-full bg-white px-4 py-20 md:px-8 md:py-32 dark:bg-gray-950"
    >
      <div className="mx-auto">
        {/* Section Title Skeleton */}
        <div className="mx-auto mb-16 h-8 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* --- Technical Skills (Left) --- */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-center gap-2 md:justify-start">
              <Microchip className="text-gray-300 dark:text-gray-600" />
              <div className="h-6 w-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
              {/* Create 6 dummy skill blocks */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-xl bg-gray-100 p-4 dark:bg-gray-800"
                >
                  <div className="h-4 w-4 shrink-0 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-4 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-600"></div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Soft Skills (Right) --- */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-center gap-2 md:justify-start">
              <HeartHandshake className="text-gray-300 dark:text-gray-600" />
              <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <ul className="flex flex-col gap-3">
              {/* Create 4 dummy skill list items */}
              {Array.from({ length: 4 }).map((_, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 rounded-xl bg-gray-100/50 p-4 dark:bg-gray-800/50"
                >
                  <div className="h-5 w-5 shrink-0 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-5 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-600"></div>
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
