import { getCachedEducation } from "@/cache/CachedData";
import EducationWrapper from "../Wrappers/EducationWrapper";

const Education = async () => {
  const educationData = await getCachedEducation();
  return (
    <section
      id="education" // For navbar link
      className="flex min-h-screen w-full items-center justify-center px-4 py-24 md:px-8"
    >
      <EducationWrapper educationData={educationData} />
    </section>
  );
};

export default Education;
