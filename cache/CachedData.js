"use server";
import { query } from "@/lib/db";
import { unstable_cache } from "next/cache";

// Readers throw on failure *inside* the cache so unstable_cache never stores
// a failed read — previously a caught error returned [] and that empty result
// was cached until the next revalidation. `safely` catches outside the cache
// instead and resolves to null, so callers can tell "couldn't load" (null)
// apart from "nothing published yet" ([]).
const safely = (cachedReader, label) => async () => {
  try {
    return await cachedReader();
  } catch (error) {
    console.error(`Failed to fetch ${label}:`, error);
    return null;
  }
};

// Getting stack data
const getToolNames = async () => {
  const selectQuery = `SELECT id, tool_name FROM tools ORDER BY tool_name`;
  const toolNames = await query(selectQuery);
  return toolNames;
};

// Getting skills data
const getSkills = async () => {
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
};

// Getting projects data
const getProjects = async () => {
  const selectQuery = `SELECT id, project_name, project_link, project_description, project_stack
      FROM projects
      ORDER BY id DESC`;

  const projects = await query(selectQuery);
  return projects;
};

// Geetting experience data
const getExperience = async () => {
  const selectQuery = `SELECT id, work_timeline, company_name, work_description, work_title
      FROM workexperience
      ORDER BY id DESC`;

  const experiences = await query(selectQuery);
  return experiences;
};

// Getting education data
const getEducation = async () => {
  const selectQuery = `SELECT id, institution, timeline, learning_description, learning_title
      FROM education
      ORDER BY id DESC`;

  const educationData = await query(selectQuery);
  return educationData;
};

// Caching function calls with unstable cache
export const getCachedToolNames = safely(
  unstable_cache(getToolNames, ["toolNames"], { tags: ["toolNames"] }),
  "tool names",
);

export const getCachedSkills = safely(
  unstable_cache(getSkills, ["skills"], { tags: ["skills"] }),
  "skills",
);

export const getCachedProjects = safely(
  unstable_cache(getProjects, ["projects"], { tags: ["projects"] }),
  "projects",
);

export const getCachedExperience = safely(
  unstable_cache(getExperience, ["experiences"], { tags: ["experiences"] }),
  "experiences",
);

export const getCachedEducation = safely(
  unstable_cache(getEducation, ["education"], { tags: ["education"] }),
  "education",
);
