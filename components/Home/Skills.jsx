import { getCachedSkills } from "@/cache/CachedData";
import SkillsWrapper from "../Wrappers/SkillsWrapper";

const Skills = async () => {
  const { technicalSkills, softSkills } = await getCachedSkills();

  return (
    <section
      id="skills"
      className="containerizing min-h-screen w-full px-4 py-20 md:px-8"
    >
      <SkillsWrapper
        technicalSkills={technicalSkills}
        softSkills={softSkills}
      />
    </section>
  );
};

export default Skills;
