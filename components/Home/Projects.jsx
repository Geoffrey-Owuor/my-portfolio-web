import { getCachedProjects } from "@/cache/CachedData";
import ProjectsWrapper from "../Wrappers/ProjectsWrapper";

const Projects = async () => {
  const projects = await getCachedProjects();
  return (
    <section
      id="projects" // For navbar link
      className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-24 md:px-8"
    >
      <ProjectsWrapper projects={projects} />
    </section>
  );
};

export default Projects;
