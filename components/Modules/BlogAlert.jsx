"use client";

import { XIcon, AlertCircle, CheckCircle } from "lucide-react";
import { useEffect } from "react";
import ClientPortal from "./ClientPortal";
import { motion, AnimatePresence } from "framer-motion";

const BlogAlert = ({ message, type, hideAlert, isVisible }) => {
  // Auto close after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => hideAlert(), 6000);

    return () => clearTimeout(timer);
  }, [hideAlert]);

  // Determine which icon to display based on type
  const IconComponent = type === "success" ? CheckCircle : AlertCircle;

  // Determine icon color
  const iconColorClass =
    type === "success"
      ? "text-green-500 dark:text-green-700"
      : "text-red-500 dark:text-red-700";

  const content = (
    <div className="fixed top-0 left-1/2 z-9999 -translate-x-1/2">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-4"
          >
            <div className="flex w-auto min-w-[300px] items-center justify-between rounded-full bg-black px-6 py-4.5 text-white shadow-md dark:bg-white dark:text-black">
              <div className="flex items-center gap-2">
                {/* Render the appropriate icon */}
                <IconComponent
                  className={`h-5 w-5 shrink-0 ${iconColorClass}`}
                />
                <p className="text-sm">{message}</p>
              </div>
              <button
                onClick={hideAlert}
                className="ml-4 cursor-pointer text-gray-200 hover:text-gray-300 dark:text-gray-600 dark:hover:text-gray-700"
                aria-label="Close alert"
              >
                <XIcon className="h-5 w-5 shrink-0" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  return <ClientPortal>{content}</ClientPortal>;
};

export default BlogAlert;
