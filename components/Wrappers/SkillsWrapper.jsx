"use client";

import {
  BadgeCheck,
  HeartHandshake,
  Loader2,
  Sparkle,
  Terminal,
} from "lucide-react";
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
          message: "Some of the skills that I have picked along the way",
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
        staggerChildren: 0.1,
      },
    },
  };

  // Individual skill card animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div ref={skillsRef} className="mx-1 flex-1 md:mx-auto">
      {/* Section Title */}
      <SectionTitle label="What I bring to the table" title="My Skills" />

      {/* Two-Column Grid Layout */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        {/* --- Technical Skills (Left) --- */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 md:justify-start dark:text-gray-200"
          >
            <Terminal />

            <span>Technical Skills</span>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap items-center gap-4 rounded-xl border-[1.5px] border-dashed border-gray-300 p-4 dark:border-gray-700"
          >
            {technicalSkills.map((skill, _index) => (
              <motion.div
                key={skill.id}
                variants={cardVariants}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 },
                }}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100/50 px-4 py-3 text-gray-700 hover:bg-slate-200/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
              >
                <BadgeCheck className="h-4 w-4 shrink-0 text-gray-500" />

                <span>{skill.skill_description}</span>
              </motion.div>
            ))}
          </motion.div>

          {technicalSkills.length === 0 && (
            <div className="flex items-center gap-4 px-2 py-15">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span>Waiting for connection...</span>
            </div>
          )}
        </div>

        {/* --- Soft Skills (Right) --- */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 md:justify-start dark:text-gray-200"
          >
            <HeartHandshake />

            <span>Soft Skills</span>
          </motion.div>

          <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-4"
          >
            {softSkills.map((skill, index) => (
              <motion.li
                key={skill.id}
                variants={cardVariants}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 },
                }}
                className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-100/50 px-4 py-3 text-base text-gray-700 hover:bg-slate-200/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
              >
                <span className="font-dm-mono inline-block w-8 text-right text-gray-500">
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <span>{skill.skill_description}</span>
              </motion.li>
            ))}
          </motion.ul>

          {softSkills.length === 0 && (
            <div className="flex items-center gap-4 px-2 py-15">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span>Waiting for connection...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsWrapper;
