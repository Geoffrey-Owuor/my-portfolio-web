"use server";
import { query } from "@/lib/db";
import { unstable_cache } from "next/cache";

// Getting stack data
const getToolNames = async () => {
  try {
    const selectQuery = `SELECT id, tool_name FROM tools ORDER BY tool_name`;
    const toolNames = await query(selectQuery);
    return toolNames;
  } catch (error) {
    console.error("Failed to fetch tool names:", error);
    return []; //Return empty array or an error
  }
};

// Getting skills data
const getSkills = async () => {
  try {
    const query1 = `SELECT id, skill_description FROM soft_skills ORDER BY id`;
    const query2 = `SELECT id, skill_description FROM technical_skills ORDER BY id`;

    const [softResult, techResult] = await Promise.all([
      query(query1),
      query(query2),
    ]);

    return {
      technicalSkills: techResult,
      softSkills: softResult,
    };
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return { technicalSkills: [], softSkills: [] };
  }
};

// Getting projects data
const getProjects = async () => {
  try {
    const selectQuery = `SELECT id, project_name, project_link, project_description, project_stack
        FROM projects
        ORDER BY id DESC`;

    const projects = await query(selectQuery);
    return projects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return []; //Returning an empty array on error
  }
};

// Geetting experience data
const getExperience = async () => {
  try {
    const selectQuery = `SELECT id, work_timeline, company_name, work_description, work_title
        FROM workexperience
        ORDER BY id ASC`;

    const experiences = await query(selectQuery);
    return experiences;
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return []; //Return an empty array on error
  }
};

// Getting education data
const getEducation = async () => {
  try {
    const selectQuery = `SELECT id, institution, timeline, learning_description, learning_title
        FROM education
        ORDER BY id DESC`;

    const educationData = await query(selectQuery);
    return educationData;
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return []; //Return an empty array on error
  }
};

// Caching function calls with unstable cache
export const getCachedToolNames = unstable_cache(getToolNames, ["toolNames"], {
  tags: ["toolNames"],
});

export const getCachedSkills = unstable_cache(getSkills, ["skills"], {
  tags: ["skills"],
});

export const getCachedProjects = unstable_cache(getProjects, ["projects"], {
  tags: ["projects"],
});

export const getCachedExperience = unstable_cache(
  getExperience,
  ["experiences"],
  {
    tags: ["experiences"],
  },
);

export const getCachedEducation = unstable_cache(getEducation, ["education"], {
  tags: ["education"],
});
