import { getCachedSkills } from "@/cache/CachedData";
import SkillsWrapper from "../Wrappers/SkillsWrapper";

const Skills = async () => {
  const { technicalSkills, softSkills } = await getCachedSkills();

  return (
    <section
      id="skills"
      className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-24 md:px-8"
    >
      <SkillsWrapper
        technicalSkills={technicalSkills}
        softSkills={softSkills}
      />
    </section>
  );
};

export default Skills;
