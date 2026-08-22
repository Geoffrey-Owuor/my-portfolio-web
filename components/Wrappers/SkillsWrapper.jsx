"use client";

import { HeartHandshake, Loader2, Sparkle } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { useAlertStore } from "@/store/useAlertStore";
import SectionTitle from "./SectionTitle";

const SkillsWrapper = ({ technicalSkills, softSkills }) => {
  // Creating a ref for the section
  const skillsRef = useRef(null);

  // Check if section is in view
  const isInView = useInView(skillsRef, { once: true, amount: 0.2 });

  // Our add alert function
  const addAlert = useAlertStore((state) => state.addAlert);

  // Trigger Alert 2 seconds after the section comes into view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        addAlert({
          message: "Applying technical skills to real-world problems",
          type: "success",
          iconComponent: Sparkle,
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  // Individual row animation variants
  const rowVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div ref={skillsRef} className="mx-1 min-w-0 flex-1 md:mx-auto">
      {/* Section Title */}
      <SectionTitle label="What I bring to the table" title="My Skills" />

      {/* --- Technical Skills: dominant terminal panel --- */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="font-dm-mono border-border-subtle bg-surface mx-auto w-full max-w-4xl overflow-hidden rounded-lg border"
      >
        {/* Terminal chrome header */}
        <div className="border-border-subtle bg-surface-raised/50 flex items-center gap-2 border-b px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="bg-danger/60 h-2.5 w-2.5 rounded-full" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <span className="bg-success/60 h-2.5 w-2.5 rounded-full" />
          </span>
          <span className="text-text-muted ml-2 text-xs">
            ~/skills --technical
          </span>
        </div>

        {/* Skill rows */}
        {technicalSkills.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="divide-border-subtle grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0"
          >
            {[0, 1].map((col) => (
              <div key={col} className="divide-border-subtle divide-y">
                {technicalSkills.map((skill, index) => {
                  if (index % 2 !== col) return null;
                  return (
                    <motion.div
                      key={skill.id}
                      variants={rowVariants}
                      className="hover:bg-surface-raised group flex items-center gap-3 px-5 py-3 transition-colors duration-150"
                    >
                      <span className="text-accent/70 text-xs tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-text-primary group-hover:text-accent text-sm transition-colors duration-150">
                        {skill.skill_description}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        )}

        {technicalSkills.length === 0 && (
          <div className="flex items-center gap-4 px-5 py-10">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-text-muted text-sm">
              Waiting for connection...
            </span>
          </div>
        )}
      </motion.div>

      {/* --- Soft Skills: quiet, additive strip --- */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mx-auto mt-8 flex w-full max-w-4xl flex-col items-center gap-3 sm:flex-row sm:items-start"
      >
        <span className="text-text-muted flex shrink-0 items-center gap-1.5 pt-0.5 text-xs font-semibold tracking-wide uppercase">
          <HeartHandshake className="h-3.5 w-3.5" />
          Also brings
        </span>

        {softSkills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {softSkills.map((skill) => (
              <span
                key={skill.id}
                className="border-border-subtle text-text-muted rounded-lg border px-3 py-1 text-sm"
              >
                {skill.skill_description}
              </span>
            ))}
          </div>
        )}

        {softSkills.length === 0 && (
          <div className="flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-text-muted text-xs">
              Waiting for connection...
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SkillsWrapper;
