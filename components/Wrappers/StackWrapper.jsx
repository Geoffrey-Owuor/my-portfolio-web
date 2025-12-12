"use client";
import Image from "next/image";
import {
  Cpu,
  ListChecks,
  Loader2,
  MessageCircleCode,
  RailSymbol,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SectionAlert } from "../Modules/SectionAlert";

// Icons we want to invert their colors in dark mode
const iconsToInvert = [
  "awsLogo",
  "githubLogo",
  "nextjsLogo",
  "prismaLogo",
  "vercelLogo",
];

const StackWrapper = ({ toolNames, toolIcons }) => {
  const [alertInfo, setAlertInfo] = useState({
    showAlert: false,
    alertType: "",
    alertMessage: "",
  });

  // Creating a ref for the section
  const stackRef = useRef(null);

  // Check if section is in view
  const isInView = useInView(stackRef, { once: true, amount: 0.2 });

  // Trigger Alert 2 seconds after the section comes into view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAlertInfo((prev) => ({
          ...prev,
          showAlert: true,
          alertType: "success",
          alertMessage: "Innovating with cutting-edge tools and frameworks 💡",
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
        staggerChildren: 0.08,
      },
    },
  };

  // Logo card animation variants
  const logoVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotate: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Tool list item animation variants
  const listItemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
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
            IconComponent={MessageCircleCode}
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
      <div className="mx-1 md:mx-auto" ref={stackRef}>
        {/* Section Title - No animation */}
        <div className="mb-16 flex items-center justify-center gap-2 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          <span>My Tech Stack</span>
        </div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* --- Grid 1: Core Technology Icons --- */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 md:justify-start dark:text-gray-200"
            >
              <motion.div variants={iconVariants} animate="animate">
                <Cpu />
              </motion.div>
              <span>Core Technologies</span>
            </motion.div>

            {/* Logo Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-6"
            >
              {toolIcons.map(([name, iconSrc], index) => (
                <motion.div
                  key={name}
                  variants={logoVariants}
                  className="flex flex-col items-center justify-center gap-2"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.15,
                      rotate: 5,
                      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
                      transition: { duration: 0.3 },
                    }}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      y: {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.15,
                      },
                    }}
                    className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl bg-slate-100 p-4 shadow-sm dark:bg-gray-800"
                  >
                    <motion.div
                      whileHover={{
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 },
                      }}
                    >
                      <Image
                        src={iconSrc}
                        alt={name}
                        width={48}
                        height={48}
                        className={`h-12 w-12 object-contain ${iconsToInvert.includes(name) ? "dark:invert" : ""}`}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {toolIcons.length === 0 && (
              <div className="flex items-center gap-4 px-2 py-15">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span>Waiting for connection...</span>
              </div>
            )}
          </div>

          {/* --- Grid 2: Other Tools & Skills List --- */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 md:justify-start dark:text-gray-200"
            >
              <motion.div variants={iconVariants} animate="animate">
                <ListChecks />
              </motion.div>
              <span>Other Tools & Skills</span>
            </motion.div>

            {/* Tools List */}
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2"
            >
              {toolNames.map((tool, index) => (
                <motion.li
                  key={tool.id}
                  variants={listItemVariants}
                  whileHover={{
                    scale: 1.05,
                    x: 10,
                    transition: { duration: 0.2 },
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-100/50 p-4 text-base text-gray-700 hover:bg-slate-200/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
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
                    <RailSymbol className="h-5 w-5 shrink-0 text-gray-500" />
                  </motion.div>
                  <span>{tool.tool_name}</span>
                </motion.li>
              ))}
            </motion.ul>

            {toolNames.length === 0 && (
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

export default StackWrapper;
