"use client";
import { useEffect, useRef, useState } from "react";

const CLICK_HOLD_PX = 8;

const TableOfContents = ({ headings }) => {
  const [activeId, setActiveId] = useState("");
  const clickedRef = useRef(null);

  const handleLinkClick = (e, id) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    clickedRef.current = { landedAt: null };
    setActiveId(id);
  };

  // Track scroll position to update active heading
  useEffect(() => {
    if (headings.length === 0) return;

    // Create a variable to track if we are currently "waiting"
    let ticking = false;

    const doScrollMath = () => {
      // Open the gate for the next scroll event, before any early return
      ticking = false;

      // 1. Instantly abort the heavy DOM math if we are on a mobile screen on the screen is less than 1024px.
      // The event listener fires, but it costs virtually zero performance.
      if (window.innerWidth < 1024) return;

      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);

      if (headingElements.length === 0) return;

      // A clicked heading keeps its highlight until the reader scrolls away,
      // because one near the end of the post may never reach the threshold.
      const clicked = clickedRef.current;
      if (clicked) {
        clicked.landedAt ??= window.scrollY;
        if (Math.abs(window.scrollY - clicked.landedAt) < CLICK_HOLD_PX) return;
        clickedRef.current = null;
      }

      // Where a hash link parks a heading (scroll-padding + scroll-margin), so
      // the heading a link lands on counts as reached. +1 absorbs rounding.
      const offset =
        parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        ) +
        parseFloat(getComputedStyle(headingElements[0]).scrollMarginTop) +
        1;
      let currentActiveId = "";

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        const rect = element.getBoundingClientRect();

        if (rect.top <= offset) {
          currentActiveId = element.id;
          break;
        }
      }

      setActiveId(currentActiveId);
    };

    const handleScroll = () => {
      // If we are already ticking (waiting), ignore the scroll event entirely
      if (!ticking) {
        // Close the gate immediately
        ticking = true;

        // Wait 50ms (or use requestAnimationFrame) before doing the heavy math
        setTimeout(doScrollMath, 50);
      }
    };

    // Run once on mount to set initial state
    doScrollMath();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  return (
    <nav className="rounded-card sticky top-[calc(var(--header-h)+1rem)] hidden max-h-[calc(100dvh-var(--header-h)-2rem)] w-70 shrink-0 flex-col overflow-y-auto p-4 [scrollbar-width:thin] lg:flex">
      <h4 className="text-text-muted border-border-subtle mb-4 border-b-2 pb-2 text-sm font-bold tracking-wider uppercase">
        On this page
      </h4>
      <ul className="border-border-subtle space-y-3">
        {headings.length === 0 ? (
          <li>
            <p className="text-text-muted px-3 py-2 text-sm italic">
              No headings found
            </p>
          </li>
        ) : (
          <>
            {headings.map((heading, index) => (
              <li key={index}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleLinkClick(e, heading.id)}
                  className={`rounded-control block px-3 py-2 text-sm text-wrap transition-colors ${
                    activeId === heading.id
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-text-muted hover:text-accent hover:underline"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </>
        )}
      </ul>
    </nav>
  );
};

export default TableOfContents;
