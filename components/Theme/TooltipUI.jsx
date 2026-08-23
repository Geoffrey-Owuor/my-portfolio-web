import { AnimatePresence, motion } from "framer-motion";

/**
 * `:focus-visible` is what separates a keyboard tab-in (show the tooltip) from
 * the focus a mouse click leaves behind (don't — the click already did the
 * thing the tooltip was advertising). Browsers that don't know the selector
 * throw on `matches()`, so there we fall back to treating any focus as
 * keyboard focus rather than dropping the hint entirely.
 */
export const isFocusVisible = (element) => {
  try {
    return element.matches(":focus-visible");
  } catch {
    return true;
  }
};

/**
 * Hover/focus hint for a single control, anchored under it.
 *
 * The trigger is responsible for owning `show`, marking itself `relative`, and
 * pointing `aria-describedby` at `id` while visible. Note that the tooltip
 * hangs *below* its trigger — any ancestor between the two carrying
 * `overflow-hidden` will clip it (see the desktop bar in Home/NavBar.jsx).
 */
const TooltipUI = ({ id, label, shortcut, show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id={id}
          role="tooltip"
          initial={{ opacity: 0, y: -6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="pointer-events-none absolute top-full left-1/2 mt-2.5 mb-2 -translate-x-1/2"
        >
          <div className="bg-text-primary text-surface relative rounded-lg px-3 py-1.5 text-[13px] whitespace-nowrap">
            {/* Drawing a rotated square that looks like an arrow */}
            <div
              className="bg-text-primary absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm"
              aria-hidden="true"
            ></div>
            {label}
            <kbd className="bg-surface/20 ml-2 rounded-full px-1.5 py-0.5">
              {shortcut}
            </kbd>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TooltipUI;
