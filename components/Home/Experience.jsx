import { getCachedExperience } from "@/cache/CachedData";
import ExperienceWrapper from "../Wrappers/ExperienceWrapper";

const Experience = async () => {
  const experiences = await getCachedExperience();
  return (
    <section
      id="experience" // For navbar link
      className="flex w-full justify-center px-4 py-20 md:py-28"
    >
      <ExperienceWrapper experiences={experiences} />
    </section>
  );
};

export default Experience;
