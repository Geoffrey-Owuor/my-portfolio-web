// App-wide route progress line. The App Router exposes no navigation events,
// so instead of guessing when a route has finished (pathname changes miss
// same-path/hash navigations and leave the bar stuck on failures), every
// client navigation is run inside a React transition: `isPending` stays true
// exactly until the new route — or its loading.jsx boundary — commits.
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Fast navigations (prefetched/static routes) finish well under this, so the
// bar only appears when there's a wait worth signalling.
const SHOW_DELAY_MS = 150;
const FINISH_MS = 250;

const RouteProgressContext = createContext(null);

/** `router` stand-in whose push/replace drive the progress line. */
export const useProgressRouter = () => useContext(RouteProgressContext);

const ProgressBar = ({ isPending }) => {
  // idle → loading (after the delay) → finishing (snap to 100%, fade) → idle
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPending) {
      const timer = setTimeout(() => {
        setProgress(10);
        setPhase("loading");
      }, SHOW_DELAY_MS);
      return () => clearTimeout(timer);
    }

    setPhase((prev) => (prev === "loading" ? "finishing" : prev));
  }, [isPending]);

  // Trickle towards, but never reach, the end while we wait.
  useEffect(() => {
    if (phase !== "loading") return;

    const interval = setInterval(() => {
      setProgress((prev) => prev + Math.max(0.5, (95 - prev) * 0.05));
    }, 100);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "finishing") return;

    setProgress(100);
    const timer = setTimeout(() => {
      setPhase("idle");
      setProgress(0);
    }, FINISH_MS);

    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "idle") return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading page"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(Math.min(progress, 100))}
      className={`pointer-events-none fixed top-0 right-0 left-0 z-9999 h-[2.5px] transition-opacity duration-200 ${
        phase === "finishing" ? "opacity-0 delay-100" : "opacity-100"
      }`}
    >
      <div
        className="bg-accent h-full origin-left shadow-[0_0_8px_var(--accent)] transition-transform duration-300 ease-out"
        style={{ transform: `scaleX(${Math.min(progress, 100) / 100})` }}
      />
    </div>
  );
};

export const RouteProgressProvider = ({ children }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const progressRouter = {
    push: (href, options) => startTransition(() => router.push(href, options)),
    replace: (href, options) =>
      startTransition(() => router.replace(href, options)),
  };

  return (
    <RouteProgressContext.Provider value={progressRouter}>
      {children}
      <ProgressBar isPending={isPending} />
    </RouteProgressContext.Provider>
  );
};

/**
 * Drop-in `next/link` replacement. `onNavigate` only fires for client-side
 * navigations (never for modified/middle clicks or new tabs), so those keep
 * native behaviour while plain clicks are re-run through the transition.
 * `href` must be a string.
 */
export const ProgressLink = ({ href, replace, scroll, ...props }) => {
  const progressRouter = useProgressRouter();

  return (
    <Link
      href={href}
      replace={replace}
      scroll={scroll}
      onNavigate={(e) => {
        e.preventDefault();
        progressRouter[replace ? "replace" : "push"](href, { scroll });
      }}
      {...props}
    />
  );
};
