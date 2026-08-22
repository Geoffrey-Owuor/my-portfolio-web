"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";

// The note waits for the section's own entrance animation to land before it
// appears, then retires itself — it's an aside, not something to dismiss.
const APPEAR_DELAY_MS = 900;
const VISIBLE_MS = 4500;

const SectionTitle = ({ label, title, alertMessage, alertIcon: AlertIcon }) => {
  const titleRef = useRef(null);

  // Observed on the title block itself rather than the whole section, so the
  // note is tied to the thing it annotates: it fires when its own anchor is
  // on screen, not when a `min-h-app` section's top edge merely peeks in.
  const isInView = useInView(titleRef, { once: true, amount: 0.5 });

  const [showAlert, setShowAlert] = useState(false);
  const prefersReducedMotion = useReducedMotion();

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
    <div
      ref={titleRef}
      className="relative mb-16 flex flex-col items-center justify-center gap-3"
    >
      <span className="font-dm-mono text-text-muted text-sm font-medium tracking-[0.2em] uppercase">
        {label}
      </span>
      <h2 className="font-dm-mono text-text-primary text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      <div className="bg-accent mt-1 h-px w-12" />

      {/* Parked in the title block's own bottom margin — absolute, so it can
          never displace the section content below it, and `mb-16` already
          reserves more room than the note needs even when it wraps to two
          lines on a narrow screen. Hidden from assistive tech: it's a
          transient flourish restating what the title already says, and a
          timed live region would only interrupt. */}
      {hasAlert && (
        <AnimatePresence>
          {showAlert && (
            <motion.div
              aria-hidden="true"
              initial={hidden}
              animate={visible}
              exit={leaving}
              transition={{ duration: 0.45, ease: "easeOut" }}
              // Centred by the full-width flex wrapper rather than a
              // `-translate-x-1/2`, which would fight the inline transform
              // framer-motion writes for the rise.
              className="pointer-events-none absolute top-full right-0 left-0 mt-2 flex justify-center px-4"
            >
              <div className="border-border-subtle bg-surface-raised flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 sm:px-4">
                <AlertIcon className="text-accent h-3.5 w-3.5 shrink-0" />
                <p className="font-dm-mono text-text-muted text-center text-[11px] leading-snug sm:text-xs">
                  {alertMessage}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default SectionTitle;
