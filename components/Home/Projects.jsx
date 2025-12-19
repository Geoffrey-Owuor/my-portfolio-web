import { getCachedProjects } from "@/cache/CachedData";
import ProjectsWrapper from "../Wrappers/ProjectsWrapper";

const Projects = async () => {
  const projects = await getCachedProjects();
  return (
    <section
      id="projects" // For navbar link
      className="containerizing min-h-screen w-full px-4 py-20 md:px-8"
    >
      <ProjectsWrapper projects={projects} />
    </section>
  );
};

export default Projects;
