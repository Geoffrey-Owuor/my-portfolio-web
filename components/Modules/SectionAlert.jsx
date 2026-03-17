import { X } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

export const SectionAlert = ({
  stackIndex,
  message,
  type,
  onClose,
  IconComponent,
}) => {
  // Each alert is offset by 80px per stack position (alert height ~72px + 8px gap)
  const bottomOffset = 16 + stackIndex * 80;

  const handleClose = () => {
    setTimeout(() => onClose(), 300);
  };

  // Auto close after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Determine icon color
  const iconColorClass =
    type === "success"
      ? "text-white dark:text-black"
      : "text-red-500 dark:text-red-700";

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0, bottom: bottomOffset }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ bottom: bottomOffset }}
      className="fixed right-4 z-50 hidden md:flex"
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
