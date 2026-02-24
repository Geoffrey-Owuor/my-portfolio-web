"use client";

import {
  Activity,
  Check,
  HeartHandshake,
  Loader2,
  Microchip,
  Sparkle,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SectionAlert } from "../Modules/SectionAlert";

const SkillsWrapper = ({ technicalSkills, softSkills }) => {
  const [alertInfo, setAlertInfo] = useState({
    showAlert: false,
    alertType: "",
    alertMessage: "",
  });

  // Creating a ref for the section
  const skillsRef = useRef(null);

  // Check if section is in view
  const isInView = useInView(skillsRef, { once: true, amount: 0.2 });

  // Trigger Alert 2 seconds after the section comes into view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAlertInfo((prev) => ({
          ...prev,
          showAlert: true,
          alertType: "success",
          alertMessage: "Some of the skills that I have picked along the way",
        }));
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

  // Icon pulse animation
  const iconVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      {/* Render the alert component */}
      <AnimatePresence>
        {alertInfo.showAlert && (
          <SectionAlert
            message={alertInfo.alertMessage}
            type={alertInfo.alertType}
            IconComponent={Sparkle}
            onClose={() =>
              setAlertInfo((prev) => ({
                ...prev,
                showAlert: false,
                alertType: "",
                alertMessage: "",
              }))
            }
          />
        )}
      </AnimatePresence>
      <div ref={skillsRef} className="mx-1 flex-1 md:mx-auto">
        {/* Section Title with floating animation */}
        <div className="mb-16 flex items-center justify-center gap-2 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          <span>My Skills</span>
        </div>

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
              <motion.div variants={iconVariants} animate="animate">
                <Microchip />
              </motion.div>
              <span>Technical Skills</span>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2"
            >
              {technicalSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.2 },
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100/50 p-4 text-gray-700 hover:bg-slate-200/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.2,
                    }}
                  >
                    <Activity className="h-4 w-4 shrink-0 text-gray-500" />
                  </motion.div>
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
              <motion.div variants={iconVariants} animate="animate">
                <HeartHandshake />
              </motion.div>
              <span>Soft Skills</span>
            </motion.div>

            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-col gap-3"
            >
              {softSkills.map((skill, index) => (
                <motion.li
                  key={skill.id}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.03,
                    x: 10,
                    transition: { duration: 0.2 },
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-100/50 p-4 text-base text-gray-700 hover:bg-slate-200/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    }}
                  >
                    <Check className="h-5 w-5 shrink-0 text-gray-500" />
                  </motion.div>
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
    </>
  );
};

export default SkillsWrapper;
