"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { prefersReducedMotion } from "@/utils/motion";

const CLICK_HOLD_PX = 8;

// A post using only ### shouldn't have every entry indented.
const shallowestDepth = (headings) =>
  Math.min(...headings.map((heading) => heading.depth));

// The sidebar is hidden below lg, so narrow screens get this instead: a
// collapsed list between the post's header and its body.
export const MobileTableOfContents = ({ headings }) => {
  const detailsRef = useRef(null);

  if (headings.length === 0) return null;

  const minDepth = shallowestDepth(headings);

  return (
    <details
      ref={detailsRef}
      className="border-border-subtle rounded-card mb-8 border lg:hidden"
    >
      <summary className="text-text-primary cursor-pointer px-4 py-3 text-sm font-semibold">
        On this page
      </summary>
      <ul className="border-border-subtle space-y-1 border-t p-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              // Closed before the browser scrolls, so the collapse can't
              // shift the page out from under the landing position.
              onClick={() => detailsRef.current?.removeAttribute("open")}
              className={`text-text-muted hover:text-accent rounded-control block py-2 pr-3 text-sm ${
                heading.depth > minDepth ? "pl-7" : "pl-3"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
};

const TableOfContents = ({ headings }) => {
  const [activeId, setActiveId] = useState("");
  const clickedRef = useRef(null);
  const navRef = useRef(null);

  // Keep the active entry visible in a list taller than the sidebar, without
  // scrollIntoView (it would scroll the page too)
  useEffect(() => {
    const nav = navRef.current;
    const item = nav?.querySelector('[aria-current="location"]');
    if (!nav || !item) return;
    // Position within the list's scrolled content, whichever ancestor is
    // positioned (the sticky nav is, so offsetTop alone would be relative to it)
    const top =
      item.getBoundingClientRect().top -
      nav.getBoundingClientRect().top +
      nav.scrollTop;
    const margin = 48;
    if (top < nav.scrollTop + margin) {
      nav.scrollTop = top - margin;
    } else if (
      top + item.offsetHeight >
      nav.scrollTop + nav.clientHeight - margin
    ) {
      nav.scrollTop = top + item.offsetHeight - nav.clientHeight + margin;
    }
  }, [activeId]);

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });

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

      // At the very bottom the last sections can be too short to reach the
      // threshold, so the last heading wins
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

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

      if (atBottom) {
        setActiveId(headingElements[headingElements.length - 1].id);
        return;
      }

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

  // Nothing to list: the article takes the full width instead.
  if (headings.length === 0) return null;

  const minDepth = shallowestDepth(headings);

  return (
    <nav
      ref={navRef}
      aria-label="On this page"
      className="rounded-card scrollbar-slim sticky top-[calc(var(--header-h)+1rem)] hidden max-h-[calc(100dvh-var(--header-h)-2rem)] w-70 shrink-0 flex-col overflow-y-auto p-4 lg:flex"
    >
      <p className="text-text-muted border-border-subtle mb-4 border-b-2 pb-2 text-sm font-bold tracking-wider uppercase">
        On this page
      </p>
      {/* A rail down the left, with the reader's section marked on it */}
      <ul className="border-border-subtle space-y-1 border-l">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleLinkClick(e, heading.id)}
              aria-current={activeId === heading.id ? "location" : undefined}
              className={`-ml-px block border-l-2 py-2 pr-3 text-sm text-wrap transition-colors ${
                heading.depth > minDepth ? "pl-8" : "pl-4"
              } ${
                activeId === heading.id
                  ? "border-accent text-accent font-medium"
                  : "text-text-muted hover:text-accent hover:border-text-muted border-transparent"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={scrollToTop}
        className="text-text-muted hover:text-accent mt-4 inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowUp className="h-4 w-4" aria-hidden />
        Back to top
      </button>
    </nav>
  );
};

export default TableOfContents;
