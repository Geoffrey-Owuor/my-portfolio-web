import { getCachedProjects } from "@/cache/CachedData";
import ProjectsWrapper from "../Wrappers/ProjectsWrapper";

const Projects = async () => {
  const projects = await getCachedProjects();
  return (
    <section
      id="projects" // For navbar link
      className="mx-auto flex w-full max-w-7xl justify-center px-4 py-20 md:py-28"
    >
      <ProjectsWrapper projects={projects} />
    </section>
  );
};

export default Projects;
