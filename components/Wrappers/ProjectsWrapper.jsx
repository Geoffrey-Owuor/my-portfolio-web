"use client";
import { BadgeCheck, CircleArrowOutUpRight, Loader2 } from "lucide-react";
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
          message: "Thoughtful, well-crafted project solutions",
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

  // Handle navigatiion to a particular project
  const handleNavigate = (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
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
            <div key={project.id}>
              <motion.a
                href={project.project_link}
                target="_blank"
                rel="noopener noreferrer"
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-slate-100 p-6 shadow-sm transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/50"
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

                <div className="relative">
                  {/* Card Content */}

                  {/* Card Header */}
                  <div className="mb-1 flex items-center justify-between">
                    <div>
                      <h3 className="line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
                        {project.project_name}
                      </h3>
                      <button
                        onClick={(e) => {
                          handleNavigate(e, project.id);
                        }}
                        title="see more"
                        className="mt-1 rounded-full px-2 pb-0.5 text-sm text-blue-500 hover:bg-blue-300/50 dark:text-blue-400 dark:hover:bg-blue-500/50"
                      >
                        more...
                      </button>
                    </div>

                    {/* Animated Link Icon */}
                    <motion.div variants={iconVariants}>
                      <CircleArrowOutUpRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </motion.div>
                  </div>

                  {/* Card Description with reveal animation */}
                  <motion.p
                    className="line-clamp-6 text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0.8 }}
                    whileHover={{
                      opacity: 1,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {project.project_description}
                  </motion.p>

                  {/* Project stack area */}
                  <ProjectStack projectStack={project.project_stack} />
                </div>
              </motion.a>
            </div>
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
