"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { getSection } from "../Home/sections";

// The note waits for the section's own entrance animation to land before it
// appears, then retires itself — it's an aside, not something to dismiss.
const APPEAR_DELAY_MS = 900;
const VISIBLE_MS = 4500;

/**
 * Editorial section header: index number (the section's position in the
 * page, shared with the navbar), title, a one-line subtitle, the section's
 * `~/path`, and a rule that draws across as the header scrolls in.
 * `sectionId` must be one of the ids in components/Home/sections.js.
 */
const SectionTitle = ({
  sectionId,
  title,
  subtitle,
  alertMessage,
  alertIcon: AlertIcon,
}) => {
  const titleRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const section = getSection(sectionId);

  // Observed on the title block itself rather than the whole section, so the
  // note is tied to the thing it annotates.
  const isInView = useInView(titleRef, { once: true, amount: 0.5 });

  const { scrollYProgress } = useScroll({
    target: titleRef,
    offset: ["start end", "start 0.45"],
  });
  const ruleProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.4,
  });

  const [showAlert, setShowAlert] = useState(false);
  const hasAlert = Boolean(alertMessage && AlertIcon);

  useEffect(() => {
    if (!hasAlert || !isInView) return;

    const appearTimer = setTimeout(() => setShowAlert(true), APPEAR_DELAY_MS);
    const hideTimer = setTimeout(
      () => setShowAlert(false),
      APPEAR_DELAY_MS + VISIBLE_MS,
    );

    return () => {
      clearTimeout(appearTimer);
      clearTimeout(hideTimer);
    };
  }, [hasAlert, isInView]);

  // Reduced motion keeps the fade but drops the rise and the de-blur.
  const hidden = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 6, filter: "blur(4px)" };
  const visible = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };
  const leaving = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: -4, filter: "blur(4px)" };

  return (
    <header ref={titleRef} className="relative mb-10">
      {/* One short fade-up the first time the header comes into view. */}
      <motion.div
        initial={hidden}
        animate={isInView ? visible : hidden}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-start gap-3 md:gap-4"
      >
        <span
          className="text-accent pt-1.5 font-mono text-sm tabular-nums md:pt-2"
          aria-hidden="true"
        >
          {section?.index}
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-text-primary text-h2 font-semibold">{title}</h2>

          <div className="mt-1.5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            {subtitle && (
              <p className="text-text-muted text-base">{subtitle}</p>
            )}
            <span className="text-text-muted/80 font-mono text-xs">
              ~/{sectionId}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Hairline track with the accent drawn across it by scroll position */}
      <div className="bg-border-subtle relative mt-5 h-px overflow-hidden">
        <motion.div
          style={prefersReducedMotion ? undefined : { scaleX: ruleProgress }}
          className="bg-accent absolute inset-0 origin-left"
        />
      </div>

      {/* Parked in the header's own bottom margin — absolute, so it can never
          displace the section content below it. Hidden from assistive tech:
          it's a transient flourish, and a timed live region would only
          interrupt. */}
      {hasAlert && (
        <AnimatePresence>
          {showAlert && (
            <motion.div
              aria-hidden="true"
              initial={hidden}
              animate={visible}
              exit={leaving}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="pointer-events-none absolute top-full left-0 mt-2 flex max-w-full"
            >
              <div className="border-border-subtle bg-surface-raised flex max-w-full items-center gap-2 rounded-lg border px-3 py-1.5 sm:px-4">
                <AlertIcon className="text-accent h-3.5 w-3.5 shrink-0" />
                <p className="text-text-muted line-clamp-1 font-mono text-[11px] leading-snug sm:text-xs">
                  {alertMessage}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </header>
  );
};

export default SectionTitle;
