"use client";
import { GraduationCap, Loader2, School } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SectionAlert } from "../Modules/SectionAlert";
import remarkGfm from "remark-gfm";
import ReactMarkDown from "react-markdown";
import ShowMoreButtons from "./ShowMoreButtons";

const EducationWrapper = ({ educationData }) => {
  const [alertInfo, setAlertInfo] = useState({
    showAlert: false,
    alertType: "",
    alertMessage: "",
  });

  // Number of experiences we see on mount
  const [visibleCount, setVisibleCount] = useState(1);

  // Derived states for button visibility logic
  const visibleEducationData = educationData.slice(0, visibleCount);
  const canShowMore = visibleCount < educationData.length;
  const canShowLess = visibleCount > 1;

  // Handle show more and show less
  const handleShowMore = () =>
    setVisibleCount((prev) => Math.min(prev + 1, educationData.length));
  const handleShowLess = () => setVisibleCount((prev) => Math.max(prev - 1, 1));

  // Creating a ref for the section
  const educationRef = useRef(null);

  // Check if section is in view
  const isInView = useInView(educationRef, { once: true, amount: 0.2 });

  // Trigger Alert 2 seconds after the section comes into view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAlertInfo((prev) => ({
          ...prev,
          showAlert: true,
          alertType: "success",
          alertMessage: "Educated enough to pretend I know what I'm doing",
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
      <AnimatePresence>
        {alertInfo.showAlert && (
          <SectionAlert
            message={alertInfo.alertMessage}
            type={alertInfo.alertType}
            IconComponent={School}
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
      <div className="mx-1 max-w-5xl md:mx-auto" ref={educationRef}>
        {/* Section Title */}
        <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          My Education
        </h2>

        {/* Vertical Timeline */}
        <motion.ol
          variants={containerVariants}
          className="relative border-l border-gray-200 dark:border-gray-700"
        >
          {visibleEducationData.map((education, index) => (
            <motion.li
              key={education.id}
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
                  <GraduationCap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </motion.div>
              </motion.span>

              {/* Timeline Content with hover effect */}
              <motion.div
                whileHover={{
                  scale: 1.02,
                  x: 5,
                  transition: { duration: 0.2 },
                }}
                className="group bg-gradient-classes relative flex flex-col rounded-xl p-6 transition-shadow hover:shadow-md"
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
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="mb-2 block text-sm leading-none font-normal text-gray-500 dark:text-gray-400"
                >
                  {education.timeline}
                </motion.time>

                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  {education.learning_title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mb-3 text-base text-gray-700 italic dark:text-gray-300"
                >
                  {education.institution}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="prose prose-gray dark:prose-invert max-w-none text-base font-normal text-gray-600 dark:text-gray-400"
                >
                  <ReactMarkDown remarkPlugins={[remarkGfm]}>
                    {education.learning_description}
                  </ReactMarkDown>
                </motion.div>
              </motion.div>
            </motion.li>
          ))}
        </motion.ol>

        {educationData.length === 0 && (
          <div className="flex items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span>Waiting for connection...</span>
          </div>
        )}

        {/* Show more buttons*/}
        <ShowMoreButtons
          canShowMore={canShowMore}
          canShowLess={canShowLess}
          handleShowMore={handleShowMore}
          handleShowLess={handleShowLess}
        />
      </div>
    </>
  );
};

export default EducationWrapper;
