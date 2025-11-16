import { query } from "@/lib/db";
import { Briefcase, Loader2 } from "lucide-react";

const getExperience = async () => {
  try {
    const selectQuery = `SELECT id, work_timeline, company_name, work_description, work_title
        FROM workexperience
        ORDER BY id ASC`;

    const experiences = await query(selectQuery);
    return experiences;
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return []; //Return an empty array on error
  }
};

const Experience = async () => {
  const experiences = await getExperience();
  return (
    <section
      id="experience" // For navbar link
      className="min-h-screen w-full px-4 py-20 md:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section Title */}
        <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          My Work Experience
        </h2>

        {/* Vertical Timeline */}
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          {experiences.map((exp) => (
            <li key={exp.id} className="mb-10 ml-6">
              {/* The "dot" breakpoint */}
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white dark:bg-gray-800 dark:ring-gray-950">
                <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </span>

              {/* Timeline Content */}
              <div className="flex flex-col rounded-xl bg-gray-100/50 p-6 shadow-sm dark:bg-gray-800/50">
                <time className="mb-2 block text-sm leading-none font-normal text-gray-500 dark:text-gray-400">
                  {exp.work_timeline}
                </time>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {exp.work_title}
                </h3>
                <p className="mb-3 text-base text-gray-700 italic dark:text-gray-300">
                  {exp.company_name}
                </p>
                <p className="text-base font-normal text-gray-600 dark:text-gray-400">
                  {exp.work_description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {experiences.length === 0 && (
          <div className="flex items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span>Waiting for connection...</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
