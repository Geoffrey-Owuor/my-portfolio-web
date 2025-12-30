"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  //UseEffect to show scroll button scrolling to acertain scrollY height
  useEffect(() => {
    const handleScroll = () => {
      // Show scroll button after scrolling 2000px down
      setShowButton(window.scrollY > 2000);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll back to the top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Back to Top"
          className="fixed right-8 bottom-20 z-50 flex cursor-pointer items-center gap-2 rounded-full bg-gray-900 px-3 py-3 text-white shadow-lg transition-shadow hover:shadow-xl sm:px-4 sm:py-3 dark:bg-white dark:text-gray-900"
        >
          <ArrowUp className="h-4 w-4" />
          <span className="hidden sm:block">Back to Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTopButton;
