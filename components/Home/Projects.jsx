import { getCachedProjects } from "@/cache/CachedData";
import ProjectsWrapper from "../Wrappers/ProjectsWrapper";
import MarkdownPreview from "../Modules/MarkdownPreview";

const Projects = async () => {
  const projects = await getCachedProjects();

  // The descriptions are markdown, rendered here so the cards stay free of
  // the markdown libraries on the client.
  const cards = projects?.map(({ project_description, ...project }) => ({
    ...project,
    preview: (
      <MarkdownPreview className="text-text-muted mt-3 line-clamp-3 flex-1 leading-relaxed">
        {project_description}
      </MarkdownPreview>
    ),
  }));
  return (
    <section
      id="projects" // For navbar link
      className="section-shell"
    >
      <ProjectsWrapper projects={cards ?? null} />
    </section>
  );
};

export default Projects;
