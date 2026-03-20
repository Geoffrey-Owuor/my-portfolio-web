"use client";
import Image from "next/image";
import {
  Blocks,
  Code,
  Layers2,
  Loader2,
  MessageCircleCode,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAlertStore } from "@/store/useAlertStore";
import SectionTitle from "./SectionTitle";

// Icons we want to invert their colors in dark mode
const iconsToInvert = [
  "awsLogo",
  "githubLogo",
  "nextjsLogo",
  "prismaLogo",
  "vercelLogo",
];

const StackWrapper = ({ toolNames, toolIcons }) => {
  // Creating a ref for the section
  const stackRef = useRef(null);

  // Check if section is in view
  const isInView = useInView(stackRef, { once: true, amount: 0.2 });

  // Our add alert function
  const addAlert = useAlertStore((state) => state.addAlert);

  // Trigger Alert 2 seconds after the section comes into view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        addAlert({
          message: "Innovating with cutting-edge tools and frameworks",
          type: "success",
          iconComponent: MessageCircleCode,
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

  return (
    <div className="mx-1 flex-1 md:mx-auto" ref={stackRef}>
      {/* Section Title  */}
      <SectionTitle
        label="Tools & technologies I work with"
        title="My Tech Stack"
      />

      {/* Two-Column Grid Layout */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        {/* --- Grid 1: Core Technology Icons --- */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 md:justify-start dark:text-gray-200"
          >
            <Code />

            <span>Core Technologies</span>
          </motion.div>

          {/* Logo Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-6"
          >
            {toolIcons.map(([name, iconSrc], _index) => (
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
                  className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl bg-slate-100/50 p-4 shadow-sm dark:bg-gray-800/50"
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
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 md:justify-start dark:text-gray-200"
          >
            <Blocks />

            <span>Other Tools & Skills</span>
          </motion.div>

          {/* Tools List */}
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap items-center gap-4"
          >
            {toolNames.map((tool, index) => (
              <motion.li
                key={tool.id}
                variants={listItemVariants}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 },
                }}
                className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-100/50 px-4 py-3 text-base text-gray-700 hover:bg-slate-200/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
              >
                <Layers2 className="h-5 w-5 shrink-0 text-gray-500" />

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
  );
};

export default StackWrapper;
