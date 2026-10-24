"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

// Scroll-linked entrance for a section's body: as it rises into view
// the block unclips from a narrower, inset window, tips back from a slight
// forward lean and settles to full scale. It's driven by scroll position
// rather than fired once, so scrolling back up plays it in reverse.
//
// The end state insets *outward* (-10%) rather than to 0 so the settled block
// is never clipped — timeline dots, focus rings, and hover borders sit just
// outside some sections' bounds.
const ScrollReveal = ({ children, className = "" }) => {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // 0 when the block's top meets the viewport bottom, 1 once it reaches 60%.
    offset: ["start end", "start 0.6"],
  });

  // Smooths out wheel steps so the geometry glides rather than ticks.
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.4,
  });

  const clipPath = useTransform(
    progress,
    [0, 1],
    ["inset(14% 8% 0% 8% round 24px)", "inset(-10% -10% -10% -10% round 24px)"],
  );
  const scale = useTransform(progress, [0, 1], [0.94, 1]);
  const rotateX = useTransform(progress, [0, 1], [10, 0]);
  const y = useTransform(progress, [0, 1], [48, 0]);
  const opacity = useTransform(progress, [0, 0.45], [0, 1]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  // `className` goes on the element that directly holds `children`, so
  // layout classes (e.g. a grid) apply to them rather than to this wrapper.
  return (
    <div ref={ref} className="perspective-[1400px]">
      <motion.div
        style={{ clipPath, scale, rotateX, y, opacity }}
        className={`origin-top ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollReveal;
