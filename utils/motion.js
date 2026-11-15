export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// For event handlers and effects only. Anything that decides what to render
// goes through hooks/usePrefersReducedMotion instead, which stays in step with
// the server's HTML.
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

// Scrolls a section into view: smoothly, or at once under reduced motion.
// (There is deliberately no CSS scroll-smooth, so every in-page jump that
// should glide comes through here.)
export const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
};
