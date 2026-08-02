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
          <div className="bg-text-primary text-surface relative rounded-full px-3 py-1.5 text-[13px] whitespace-nowrap">
            {/* Drawing a rotated square that looks like an arrow */}
            <div className="bg-text-primary absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm"></div>
            Toggle Mode
            <kbd className="bg-surface/20 ml-2 rounded-full px-1.5 py-0.5">
              {shortcut}
            </kbd>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default TooltipUI;
