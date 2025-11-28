import { query } from "@/lib/db";
import ExperienceWrapper from "../Wrappers/ExperienceWrapper";

const getExperience = async () => {
  try {
    const selectQuery = `SELECT id, work_timeline, company_name, work_description, work_title
        FROM workexperience
        ORDER BY id ASC`;

    const experiences = await query(selectQuery);
    return experiences;
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return []; //Return an empty array on error
  }
};

const Experience = async () => {
  const experiences = await getExperience();
  return (
    <section
      id="experience" // For navbar link
      className="min-h-screen w-full px-4 py-20 md:px-8"
    >
      <ExperienceWrapper experiences={experiences} />
    </section>
  );
};

export default Experience;
