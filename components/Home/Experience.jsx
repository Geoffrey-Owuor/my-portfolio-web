import { getCachedExperience } from "@/cache/CachedData";
import ExperienceWrapper from "../Wrappers/ExperienceWrapper";

const Experience = async () => {
  const experiences = await getCachedExperience();
  return (
    <section
      id="experience" // For navbar link
      className="section-shell"
    >
      <ExperienceWrapper experiences={experiences} />
    </section>
  );
};

export default Experience;
