import { getCachedSkills } from "@/cache/CachedData";
import SkillsWrapper from "../Wrappers/SkillsWrapper";

const Skills = async () => {
  // null when the read failed — see cache/CachedData.js
  const skills = await getCachedSkills();

  return (
    <section
      id="skills"
      className="mx-auto flex w-full max-w-7xl justify-center px-4 py-20 md:py-28"
    >
      <SkillsWrapper
        technicalSkills={skills?.technicalSkills ?? null}
        softSkills={skills?.softSkills ?? null}
      />
    </section>
  );
};

export default Skills;
