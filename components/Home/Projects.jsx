import { query } from "@/lib/db";
import { CircleArrowOutUpRight, Loader2 } from "lucide-react";

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
      className="min-h-screen w-full px-4 py-20 md:px-8"
    >
      <div className="mx-auto">
        {/* Section Title */}
        <div className="mb-16 flex items-center justify-center gap-2 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          <span>My Projects</span>
        </div>

        {/* Responsive Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.project_link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl bg-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
            >
              {/* Card Content */}
              <div className="flex h-full flex-col justify-between p-6">
                <div>
                  {/* Card Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {project.project_name}
                    </h3>
                    {/* Link Icon */}
                    <CircleArrowOutUpRight className="h-5 w-5 text-gray-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 dark:text-gray-400" />
                  </div>
                  {/* Card Description */}
                  <p className="text-gray-600 dark:text-gray-300">
                    {project.project_description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
        {projects.length === 0 && (
          <div className="flex items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span>Waiting for connection...</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
