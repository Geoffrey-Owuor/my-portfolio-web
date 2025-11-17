import { tools } from "@/assets/assets";
import { query } from "@/lib/db";
import Image from "next/image";
import { Cpu, ListChecks, Loader2, RailSymbol } from "lucide-react";

const getToolNames = async () => {
  try {
    const selectQuery = `SELECT id, tool_name FROM tools ORDER BY tool_name`;
    const toolNames = await query(selectQuery);
    return toolNames;
  } catch (error) {
    console.error("Failed to fetch tool names:", error);
    return []; //Return empty array or an error
  }
};

// Icons we want to invert their colors in dark mode
const iconsToInvert = [
  "awsLogo",
  "githubLogo",
  "nextjsLogo",
  "prismaLogo",
  "vercelLogo",
];

const Stack = async () => {
  // Fetch dynamic data
  const toolNames = await getToolNames();

  // Get static data. Object.entries converts { React: '...' }
  // into [['React', '...']] so we can map over it.
  const toolIcons = Object.entries(tools);

  return (
    <section
      id="stack"
      className="min-h-screen containerizing w-full px-4 py-20 md:px-8"
    >
      <div className="mx-auto">
        {/* Section Title */}
        <div className="mb-16 flex items-center justify-center gap-2 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          <span>My Tech Stack</span>
        </div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* --- Grid 1: Core Technology Icons --- */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 md:justify-start dark:text-gray-200">
              <Cpu />
              <span>Core Technologies</span>
            </div>
            {/* Logo Grid */}
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 sm:gap-6">
              {toolIcons.map(([name, iconSrc]) => (
                <div
                  key={name}
                  className="flex flex-col items-center justify-center gap-2"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 p-4 shadow-sm transition-all duration-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <Image
                      src={iconSrc}
                      alt={name}
                      width={48}
                      height={48}
                      className={`h-12 w-12 object-contain ${iconsToInvert.includes(name) ? "dark:invert" : ""}`}
                    />
                  </div>
                </div>
              ))}
              {toolIcons.length === 0 && (
                <div className="flex items-center gap-4 px-2 py-15">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span>Waiting for connection...</span>
                </div>
              )}
            </div>
          </div>

          {/* --- Grid 2: Other Tools & Skills List --- */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 md:justify-start dark:text-gray-200">
              <ListChecks />
              <span>Other Tools & Skills</span>
            </div>
            {/* Tools List */}
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {toolNames.map((tool) => (
                <li
                  key={tool.id}
                  className="flex items-center gap-3 rounded-xl bg-gray-100/50 p-4 text-base text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
                >
                  <RailSymbol className="h-5 w-5 shrink-0 text-gray-500" />
                  <span>{tool.tool_name}</span>
                </li>
              ))}
            </ul>
            {toolNames.length === 0 && (
              <div className="flex items-center gap-4 px-2 py-15">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span>Waiting for connection...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stack;
