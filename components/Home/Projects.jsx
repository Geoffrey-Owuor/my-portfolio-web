import { query } from "@/lib/db";
import ProjectsWrapper from "../Wrappers/ProjectsWrapper";

const getProjects = async () => {
  try {
    const selectQuery = `SELECT id, project_name, project_link, project_description
        FROM projects
        ORDER BY id DESC`;

    const projects = await query(selectQuery);
    return projects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return []; //Returning an empty array on error
  }
};

const Projects = async () => {
  const projects = await getProjects();
  return (
    <section
      id="projects" // For navbar link
      className="min-h-screen containerizing w-full  px-4 py-20 md:px-8"
    >
      <ProjectsWrapper projects={projects} />
    </section>
  );
};

export default Projects;
