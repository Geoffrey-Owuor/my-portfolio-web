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

  const projectImage = project_images.find((image) => image.id === project?.id);

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
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="font-dm-mono text-danger mb-3 text-sm">
          $ cat project.json
        </p>
        <p className="font-dm-mono text-text-muted mb-8 text-sm">
          cat: project.json: No such file or directory
        </p>
        <h2 className="text-text-primary mb-3 text-2xl font-semibold">
          Project not found
        </h2>
        <p className="text-text-muted mb-8">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => router.back()}
          className="font-dm-mono border-border-subtle text-text-primary hover:border-accent hover:text-accent focus-visible:border-accent inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </button>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>{isNavigating && <LoadingLine />}</AnimatePresence>

      <section className="w-full px-4 py-20 md:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb + Back */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <p className="font-dm-mono text-text-muted mb-3 text-xs">
              ~/projects/{project.id}
            </p>
            <button
              onClick={handleGoBack}
              className="group text-text-muted hover:text-accent inline-flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to projects
            </button>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-dm-mono text-text-primary mt-8 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {project.project_name}
          </motion.h1>

          {/* Meta row: stack + live CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <ProjectStack projectStack={project.project_stack} />

            {project.project_link && (
              <a
                href={project.project_link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit live project"
                className="font-dm-mono border-border-subtle text-text-primary hover:border-accent hover:text-accent focus-visible:border-accent inline-flex w-fit shrink-0 items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none"
              >
                <span className="text-accent" aria-hidden="true">
                  $
                </span>
                open --repo
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </motion.div>

          {/* Preview pane */}
          {projectImage && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="border-border-subtle bg-surface mt-10 overflow-hidden rounded-xl border"
            >
              <div className="border-border-subtle font-dm-mono text-text-muted flex items-center gap-2 border-b px-4 py-2.5 text-xs">
                <span className="text-accent" aria-hidden="true">
                  ●
                </span>
                preview.png
              </div>
              <Image
                src={projectImage.image}
                alt={`${project.project_name} preview`}
                className="w-full object-cover"
                priority
              />
            </motion.div>
          )}

          {/* README pane */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="border-border-subtle bg-surface mt-6 overflow-hidden rounded-xl border"
          >
            <div className="border-border-subtle font-dm-mono text-text-muted flex items-center gap-2 border-b px-4 py-2.5 text-xs">
              <span className="text-accent" aria-hidden="true">
                ●
              </span>
              README.md
            </div>
            <div className="px-6 py-8">
              <p className="text-text-muted text-base leading-relaxed">
                {project.project_description}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Project;
