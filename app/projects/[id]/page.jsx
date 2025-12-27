import { query } from "@/lib/db";
import Project from "@/components/Project/Project";
import { cache, Suspense } from "react";
import { ProjectSkeleton } from "@/components/Skeletons/ProjectSkeleton";

const getProjectInfo = cache(async (id) => {
  try {
    const selectQuery = `SELECT id, project_name, project_link, project_description
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

  return {
    title: projectInfo.project_name,
    description: projectInfo.project_link,

    openGraph: {
      title: projectInfo.project_name,
      description: projectInfo.project_link,
      type: "article",
      authors: ["Geoffrey Owuor"],
    },
  };
}

const page = async ({ params }) => {
  const { id } = await params;
  const projectInfo = await getProjectInfo(id);

  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <Project projectInfo={projectInfo} />
    </Suspense>
  );
};

export default page;
