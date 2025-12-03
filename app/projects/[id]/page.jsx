import { query } from "@/lib/db";
import Project from "@/components/Project/Project";

const getProjectInfo = async (id) => {
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
};

const page = async ({ params }) => {
  const { id } = await params;
  const projectInfo = await getProjectInfo(id);

  return <Project projectInfo={projectInfo} />;
};

export default page;
