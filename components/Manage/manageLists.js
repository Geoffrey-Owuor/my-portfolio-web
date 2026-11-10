// How each list reads on /manage. Field rules live in utils/manageFields.js.
export const MANAGE_LISTS = {
  projects: {
    noun: "project",
    title: (row) => row.project_name,
    detail: (row) => row.project_stack,
    reorderable: true,
  },
  experience: {
    noun: "role",
    title: (row) => row.work_title,
    detail: (row) => `${row.company_name} · ${row.work_timeline}`,
    reorderable: true,
  },
  education: {
    noun: "qualification",
    title: (row) => row.learning_title,
    detail: (row) => `${row.institution} · ${row.timeline}`,
    reorderable: true,
  },
  "technical-skills": {
    noun: "technical skill",
    title: (row) => row.skill_description,
    reorderable: true,
  },
  "soft-skills": {
    noun: "soft skill",
    title: (row) => row.skill_description,
    reorderable: true,
  },
  tools: {
    noun: "tool",
    title: (row) => row.tool_name,
    reorderable: false,
  },
};

export const capitalize = (text) =>
  text.charAt(0).toUpperCase() + text.slice(1);
