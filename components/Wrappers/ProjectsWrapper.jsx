"use client";
import { BadgeCheck, CircleArrowOutUpRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingLine from "../Modules/LoadingLine";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { SectionAlert } from "../Modules/SectionAlert";
import ProjectStack from "./ProjectStack";

const ProjectsWrapper = ({ projects }) => {
  //initialize router
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false); //To indicate when the loading should start

  const [alertInfo, setAlertInfo] = useState({
    showAlert: false,
    alertType: "",
    alertMessage: "",
  });

  // Creating a ref for the section
  const projectsRef = useRef(null);

  // Check if section is in view
  const isInView = useInView(projectsRef, { once: true, amount: 0.2 });

  // Trigger Alert 2 seconds after the section comes into view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAlertInfo((prev) => ({
          ...prev,
          showAlert: true,
          alertType: "success",
          alertMessage: "Thoughtful, well-crafted project solutions",
        }));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Container variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Enhanced card variants with scale and rotation
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing curve
      },
    },
  };

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
      {/* Render the alert component */}
      <AnimatePresence>
        {alertInfo.showAlert && (
          <SectionAlert
            message={alertInfo.alertMessage}
            type={alertInfo.alertType}
            IconComponent={BadgeCheck}
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
      {/* LoadingLine fixed at the top of the viewport */}
      <AnimatePresence>{isNavigating && <LoadingLine />}</AnimatePresence>
      <div className="mx-1 md:mx-auto" ref={projectsRef}>
        {/* Section Title */}
        <div className="mb-16 flex items-center justify-center gap-2 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          <span>My Projects</span>
        </div>

        {/* Responsive Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="custom:grid-cols-2 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              style={{ perspective: "1000px" }}
            >
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

                {/* Floating animation for each card */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                  className="relative"
                >
                  {/* Card Content */}

                  {/* Card Header */}
                  <div className="mb-1 flex items-center justify-between">
                    <div>
                      <motion.h3
                        className="line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white"
                        whileHover={{
                          x: 5,
                          transition: { duration: 0.2 },
                        }}
                      >
                        {project.project_name}
                      </motion.h3>
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
                </motion.div>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>

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
