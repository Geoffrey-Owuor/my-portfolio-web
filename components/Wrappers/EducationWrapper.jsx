"use client";
import { GraduationCap, School } from "lucide-react";
import { useState } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkDown from "react-markdown";
import ShowMoreButtons from "./ShowMoreButtons";
import SectionTitle from "./SectionTitle";
import EmptyState from "../Modules/EmptyState";
import ScrollReveal from "../Modules/ScrollReveal";

const EducationWrapper = ({ educationData }) => {
  // Number of experiences we see on mount
  const [visibleCount, setVisibleCount] = useState(1);

  // Derived states for button visibility logic
  const visibleEducationData = (educationData ?? []).slice(0, visibleCount);
  const canShowMore = visibleCount < (educationData?.length ?? 0);
  const canShowLess = visibleCount > 1;

  // Handle show more and show less
  const handleShowMore = () =>
    setVisibleCount((prev) => Math.min(prev + 1, educationData.length));
  const handleShowLess = () => setVisibleCount((prev) => Math.max(prev - 1, 1));

  return (
    <div className="mx-1 w-full max-w-5xl min-w-0 flex-1 md:mx-auto">
      {/* Section Title */}
      <SectionTitle
        sectionId="education"
        title="My Education"
        subtitle="How I got here"
        alertMessage="Always learning, always figuring things out"
        alertIcon={School}
      />

      {/* Vertical Timeline */}
      <ScrollReveal>
        <ol className="border-border-subtle relative md:border-l">
          {visibleEducationData.map((education, _index) => (
            <li key={education.id} className="mb-10 md:ml-6">
              {/* The "dot" breakpoint with animation */}
              <span className="bg-surface-raised ring-surface absolute -left-3 hidden h-6 w-6 items-center justify-center rounded-full ring-8 md:flex">
                <GraduationCap className="text-text-muted h-4 w-4" />
              </span>

              {/* Timeline Content with hover effect */}
              <div className="border-border-subtle hover:border-accent group relative flex flex-col rounded-xl border p-6 transition-colors duration-150">
                <time className="text-text-muted mb-2 block font-mono text-sm leading-none">
                  {education.timeline}
                </time>

                <h3 className="text-text-primary text-xl font-semibold">
                  {education.learning_title}
                </h3>

                <p className="text-text-muted mb-3 font-mono text-base italic">
                  {education.institution}
                </p>

                <div className="prose prose-gray dark:prose-invert text-text-muted max-w-none text-base font-normal">
                  <ReactMarkDown remarkPlugins={[remarkGfm]}>
                    {education.learning_description}
                  </ReactMarkDown>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </ScrollReveal>

      {!educationData?.length && (
        <EmptyState
          command="cat education.md"
          failed={!educationData}
          emptyMessage="No education entries yet."
        />
      )}

      {/* Show more buttons*/}
      <ShowMoreButtons
        canShowMore={canShowMore}
        canShowLess={canShowLess}
        handleShowMore={handleShowMore}
        handleShowLess={handleShowLess}
      />
    </div>
  );
};

export default EducationWrapper;
