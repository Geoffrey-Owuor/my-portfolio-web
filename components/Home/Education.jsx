import { getCachedEducation } from "@/cache/CachedData";
import EducationWrapper from "../Wrappers/EducationWrapper";

const Education = async () => {
  const educationData = await getCachedEducation();
  return (
    <section
      id="education" // For navbar link
      className="flex w-full justify-center px-4 py-20 md:py-28"
    >
      <EducationWrapper educationData={educationData} />
    </section>
  );
};

export default Education;
