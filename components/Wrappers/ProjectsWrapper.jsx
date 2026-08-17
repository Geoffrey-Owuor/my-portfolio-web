"use client";
import {
  ArrowRight,
  BadgeCheck,
  CircleArrowOutUpRight,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingLine from "../Modules/LoadingLine";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useAlertStore } from "@/store/useAlertStore";
import ProjectStack from "./ProjectStack";
import ShowMoreButtons from "./ShowMoreButtons";
import SectionTitle from "./SectionTitle";

const ProjectsWrapper = ({ projects }) => {
  //initialize router
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false); //To indicate when the loading should start

  // The number of projects we see on mount
  const [visibleCount, setVisibleCount] = useState(3);

  // Derived states for button visibility logic
  const visibleProjects = projects.slice(0, visibleCount);
  const canShowMore = visibleCount < projects.length;
  const canShowLess = visibleCount > 3;

  // Handle show more and show less
  const handleShowMore = () =>
    setVisibleCount((prev) => Math.min(prev + 3, projects.length));
  const handleShowLess = () => setVisibleCount((prev) => Math.max(prev - 3, 3));

  // Creating a ref for the section
  const projectsRef = useRef(null);

  // Check if section is in view
  const isInView = useInView(projectsRef, { once: true, amount: 0.2 });

  // Our add alert function
  const addAlert = useAlertStore((state) => state.addAlert);

  // Trigger Alert 2 seconds after the section comes into view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        addAlert({
          message: "Thoughtful, well-crafted project work",
          type: "success",
          iconComponent: BadgeCheck,
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Icon animation variants
  const iconVariants = {
    rest: {
      scale: 1,
      rotate: 0,
      x: 0,
      y: 0,
    },
    hover: {
      scale: 1.2,
      rotate: 15,
      x: 3,
      y: -3,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Handle navigation to a particular project's case study
  const handleNavigate = (projectId) => {
    setIsNavigating(true);
    router.push(`/projects/${projectId}`);
  };

  return (
    <>
      {/* LoadingLine fixed at the top of the viewport */}
      <AnimatePresence>{isNavigating && <LoadingLine />}</AnimatePresence>
      <div className="mx-1 md:mx-auto" ref={projectsRef}>
        {/* Section Title */}
        <SectionTitle label="Things i've built" title="My Projects" />
        {/* Responsive Projects Grid */}
        <div className="custom:grid-cols-2 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, _index) => (
            <motion.div
              key={project.id}
              role="link"
              tabIndex={0}
              initial="rest"
              whileHover="hover"
              animate="rest"
              onClick={() => handleNavigate(project.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNavigate(project.id);
                }
              }}
              className="group border-border-subtle hover:border-accent focus-visible:border-accent flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border p-6 transition-colors duration-150 focus-visible:outline-none"
            >
              {/* Card Header: title + external visit icon */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-text-primary line-clamp-2 text-xl font-semibold">
                  {project.project_name}
                </h3>

                <motion.a
                  href={project.project_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Visit live site"
                  onClick={(e) => e.stopPropagation()}
                  variants={iconVariants}
                  className="text-text-muted hover:text-accent shrink-0"
                >
                  <CircleArrowOutUpRight className="h-5 w-5" />
                </motion.a>
              </div>

              {/* Tech stack pills — quick-scan metadata, high in the hierarchy */}
              <ProjectStack projectStack={project.project_stack} limit={4} />

              {/* Card Description, trimmed for a consistent, skimmable card height */}
              <p className="text-text-muted mt-3 line-clamp-3 flex-1 leading-relaxed">
                {project.project_description}
              </p>

              {/* Footer: primary in-site action */}
              <div className="border-border-subtle text-accent mt-4 flex items-center gap-1.5 border-t pt-4 text-sm font-semibold">
                View case study
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show more buttons */}
        <ShowMoreButtons
          canShowMore={canShowMore}
          canShowLess={canShowLess}
          handleShowLess={handleShowLess}
          handleShowMore={handleShowMore}
        />

        {projects.length === 0 && (
          <div className="flex items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span>Waiting for connection...</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsWrapper;
