"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import TooltipUI from "./TooltipUI";
import { useEffect, useState } from "react";

export default function ThemeToggleCompact() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showToolTip, setShowToolTip] = useState(false);
  const [suppressHover, setSuppressHover] = useState(false);

  // Ensure this only renders on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // UseEffect for automatically switching (fast switch) a theme when D key is pressed
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input, textarea, or contenteditable element
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target.isContentEditable
      ) {
        return;
      }
      if (e.key === "d" || e.key === "D") {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setTheme, resolvedTheme]);

  // Detect if current device supports hovering and has a pointer
  const canHover =
    typeof window !== "undefined" &&
    window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  // Check the resolved theme - to show correct theme on initial render
  const isDark = resolvedTheme === "dark";

  // Detect Firefox browser
  const isFirefox =
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().includes("firefox");

  // Function to toggle the theme using view transitioning
  const toggleTheme = async (e) => {
    // Check if view transitions is supported
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      isFirefox
    ) {
      // Fallback for old browsers or reduced motion preferences
      setTheme(isDark ? "light" : "dark");
      return;
    }

    // Start the view transition
    const transition = document.startViewTransition(async () => {
      // This callback changes the actual theme state
      setTheme(isDark ? "light" : "dark");
    });

    //Wait for the ready promise
    // The browser has captured the "old" view and is ready to show the "new" view
    await transition.ready;

    // Calculate geometry for the clip path
    const x = e.clientX;
    const y = e.clientY;

    // Math logic: Find distance to the furthest corner of the screen
    const right = window.innerWidth - x;
    const bottom = window.innerHeight - y;
    const maxRadius = Math.hypot(Math.max(x, right), Math.max(y, bottom));

    // Animate the circular clip-path
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`, //Start: 0px at click
          `circle(${maxRadius}px at ${x}px ${y}px)`, //End: fullscreen circle
        ],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  const handleClick = async (e) => {
    setShowToolTip(false);
    setSuppressHover(true);
    await toggleTheme(e);

    // A timeout to reset suppress hover after 600 milliseconds
    setTimeout(() => setSuppressHover(false), 600);
  };

  const handleMouseEnter = () => {
    if (canHover && !suppressHover) {
      setShowToolTip(true);
    }
  };

  const handleMouseLeave = () => {
    if (canHover) {
      setShowToolTip(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Toggle theme"
        className="rounded-full p-2 text-gray-700 transition hover:bg-slate-200 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {isDark ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
      </button>

      {/* Tooltip Guide */}
      <TooltipUI canHover={canHover} shortcut="D" showToolTip={showToolTip} />
    </div>
  );
}
