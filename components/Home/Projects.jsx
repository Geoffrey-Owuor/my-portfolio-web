import { getCachedProjects } from "@/cache/CachedData";
import ProjectsWrapper from "../Wrappers/ProjectsWrapper";

const Projects = async () => {
  const projects = await getCachedProjects();
  return (
    <section
      id="projects" // For navbar link
      className="min-h-app mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-16 md:px-8 2xl:max-w-7xl"
    >
      <ProjectsWrapper projects={projects} />
    </section>
  );
};

export default Projects;
