import { generateSlug } from "@/utils/Helpers";
import { useEffect, useState } from "react";

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!content) return;

    // Regex to match lines starting with ### (and an optional space)
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

  // 2. Sync Active State with URL Heading Hash Automatically without an onClick handler
  useEffect(() => {
    const updateActiveFromHash = () => {
      // decoding ensures slugs with special characters work correctly
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      setActiveId(hash);
    };

    // Run on mount to handle direct links (e.g., page loads with #heading)
    updateActiveFromHash();

    // Listen for hash changes (clicks, back/forward buttons)
    window.addEventListener("hashchange", updateActiveFromHash);

    return () => window.removeEventListener("hashchange", updateActiveFromHash);
  }, []);

  if (headings.length === 0) return null;
  return (
    <nav className="custom-content:flex sticky top-49 mr-6 hidden max-h-[calc(100vh-15rem)] w-70 shrink-0 flex-col overflow-y-auto rounded-xl p-4">
      <h4 className="mb-4 border-b-2 border-gray-400 pb-2 text-sm font-bold tracking-wider text-gray-500 uppercase dark:border-gray-500 dark:text-gray-400">
        On this page
      </h4>
      <ul className="space-y-3 border-gray-300 dark:border-gray-700">
        {headings.map((heading, index) => (
          <li key={index}>
            <a
              href={`#${heading.id}`}
              className={`block rounded-xl ${activeId === heading.id ? "bg-indigo-100/50 font-semibold dark:bg-slate-700/50 dark:text-white" : ""} px-3 py-2 text-sm text-wrap text-gray-600 transition-colors hover:text-blue-500 hover:underline dark:text-gray-400`}
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
