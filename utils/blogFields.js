// Blog post rules, shared by the editor (inline errors) and /api/blogpost (the
// check that counts). The author limit is the column's varchar(125); the text
// columns get a cap so one request can't store an unbounded value.
export const BLOG_LIMITS = {
  title: 200,
  author: 125,
  tagline: 100,
  content: 200_000,
};

const FIELDS = [
  { name: "title", label: "A title", required: true },
  { name: "author", label: "An author name", required: true },
  { name: "tagline", label: "A tagline", required: false },
  { name: "content", label: "Some content", required: true },
];

// Returns { values, errors }. `values` holds every field, trimmed, with an
// empty tagline as null. An empty `errors` means the post can be saved.
export const validateBlog = (input) => {
  const values = {};
  const errors = {};

  for (const { name, label, required } of FIELDS) {
    const raw = input?.[name];
    const value = typeof raw === "string" ? raw.trim() : "";

    if (!value) {
      values[name] = null;
      if (required) errors[name] = `${label} is required.`;
      continue;
    }

    values[name] = value;
    if (value.length > BLOG_LIMITS[name]) {
      errors[name] =
        `Keep this to ${BLOG_LIMITS[name].toLocaleString("en-US")} characters or fewer.`;
    }
  }

  return { values, errors };
};
