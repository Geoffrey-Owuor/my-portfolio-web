import { generateSlug } from "@/utils/Helpers";
import { useEffect, useState } from "react";

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);

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

  if (headings.length === 0) return null;
  return (
    <nav className="custom-content:flex sticky top-12 mr-6 hidden max-h-80 w-64 shrink-0 flex-col overflow-y-auto rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <h4 className="mb-4 text-sm font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
        On this page
      </h4>
      <ul className="space-y-3 border-l border-gray-300 dark:border-gray-700">
        {headings.map((heading, index) => (
          <li key={index}>
            <a
              href={`#${heading.id}`}
              className="block truncate border-l-2 border-transparent pr-2 pl-4 text-sm text-gray-600 transition-colors hover:border-blue-500 hover:text-blue-500 dark:text-gray-400"
              title={heading.text} // Show full text on hover
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
