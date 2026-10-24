"use client";

import { motion, useReducedMotion } from "framer-motion";

// Entrance for a section's body: a short fade-up, once, the first time it
// comes into view. Deliberately quiet — the section title already marks the
// hand-over between sections.
const ScrollReveal = ({ children, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // `className` goes on the element that directly holds `children`, so
  // layout classes (e.g. a grid) apply to them rather than to a wrapper.
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
