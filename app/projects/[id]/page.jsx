import { query } from "@/lib/db";
import Project from "@/components/Project/Project";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedProjects } from "@/cache/CachedData";
import { notFound } from "next/navigation";
import { stripMarkdown } from "@/utils/Helpers";
import { pageMetadata } from "@/utils/metadata";

// Resolves to [] for an unknown project. A failed read throws instead, so it
// reaches the error page rather than telling crawlers the project is gone, and
// unstable_cache never stores it.
const readProjectInfo = async (id) => {
  // Anything else would make Postgres reject the integer parameter.
  if (!/^\d{1,9}$/.test(id)) return [];

  // Neighbours follow the same order the projects grid renders in, so
  // "previous" is the card above this one on the homepage and "next" is the
  // card below it. Both ends wrap: the first project's previous is the last,
  // and the last project's next is the first.
  const selectQuery = `
    WITH ordered AS (
      SELECT
        id,
        ROW_NUMBER() OVER grid AS position,
        COUNT(*) OVER () AS total,
        LAG(id) OVER grid AS above_id,
        LEAD(id) OVER grid AS below_id,
        FIRST_VALUE(id) OVER grid AS first_id,
        LAST_VALUE(id) OVER (grid ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_id
      FROM projects
      WINDOW grid AS (ORDER BY sort_order, id DESC)
    ),
    neighbours AS (
      SELECT
        id,
        (position = 1) AS is_first_project,
        (position = total) AS is_last_project,
        COALESCE(above_id, last_id) AS previous_project_id,
        COALESCE(below_id, first_id) AS next_project_id
      FROM ordered
      WHERE id = $1
    )
    SELECT
      p.id, p.project_name, p.project_link, p.project_description, p.project_stack, p.project_image,

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
};

const getProjectInfo = cache(
  unstable_cache(readProjectInfo, ["projectInfo"], { tags: ["projects"] }),
);

// Known projects are prerendered; a newer one renders on first visit, then
// stays cached like the rest.
export async function generateStaticParams() {
  const projects = await getCachedProjects();
  return (projects ?? []).map((project) => ({ id: String(project.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const projects = await getProjectInfo(id);
  const projectInfo = projects[0];

  if (!projectInfo) {
    return { title: "Project not found" };
  }

  // project_description is markdown, so it has to be flattened before it can
  // stand in as a meta description.
  const description =
    stripMarkdown(projectInfo.project_description) || projectInfo.project_link;

  return pageMetadata({
    title: projectInfo.project_name,
    description,
    path: `/projects/${projectInfo.id}`,
    type: "article",
  });
}

const page = async ({ params }) => {
  const { id } = await params;
  const projectInfo = await getProjectInfo(id);

  if (!projectInfo[0]) notFound();

  return <Project projectInfo={projectInfo} />;
};

export default page;
