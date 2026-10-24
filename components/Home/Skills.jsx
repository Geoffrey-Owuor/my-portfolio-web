import { getCachedSkills } from "@/cache/CachedData";
import SkillsWrapper from "../Wrappers/SkillsWrapper";

const Skills = async () => {
  // null when the read failed — see cache/CachedData.js
  const skills = await getCachedSkills();

  return (
    <section id="skills" className="section-shell">
      <SkillsWrapper
        technicalSkills={skills?.technicalSkills ?? null}
        softSkills={skills?.softSkills ?? null}
      />
    </section>
  );
};

export default Skills;
