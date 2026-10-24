import { getCachedEducation } from "@/cache/CachedData";
import EducationWrapper from "../Wrappers/EducationWrapper";

const Education = async () => {
  const educationData = await getCachedEducation();
  return (
    <section
      id="education" // For navbar link
      className="section-shell"
    >
      <EducationWrapper educationData={educationData} />
    </section>
  );
};

export default Education;
