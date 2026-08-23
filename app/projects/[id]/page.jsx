import { query } from "@/lib/db";
import Project from "@/components/Project/Project";
import { cache } from "react";
import { stripMarkdown } from "@/utils/Helpers";

const getProjectInfo = cache(async (id) => {
  try {
    // Neighbours follow the same order the projects grid renders in (id DESC),
    // so "previous" is the card above this one on the homepage and "next" is
    // the card below it. Both ends wrap: the newest project's previous is the
    // oldest, and the oldest project's next is the newest.
    const selectQuery = `
      WITH bounds AS (
        SELECT MIN(id) AS min_id, MAX(id) AS max_id FROM projects
      ),
      neighbours AS (
        SELECT
          p.id,

          (p.id = bounds.max_id) AS is_first_project,
          (p.id = bounds.min_id) AS is_last_project,

          COALESCE(
            (SELECT id FROM projects WHERE id > p.id ORDER BY id ASC LIMIT 1),
            bounds.min_id
          ) AS previous_project_id,

          COALESCE(
            (SELECT id FROM projects WHERE id < p.id ORDER BY id DESC LIMIT 1),
            bounds.max_id
          ) AS next_project_id

        FROM projects p, bounds
        WHERE p.id = $1
      )
      SELECT
        p.id, p.project_name, p.project_link, p.project_description, p.project_stack,

        n.is_first_project,
        n.is_last_project,

        prev.id AS previous_project_id,
        prev.project_name AS previous_project_name,
        prev.project_stack AS previous_project_stack,

        nxt.id AS next_project_id,
        nxt.project_name AS next_project_name,
        nxt.project_stack AS next_project_stack

      FROM projects p
      JOIN neighbours n ON n.id = p.id
      LEFT JOIN projects prev ON prev.id = n.previous_project_id
      LEFT JOIN projects nxt ON nxt.id = n.next_project_id
      WHERE p.id = $1`;
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
