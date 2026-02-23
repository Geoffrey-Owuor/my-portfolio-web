import { Briefcase } from "lucide-react";

/**
 * A loading skeleton component for the Experience section.
 */
const ExperienceSkeleton = () => {
  // Render 3 skeleton items
  const skeletonItems = Array.from({ length: 3 });

  return (
    <section
      id="experience-skeleton"
      className="min-h-screen w-full px-4 py-24 md:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section Title Skeleton */}
        <div className="mx-auto mb-16 h-8 w-64 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>

        {/* Vertical Timeline Skeleton */}
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          {skeletonItems.map((_, index) => (
            <li key={index} className="mb-10 ml-6">
              {/* The "dot" breakpoint */}
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white dark:bg-gray-800 dark:ring-gray-950">
                <Briefcase className="h-4 w-4 text-gray-300 dark:text-gray-600" />
              </span>

              {/* Skeleton Content */}
              <div className="flex flex-col gap-3 rounded-xl bg-gray-100/50 p-6 shadow-sm dark:bg-gray-800/50">
                {/* Timeline */}
                <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                {/* Title */}
                <div className="h-6 w-1/2 animate-pulse rounded-md bg-gray-300 dark:bg-gray-600"></div>
                {/* Company */}
                <div className="h-5 w-1/3 animate-pulse rounded-md bg-gray-300 dark:bg-gray-600"></div>
                {/* Description */}
                <div className="h-4 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ExperienceSkeleton;
