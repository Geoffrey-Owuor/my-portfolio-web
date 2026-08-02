"use client";
import { GraduationCap, Loader2, School } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAlertStore } from "@/store/useAlertStore";
import remarkGfm from "remark-gfm";
import ReactMarkDown from "react-markdown";
import ShowMoreButtons from "./ShowMoreButtons";
import SectionTitle from "./SectionTitle";

const EducationWrapper = ({ educationData }) => {
  // Number of experiences we see on mount
  const [visibleCount, setVisibleCount] = useState(1);

  // Derived states for button visibility logic
  const visibleEducationData = educationData.slice(0, visibleCount);
  const canShowMore = visibleCount < educationData.length;
  const canShowLess = visibleCount > 1;

  // Handle show more and show less
  const handleShowMore = () =>
    setVisibleCount((prev) => Math.min(prev + 1, educationData.length));
  const handleShowLess = () => setVisibleCount((prev) => Math.max(prev - 1, 1));

  // Creating a ref for the section
  const educationRef = useRef(null);

  // Check if section is in view
  const isInView = useInView(educationRef, { once: true, amount: 0.2 });

  // Our add alert function
  const addAlert = useAlertStore((state) => state.addAlert);

  // Trigger Alert 2 seconds after the section comes into view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        addAlert({
          message: "Educated enough to pretend I know what I'm doing",
          type: "success",
          iconComponent: School,
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <div className="mx-1 max-w-5xl flex-1 md:mx-auto" ref={educationRef}>
      {/* Section Title */}
      <SectionTitle label="How I got here" title="My Education" />

      {/* Vertical Timeline */}
      <ol className="border-border-subtle relative border-l">
        {visibleEducationData.map((education, _index) => (
          <li key={education.id} className="mb-10 ml-6">
            {/* The "dot" breakpoint with animation */}
            <span className="bg-surface-raised ring-surface absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-8">
              <GraduationCap className="text-text-muted h-4 w-4" />
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
                {education.timeline}
              </motion.time>

              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-text-primary text-xl font-semibold"
              >
                {education.learning_title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="font-dm-mono text-text-muted mb-3 text-base italic"
              >
                {education.institution}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="prose prose-gray dark:prose-invert text-text-muted max-w-none text-base font-normal"
              >
                <ReactMarkDown remarkPlugins={[remarkGfm]}>
                  {education.learning_description}
                </ReactMarkDown>
              </motion.div>
            </div>
          </li>
        ))}
      </ol>

      {educationData.length === 0 && (
        <div className="flex items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Waiting for connection...</span>
        </div>
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
