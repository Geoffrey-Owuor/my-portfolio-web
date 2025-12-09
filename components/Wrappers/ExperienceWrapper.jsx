"use client";
import { Briefcase, BriefcaseBusiness, Loader2 } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { SectionAlert } from "../Modules/SectionAlert";

const ExperienceWrapper = ({ experiences }) => {
  const [alertInfo, setAlertInfo] = useState({
    showAlert: false,
    alertType: "",
    alertMessage: "",
  });

  // Creating a ref for the section
  const experienceRef = useRef(null);

  // Check if section is in view
  const isInView = useInView(experienceRef, { once: true, amount: 0.2 });

  // Trigger Alert 2 seconds after the section comes into view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAlertInfo((prev) => ({
          ...prev,
          showAlert: true,
          alertType: "success",
          alertMessage: "Evolving with challenges, always moving forward 🧠",
        }));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Container variants for staggering timeline items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Timeline item animation - subtle slide from left
  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Dot icon animation
  const dotVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Shimmer effect for card background
  const shimmerVariants = {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <>
      {/* Render the alert component */}
      {alertInfo.showAlert && (
        <SectionAlert
          message={alertInfo.alertMessage}
          type={alertInfo.alertType}
          IconComponent={BriefcaseBusiness}
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
      <div className="mx-1 max-w-5xl md:mx-auto" ref={experienceRef}>
        {/* Section Title */}
        <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          My Work Experience
        </h2>

        {/* Vertical Timeline */}
        <motion.ol
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="relative border-l border-gray-200 dark:border-gray-700"
        >
          {experiences.map((exp, index) => (
            <motion.li
              key={exp.id}
              variants={itemVariants}
              className="mb-10 ml-6"
            >
              {/* The "dot" breakpoint with animation */}
              <motion.span
                variants={dotVariants}
                className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white dark:bg-gray-800 dark:ring-gray-950"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.3,
                  }}
                >
                  <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </motion.div>
              </motion.span>

              {/* Timeline Content with hover effect */}
              <motion.div
                whileHover={{
                  scale: 1.02,
                  x: 5,
                  transition: { duration: 0.2 },
                }}
                className="bg-gradient-classes group relative flex flex-col rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Animated border gradient on hover */}
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)",
                    backgroundSize: "200% 100%",
                  }}
                  variants={shimmerVariants}
                  animate="animate"
                />
                <motion.time
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.2 }}
                  className="mb-2 block text-sm leading-none font-normal text-gray-500 dark:text-gray-400"
                >
                  {exp.work_timeline}
                </motion.time>

                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  {exp.work_title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.4 }}
                  className="mb-3 text-base text-gray-700 italic dark:text-gray-300"
                >
                  {exp.company_name}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.5 }}
                  className="text-base font-normal text-gray-600 dark:text-gray-400"
                >
                  {exp.work_description}
                </motion.p>
              </motion.div>
            </motion.li>
          ))}
        </motion.ol>

        {experiences.length === 0 && (
          <div className="flex items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span>Waiting for connection...</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ExperienceWrapper;
