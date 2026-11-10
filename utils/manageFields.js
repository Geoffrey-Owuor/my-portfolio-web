// Field rules for /manage content, shared by the forms (inline errors) and the
// /api/manage routes (the check that counts). `name` is the database column,
// and `max` matches its varchar limit, so an over-long value is a field error
// rather than a 500. The two unlimited text columns get a generous cap so one
// request can't store an unbounded value.
const skillFields = [
  {
    name: "skill_description",
    label: "Skill",
    type: "textarea",
    required: true,
    max: 2000,
  },
];

export const MANAGE_FIELDS = {
  projects: [
    {
      name: "project_name",
      label: "Name",
      type: "text",
      required: true,
      max: 255,
    },
    { name: "project_link", label: "Link", type: "url", max: 255 },
    {
      name: "project_stack",
      label: "Stack (comma-separated)",
      type: "text",
      required: true,
      max: 1000,
    },
    {
      name: "project_description",
      label: "Description",
      type: "markdown",
      required: true,
      max: 20000,
    },
  ],
  experience: [
    {
      name: "work_title",
      label: "Title",
      type: "text",
      required: true,
      max: 50,
    },
    {
      name: "company_name",
      label: "Company",
      type: "text",
      required: true,
      max: 100,
    },
    {
      name: "work_timeline",
      label: "Timeline",
      type: "text",
      required: true,
      max: 255,
    },
    {
      name: "work_description",
      label: "Description",
      type: "markdown",
      required: true,
      max: 3000,
    },
  ],
  education: [
    {
      name: "learning_title",
      label: "Qualification",
      type: "text",
      required: true,
      max: 255,
    },
    {
      name: "institution",
      label: "Institution",
      type: "text",
      required: true,
      max: 255,
    },
    {
      name: "timeline",
      label: "Timeline",
      type: "text",
      required: true,
      max: 255,
    },
    {
      name: "learning_description",
      label: "Description",
      type: "markdown",
      required: true,
      max: 1000,
    },
  ],
  "technical-skills": skillFields,
  "soft-skills": skillFields,
  tools: [
    {
      name: "tool_name",
      label: "Tool name",
      type: "text",
      required: true,
      max: 255,
    },
  ],
};

// Only http(s), because the value ends up in an href on a public page.
const isHttpUrl = (value) => {
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// Returns { values, errors }. `values` holds every field, trimmed, with an
// empty optional field as null. An empty `errors` means the input is fine.
export const validateManageFields = (fields, input) => {
  const values = {};
  const errors = {};

  for (const field of fields) {
    const raw = input?.[field.name];
    const value = typeof raw === "string" ? raw.trim() : "";

    if (!value) {
      values[field.name] = null;
      if (field.required) errors[field.name] = `${field.label} is required.`;
      continue;
    }

    values[field.name] = value;
    if (value.length > field.max) {
      errors[field.name] = `Keep this to ${field.max} characters or fewer.`;
    } else if (field.type === "url" && !isHttpUrl(value)) {
      errors[field.name] =
        "Enter a full link starting with http:// or https://.";
    }
  }

  return { values, errors };
};
