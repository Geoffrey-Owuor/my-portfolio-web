import { useSyncExternalStore } from "react";
import { REDUCED_MOTION_QUERY } from "@/utils/motion";

const subscribe = (onChange) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getSnapshot = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getServerSnapshot = () => false;

/**
 * Whether the visitor asked for reduced motion. Use this, not framer-motion's
 * `useReducedMotion`: that one answers `null` on the server and `true` on the
 * browser's first render, so anything rendered from it mismatches on
 * hydration and the server's hidden `opacity:0` styles are left in place.
 *
 * This one is `false` on the server and while hydrating, then the real
 * setting, and it follows the setting if it changes. Even so, don't render
 * different elements or `initial` values from it — the server's HTML was
 * built for `false`. Use it for effects, handlers, transitions and exits;
 * `<MotionConfig reducedMotion="user">` (components/Theme/Providers.jsx)
 * already drops transform and layout animations everywhere.
 */
export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
