import { X } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

export const SectionAlert = ({ message, type, onClose, IconComponent }) => {
  const handleClose = () => {
    setTimeout(() => onClose(), 300);
  };

  // Auto close after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Determine icon color
  const iconColorClass =
    type === "success"
      ? "text-green-500 dark:text-green-700"
      : "text-red-500 dark:text-red-700";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-1/2 right-4 z-50 hidden md:flex"
    >
      <div
        className={`flex w-auto max-w-80 items-center justify-between rounded-full bg-black px-6 py-4 text-white dark:bg-white dark:text-black`}
      >
        <div className="flex items-center gap-3">
          <IconComponent className={`h-6 w-6 shrink-0 ${iconColorClass}`} />
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 cursor-pointer text-gray-200 hover:text-gray-300 dark:text-gray-600 dark:hover:text-gray-700"
          aria-label="Close alert"
        >
          <X className="h-5 w-5 shrink-0" />
        </button>
      </div>
    </motion.div>
  );
};
