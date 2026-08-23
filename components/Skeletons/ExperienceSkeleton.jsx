import { Briefcase } from "lucide-react";

/**
 * A loading skeleton component for the Experience section.
 */
const ExperienceSkeleton = () => {
  // Render 3 skeleton items
  const skeletonItems = Array.from({ length: 3 });

  return (
    <section id="experience-skeleton" className="min-h-app w-full px-4 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Section Title Skeleton */}
        <div className="bg-border-subtle mx-auto mb-16 h-8 w-64 animate-pulse rounded-md"></div>

        {/* Vertical Timeline Skeleton */}
        <ol className="border-border-subtle relative border-l">
          {skeletonItems.map((_, index) => (
            <li key={index} className="mb-10 ml-6">
              {/* The "dot" breakpoint */}
              <span className="bg-surface-raised ring-surface absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-8">
                <Briefcase className="text-text-muted h-4 w-4" />
              </span>

              {/* Skeleton Content */}
              <div className="border-border-subtle flex flex-col gap-3 rounded-xl border p-6">
                {/* Timeline */}
                <div className="bg-border-subtle h-4 w-24 animate-pulse rounded-md"></div>
                {/* Title */}
                <div className="bg-border-subtle h-6 w-1/2 animate-pulse rounded-md"></div>
                {/* Company */}
                <div className="bg-border-subtle h-5 w-1/3 animate-pulse rounded-md"></div>
                {/* Description */}
                <div className="bg-border-subtle h-4 w-full animate-pulse rounded-md"></div>
                <div className="bg-border-subtle h-4 w-3/4 animate-pulse rounded-md"></div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ExperienceSkeleton;
