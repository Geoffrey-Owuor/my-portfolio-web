import { getCachedProjects } from "@/cache/CachedData";
import ProjectsWrapper from "../Wrappers/ProjectsWrapper";

const Projects = async () => {
  const projects = await getCachedProjects();
  return (
    <section
      id="projects" // For navbar link
      className="section-shell"
    >
      <ProjectsWrapper projects={projects} />
    </section>
  );
};

export default Projects;
