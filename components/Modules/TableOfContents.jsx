"use client";
import { generateSlug } from "@/utils/Helpers";
import { useEffect, useState } from "react";
import TOCSkeleton from "../Skeletons/TOCSkeleton";

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [headingsLoading, setHeadingsLoading] = useState(true);
  const [activeId, setActiveId] = useState("");

  // 1. Extract headings from the markdown content
  useEffect(() => {
    const handleHeadingsPopulation = () => {
      if (!content) {
        setHeadingsLoading(false);
        return;
      }

      setHeadingsLoading(true);

      try {
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
      } catch (error) {
        console.error(error);
      } finally {
        setHeadingsLoading(false);
      }
    };

    handleHeadingsPopulation();
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

  if (headingsLoading) return <TOCSkeleton />;

  return (
    <nav className="sticky top-12 hidden max-h-[calc(100vh-2rem)] w-70 shrink-0 flex-col overflow-y-auto rounded-xl p-4 lg:flex">
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
                  className={`block rounded-xl px-3 py-2 text-sm text-wrap transition-colors ${
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
