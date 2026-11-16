import { getCachedEducation } from "@/cache/CachedData";
import Markdown from "../Modules/Markdown";
import EducationWrapper from "../Wrappers/EducationWrapper";

const Education = async () => {
  const educationData = await getCachedEducation();

  // Rendered here so the markdown libraries stay off the client.
  const entries = educationData?.map(({ learning_description, ...entry }) => ({
    ...entry,
    description: <Markdown>{learning_description}</Markdown>,
  }));
  return (
    <section
      id="education" // For navbar link
      className="section-shell"
    >
      <EducationWrapper educationData={entries ?? null} />
    </section>
  );
};

export default Education;
