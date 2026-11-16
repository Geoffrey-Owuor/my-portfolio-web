import { getCachedExperience } from "@/cache/CachedData";
import Markdown from "../Modules/Markdown";
import ExperienceWrapper from "../Wrappers/ExperienceWrapper";

const Experience = async () => {
  const experiences = await getCachedExperience();

  // Rendered here so the markdown libraries stay off the client.
  const entries = experiences?.map(({ work_description, ...entry }) => ({
    ...entry,
    description: <Markdown>{work_description}</Markdown>,
  }));
  return (
    <section
      id="experience" // For navbar link
      className="section-shell"
    >
      <ExperienceWrapper experiences={entries ?? null} />
    </section>
  );
};

export default Experience;
