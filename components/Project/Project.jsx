"use client";

import { motion, AnimatePresence } from "framer-motion";
import LoadingLine from "../Modules/LoadingLine";
import { useState } from "react";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Project = ({ projectInfo }) => {
  const router = useRouter();
  const project = projectInfo[0];
  const [isNavigating, setIsNavigating] = useState(false);

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Content animation variants
  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Button variants
  const buttonVariants = {
    rest: {
      scale: 1,
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  // Icon animation
  const iconVariants = {
    rest: {
      x: 0,
      rotate: 0,
    },
    hover: {
      x: 5,
      rotate: -15,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const handleGoBack = () => {
    setIsNavigating(true);
    router.push("/#projects");
  };

  if (!project || Object.keys(project).length === 0) {
    return (
      <div className="mx-auto mt-10 flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Project Not Found
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>{isNavigating && <LoadingLine />}</AnimatePresence>
      <section className="w-full px-4 py-20 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl"
        >
          {/* Back Button */}
          <motion.button
            variants={contentVariants}
            onClick={handleGoBack}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="mb-8 flex cursor-pointer items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <motion.div
              variants={{
                rest: { x: 0 },
                hover: { x: -5, transition: { duration: 0.3 } },
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.div>
            <span className="font-medium">Go Back</span>
          </motion.button>

          {/* Project Header */}
          <motion.div
            variants={contentVariants}
            className="mb-8 rounded-xl bg-linear-to-br from-purple-50 via-blue-50 to-blue-100 p-8 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950"
          >
            <motion.h1
              className="mb-4 text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl dark:text-white"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundImage:
                  "linear-gradient(90deg, currentColor 0%, #3b82f6 25%, #8b5cf6 50%, #ec4899 75%, currentColor 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              {project.project_name}
            </motion.h1>

            {/* Project Link */}
            {project.project_link && (
              <motion.a
                href={project.project_link}
                target="_blank"
                rel="noopener noreferrer"
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
              >
                <span>Visit Project</span>
                <motion.div variants={iconVariants}>
                  <ExternalLink className="h-5 w-5" />
                </motion.div>
              </motion.a>
            )}
          </motion.div>

          {/* Project Description */}
          <motion.div
            variants={contentVariants}
            className="bg-gradient-classes rounded-xl p-8 shadow-sm"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-xl font-semibold text-gray-900 md:text-2xl dark:text-white"
            >
              About This Project
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="prose prose-gray dark:prose-invert max-w-none"
            >
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                {project.project_description}
              </p>
            </motion.div>
          </motion.div>

          {/* Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16 flex justify-center"
          >
            <div className="h-1 w-32 rounded-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default Project;
