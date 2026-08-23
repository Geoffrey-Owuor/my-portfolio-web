import { query } from "@/lib/db";
import Project from "@/components/Project/Project";
import { cache } from "react";
import { stripMarkdown } from "@/utils/Helpers";

const getProjectInfo = cache(async (id) => {
  try {
    const selectQuery = `SELECT id, project_name, project_link, project_description, project_stack
      FROM projects WHERE id = $1`;
    const queryParams = [id];

    const projectInfo = await query(selectQuery, queryParams);
    return projectInfo;
  } catch (error) {
    console.error("Failed to fetch project info:", error);
    return []; //Returning an empty array on error
  }
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const projects = await getProjectInfo(id);
  const projectInfo = projects[0];

  if (!projectInfo || projectInfo.length === 0) {
    return {
      title: "Project not found",
    };
  }

  // project_description is markdown, so it has to be flattened before it can
  // stand in as a meta description.
  const description =
    stripMarkdown(projectInfo.project_description) || projectInfo.project_link;

  return {
    title: projectInfo.project_name,
    description,

    openGraph: {
      title: projectInfo.project_name,
      description,
      type: "article",
      url: `/projects/${id}`,
      siteName: projectInfo.project_name,
    },
  };
}

const page = async ({ params }) => {
  const { id } = await params;
  const projectInfo = await getProjectInfo(id);

  return <Project projectInfo={projectInfo} />;
};

export default page;
