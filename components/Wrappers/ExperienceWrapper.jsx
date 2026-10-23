"use client";
import { Briefcase, BriefcaseBusiness, Loader2 } from "lucide-react";
import { useState } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkDown from "react-markdown";
import ShowMoreButtons from "./ShowMoreButtons";
import SectionTitle from "./SectionTitle";
import ScrollReveal from "../Modules/ScrollReveal";

const ExperienceWrapper = ({ experiences }) => {
  // Number of experiences we see on mount
  const [visibleCount, setVisibleCount] = useState(1);

  // Derived states for button visibility logic
  const visibleExperiences = experiences.slice(0, visibleCount);
  const canShowMore = visibleCount < experiences.length;
  const canShowLess = visibleCount > 1;

  // Handle show more and show less
  const handleShowMore = () =>
    setVisibleCount((prev) => Math.min(prev + 1, experiences.length));
  const handleShowLess = () => setVisibleCount((prev) => Math.max(prev - 1, 1));

  return (
    <div className="mx-1 w-full max-w-5xl min-w-0 flex-1 md:mx-auto">
      {/* Section Title */}
      <SectionTitle
        sectionId="experience"
        title="My Experience"
        subtitle="Where i've been"
        alertMessage="Evolving with challenges, always moving forward"
        alertIcon={BriefcaseBusiness}
      />

      {/* Vertical Timeline */}
      <ScrollReveal>
        <ol className="border-border-subtle relative md:border-l">
          {visibleExperiences.map((exp, _index) => (
            <li key={exp.id} className="mb-10 md:ml-6">
              {/* The "dot" breakpoint with animation */}
              <span className="bg-surface-raised ring-surface absolute -left-3 hidden h-6 w-6 items-center justify-center rounded-full ring-8 md:flex">
                <Briefcase className="text-text-muted h-4 w-4" />
              </span>

              {/* Timeline Content with hover effect */}
              <div className="border-border-subtle hover:border-accent group relative flex flex-col rounded-xl border p-6 transition-colors duration-150">
                <time className="text-text-muted mb-2 block font-mono text-sm leading-none">
                  {exp.work_timeline}
                </time>

                <h3 className="text-text-primary text-xl font-semibold">
                  {exp.work_title}
                </h3>

                <p className="text-text-muted mb-3 font-mono text-base italic">
                  {exp.company_name}
                </p>

                <div className="prose prose-gray dark:prose-invert text-text-muted max-w-none text-base font-normal">
                  <ReactMarkDown remarkPlugins={[remarkGfm]}>
                    {exp.work_description}
                  </ReactMarkDown>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </ScrollReveal>

      {experiences.length === 0 && (
        <div className="flex items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Waiting for connection...</span>
        </div>
      )}

      {/* Show more buttons */}
      <ShowMoreButtons
        canShowLess={canShowLess}
        canShowMore={canShowMore}
        handleShowMore={handleShowMore}
        handleShowLess={handleShowLess}
      />
    </div>
  );
};

export default ExperienceWrapper;
