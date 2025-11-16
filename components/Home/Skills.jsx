import { query } from "@/lib/db";
import {
  Activity,
  Check,
  HeartHandshake,
  Loader2,
  Microchip,
} from "lucide-react";

const getSkills = async () => {
  try {
    const query1 = `SELECT id, skill_description FROM soft_skills ORDER BY id`;
    const query2 = `SELECT id, skill_description FROM technical_skills ORDER BY id`;

    const [softResult, techResult] = await Promise.all([
      query(query1),
      query(query2),
    ]);

    return {
      technicalSkills: techResult,
      softSkills: softResult,
    };
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return { technicalSkills: [], softSkills: [] };
  }
};

const Skills = async () => {
  const { technicalSkills, softSkills } = await getSkills();

  return (
    <section
      id="skills"
      className="min-h-screen containerizing w-full px-4 py-20 md:px-8"
    >
      <div className="mx-auto">
        {/* Section Title */}
        <div className="mb-16 flex items-center justify-center gap-2 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          <span>My Skills</span>
        </div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* --- Technical Skills (Left) --- */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 md:justify-start dark:text-gray-200">
              <Microchip />
              <span>Technical Skills</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
              {technicalSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 rounded-xl bg-gray-100 p-4 text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-300"
                >
                  <Activity className="h-4 w-4 shrink-0 text-gray-500" />
                  <span>{skill.skill_description}</span>
                </div>
              ))}
            </div>
            {technicalSkills.length === 0 && (
              <div className="flex items-center gap-4 px-2 py-15">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span>Waiting for connection...</span>
              </div>
            )}
          </div>

          {/* --- Soft Skills (Right) --- */}
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 md:justify-start dark:text-gray-200">
              <HeartHandshake />
              <span>Soft Skills</span>
            </div>
            <ul className="flex flex-col gap-3">
              {softSkills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-center gap-3 rounded-xl bg-gray-100/50 p-4 text-base text-gray-700 dark:bg-gray-800/50 dark:text-gray-300"
                >
                  <Check className="h-5 w-5 shrink-0 text-gray-500" />
                  <span>{skill.skill_description}</span>
                </li>
              ))}
            </ul>
            {softSkills.length === 0 && (
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

export default Skills;
