import { getCachedExperience } from "@/cache/CachedData";
import ExperienceWrapper from "../Wrappers/ExperienceWrapper";

const Experience = async () => {
  const experiences = await getCachedExperience();
  return (
    <section
      id="experience" // For navbar link
      className="min-h-screen w-full px-4 py-24 md:px-8"
    >
      <ExperienceWrapper experiences={experiences} />
    </section>
  );
};

export default Experience;
