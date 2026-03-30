"use client";

import { motion, AnimatePresence } from "framer-motion";
import LoadingLine from "../Modules/LoadingLine";
import { useState } from "react";
import { project_images } from "@/assets/assets";
import Image from "next/image";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ProjectStack from "../Wrappers/ProjectStack";

const Project = ({ projectInfo }) => {
  const router = useRouter();
  const project = projectInfo[0];
  const [isNavigating, setIsNavigating] = useState(false);

  const projectImage = project_images.find((image) => image.id === project.id);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut", delay: i * 0.1 },
    }),
  };

  const handleGoBack = () => {
    setIsNavigating(true);
    router.push("/#projects");
  };

  if (!project || Object.keys(project).length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Project Not Found
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
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
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <motion.button
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            onClick={handleGoBack}
            className="group mb-12 flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Go Back
          </motion.button>

          {/* Title + CTA — inline, no card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
              {project.project_name}
            </h1>

            {project.project_link && (
              <a
                href={project.project_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
              >
                Visit Project
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </motion.div>

          {/* Thin divider */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mb-10 h-px w-full bg-gray-200 dark:bg-gray-800"
          />

          {/* Project Image — full-width, borderless */}
          {projectImage && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="mb-12 w-full overflow-hidden rounded-2xl"
            >
              <Image
                src={projectImage.image}
                alt="Project Image"
                className="w-full object-cover"
                priority
              />
            </motion.div>
          )}

          {/* About section — no card, just typography */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mb-10"
          >
            <p className="mb-1 text-xs font-semibold tracking-widest text-blue-500 uppercase dark:text-blue-400">
              About
            </p>
            <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
              Overview
            </h2>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
              {project.project_description}
            </p>
          </motion.div>

          {/* Thin divider */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
            className="mb-10 h-px w-full bg-gray-200 dark:bg-gray-800"
          />

          {/* Stack section */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={6}
          >
            <p className="mb-1 text-xs font-semibold tracking-widest text-blue-500 uppercase dark:text-blue-400">
              Stack
            </p>
            <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
              Built With
            </h2>
            <ProjectStack projectStack={project.project_stack} />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Project;
