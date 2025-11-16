import { Cpu, RailSymbol } from "lucide-react";

/**
 * A loading skeleton component for the Stack section.
 * It mimics the layout of the Stack component and uses animate-pulse.
 */
const StackSkeleton = () => {
  return (
    <section
      id="stack-skeleton"
      className="w-full bg-white px-4 py-20 md:px-8 md:py-32 dark:bg-gray-950"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Title Skeleton */}
        <div className="mx-auto mb-16 h-8 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* --- Grid 1: Core Technology Icons --- */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-center gap-2 md:justify-start">
              <Cpu className="text-gray-300 dark:text-gray-600" />
              <div className="h-6 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
            {/* Logo Grid */}
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 sm:gap-6">
              {/* Create 15 dummy icon blocks */}
              {Array.from({ length: 15 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center gap-2"
                >
                  <div className="h-20 w-20 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"></div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Grid 2: Other Tools & Skills List --- */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-center gap-2 md:justify-start">
              <RailSymbol className="text-gray-300 dark:text-gray-600" />
              <div className="h-6 w-52 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
            {/* Tools List */}
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Create 8 dummy tool name blocks */}
              {Array.from({ length: 8 }).map((_, index) => (
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

export default StackSkeleton;
