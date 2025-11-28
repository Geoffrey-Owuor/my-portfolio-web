import { query } from "@/lib/db";
import EducationWrapper from "../Wrappers/EducationWrapper";

const getEducation = async () => {
  try {
    const selectQuery = `SELECT id, institution, timeline, learning_description, learning_title
        FROM education
        ORDER BY id DESC`;

    const educationData = await query(selectQuery);
    return educationData;
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return []; //Return an empty array on error
  }
};

const Education = async () => {
  const educationData = await getEducation();
  return (
    <section
      id="education" // For navbar link
      className="min-h-screen w-full px-4 py-20 md:px-8"
    >
      <EducationWrapper educationData={educationData} />
    </section>
  );
};

export default Education;
