import { query } from "@/lib/db";
import SkillsWrapper from "../Wrappers/SkillsWrapper";

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
      <SkillsWrapper
        technicalSkills={technicalSkills}
        softSkills={softSkills}
      />
    </section>
  );
};

export default Skills;
