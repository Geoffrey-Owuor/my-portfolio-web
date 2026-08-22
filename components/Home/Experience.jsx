import { getCachedExperience } from "@/cache/CachedData";
import ExperienceWrapper from "../Wrappers/ExperienceWrapper";

const Experience = async () => {
  const experiences = await getCachedExperience();
  return (
    <section
      id="experience" // For navbar link
      className="min-h-app flex w-full items-center justify-center px-4 py-16 md:px-8"
    >
      <ExperienceWrapper experiences={experiences} />
    </section>
  );
};

export default Experience;
