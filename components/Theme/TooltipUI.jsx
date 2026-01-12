import { motion } from "framer-motion";

const TooltipUI = ({ canHover, shortcut, showToolTip }) => {
  return (
    <>
      {canHover && showToolTip && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.95 }}
          className="pointer-events-none absolute top-full left-1/2 mt-2.5 mb-2 -translate-x-1/2"
        >
          <div className="relative rounded-lg bg-gray-900 px-3 py-1.5 text-[13px] whitespace-nowrap text-white dark:bg-white dark:text-gray-900">
            {/* Drawing a rotated square that looks like an arrow */}
            <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm bg-gray-900 dark:bg-white"></div>
            Toggle Mode
            <kbd className="ml-2 rounded-md bg-gray-700 px-1.5 py-0.5 dark:bg-gray-300">
              {shortcut}
            </kbd>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default TooltipUI;
