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
  const iconColorClass = type === "success" ? "text-surface" : "text-danger";

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0, bottom: bottomOffset }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ bottom: bottomOffset }}
      className="adjust-padding fixed right-4 z-50 hidden md:flex"
    >
      <div
        className={`bg-text-primary text-surface flex w-auto max-w-80 items-center justify-between rounded-full px-6 py-4`}
      >
        <div className="flex items-center gap-3">
          <IconComponent className={`h-6 w-6 shrink-0 ${iconColorClass}`} />
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-surface/70 hover:text-surface ml-4 cursor-pointer"
          aria-label="Close alert"
        >
          <X className="h-5 w-5 shrink-0" />
        </button>
      </div>
    </motion.div>
  );
};
