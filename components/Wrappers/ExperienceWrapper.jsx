"use client";
import { Briefcase, BriefcaseBusiness, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkDown from "react-markdown";
import ShowMoreButtons from "./ShowMoreButtons";
import SectionTitle from "./SectionTitle";

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
    <div className="mx-1 max-w-5xl min-w-0 flex-1 md:mx-auto">
      {/* Section Title */}
      <SectionTitle
        label="Where i've been"
        title="My Experience"
        alertMessage="Evolving with challenges, always moving forward"
        alertIcon={BriefcaseBusiness}
      />

      {/* Vertical Timeline */}
      <ol className="border-border-subtle relative border-l">
        {visibleExperiences.map((exp, _index) => (
          <li key={exp.id} className="mb-10 ml-6">
            {/* The "dot" breakpoint with animation */}
            <span className="bg-surface-raised ring-surface absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-8">
              <Briefcase className="text-text-muted h-4 w-4" />
            </span>

            {/* Timeline Content with hover effect */}
            <div className="border-border-subtle hover:border-accent group relative flex flex-col rounded-xl border p-6 transition-colors duration-150">
              <motion.time
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="font-dm-mono text-text-muted mb-2 block text-sm leading-none"
              >
                {exp.work_timeline}
              </motion.time>

              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-text-primary text-xl font-semibold"
              >
                {exp.work_title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="font-dm-mono text-text-muted mb-3 text-base italic"
              >
                {exp.company_name}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="prose prose-gray dark:prose-invert text-text-muted max-w-none text-base font-normal"
              >
                <ReactMarkDown remarkPlugins={[remarkGfm]}>
                  {exp.work_description}
                </ReactMarkDown>
              </motion.div>
            </div>
          </li>
        ))}
      </ol>

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
