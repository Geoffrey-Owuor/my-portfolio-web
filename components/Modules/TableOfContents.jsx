"use client";
import { generateSlug } from "@/utils/Helpers";
import { useEffect, useState } from "react";

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  // 1. Extract headings from the markdown content
  useEffect(() => {
    if (!content) return;

    const regex = /^###\s+(.+)$/gm;
    const matches = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      matches.push({
        text: match[1],
        id: generateSlug(match[1]),
      });
    }

    setHeadings(matches);
  }, [content]);

  // 2. Track scroll position to update active heading
  useEffect(() => {
    if (headings.length === 0) return;

    // Create a variable to track if we are currently "waiting"
    let ticking = false;

    const doScrollMath = () => {
      // 1. Instantly abort the heavy DOM math if we are on a mobile screen on the screen is less than 1024px.
      // The event listener fires, but it costs virtually zero performance.
      if (window.innerWidth < 1024) return;

      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);

      if (headingElements.length === 0) return;

      const offset = 180;
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

      // Once the math is done, open the gate for the next scroll event
      ticking = false;
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

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-12 hidden max-h-[calc(100vh-2rem)] w-70 shrink-0 flex-col overflow-y-auto rounded-xl p-4 lg:flex">
      <h4 className="mb-4 border-b-2 border-gray-400 pb-2 text-sm font-bold tracking-wider text-gray-500 uppercase dark:border-gray-500 dark:text-gray-400">
        On this page
      </h4>
      <ul className="space-y-3 border-gray-300 dark:border-gray-700">
        {headings.map((heading, index) => (
          <li key={index}>
            <a
              href={`#${heading.id}`}
              className={`block rounded-xl px-3 py-2 text-sm text-wrap transition-colors ${
                activeId === heading.id
                  ? "bg-indigo-100/50 font-medium text-blue-600 dark:bg-slate-700/50 dark:text-white"
                  : "text-gray-600 hover:text-blue-500 hover:underline dark:text-gray-400"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
