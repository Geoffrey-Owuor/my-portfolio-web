"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

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
      transition={{ duration: 0.5, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Where an item starts from; all of them end at rest.
const FROM = {
  rise: { opacity: 0, y: 20 },
  // Rows and timeline entries read left to right, so they arrive that way.
  slide: { opacity: 0, x: -20 },
  // Cards: a rise with a little growth.
  lift: { opacity: 0, y: 24, scale: 0.96 },
  // Small chips.
  pop: { opacity: 0, scale: 0.85 },
};

// Past this many items a cascade stops being a flourish and becomes a wait.
const MAX_STAGGER_STEPS = 10;

/**
 * Entrance for one item of a list: once, when the item itself comes into
 * view — so a long list reveals as it is scrolled rather than all at once
 * off-screen, and an item added later ("Show more") animates in on arrival.
 *
 * `as` is the element to render (the item replaces its own tag instead of
 * adding a wrapper, so `divide-*` and list semantics survive). `index` is
 * the item's place among the items that appear together, for the stagger.
 */
export const RevealItem = ({
  as = "div",
  from = "rise",
  index = 0,
  step = 0.06,
  children,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag {...props}>{children}</Tag>;
  }

  const MotionTag = motion[as];
  return (
    <MotionTag
      initial={FROM[from]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        ease: EASE,
        delay: Math.min(index, MAX_STAGGER_STEPS) * step,
      }}
      {...props}
    >
      {children}
    </MotionTag>
  );
};

export default ScrollReveal;
