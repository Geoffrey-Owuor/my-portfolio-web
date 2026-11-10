import "server-only";
import { MANAGE_FIELDS } from "@/utils/manageFields";

// The only source of table and column names for /api/manage: SQL identifiers
// are never built from request input.
//
// `placement` says where a new row goes in manual order. A resource without
// one has no sort_order and can't be reordered.
const RESOURCES = {
  projects: { table: "projects", tag: "projects", placement: "top" },
  experience: { table: "workexperience", tag: "experiences", placement: "top" },
  education: { table: "education", tag: "education", placement: "top" },
  "technical-skills": {
    table: "technical_skills",
    tag: "skills",
    placement: "bottom",
  },
  "soft-skills": { table: "soft_skills", tag: "skills", placement: "bottom" },
  // Stays alphabetical by itself, so there is no manual order to keep.
  tools: { table: "tools", tag: "toolNames" },
};

// hasOwn, so a path like /api/manage/constructor is just an unknown resource.
export const getResource = (name) =>
  Object.hasOwn(RESOURCES, name)
    ? { ...RESOURCES[name], fields: MANAGE_FIELDS[name] }
    : null;

export const insertRow = ({ table, placement }, columns, params) => {
  const columnList = columns.join(", ");
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");

  if (!placement) {
    return {
      text: `INSERT INTO ${table} (${columnList}) VALUES (${placeholders}) RETURNING id`,
      params,
    };
  }

  const position =
    placement === "top"
      ? "COALESCE(MIN(sort_order), 1) - 1"
      : "COALESCE(MAX(sort_order), 0) + 1";

  return {
    text: `INSERT INTO ${table} (${columnList}, sort_order)
           SELECT ${placeholders}, ${position} FROM ${table}
           RETURNING id`,
    params,
  };
};

export const updateRow = ({ table }, columns, params, id) => ({
  text: `UPDATE ${table}
         SET ${columns.map((column, i) => `${column} = $${i + 1}`).join(", ")}
         WHERE id = $${columns.length + 1}
         RETURNING id`,
  params: [...params, id],
});

export const deleteRow = ({ table }, id) => ({
  text: `DELETE FROM ${table} WHERE id = $1 RETURNING id`,
  params: [id],
});

// One statement, so it sees a single snapshot: it rewrites the order only when
// the submitted ids are exactly the table's ids, and otherwise changes nothing
// and returns no rows.
export const reorderRows = ({ table }, ids) => ({
  text: `WITH submitted AS (
           SELECT id, ord FROM unnest($1::int[]) WITH ORDINALITY AS u(id, ord)
         ),
         check_list AS (
           SELECT (SELECT COUNT(*) FROM ${table}) = $2::int
              AND (SELECT COUNT(*) FROM ${table} JOIN submitted USING (id)) = $2::int
              AS matches
         )
         UPDATE ${table} AS target
         SET sort_order = submitted.ord
         FROM submitted, check_list
         WHERE target.id = submitted.id AND check_list.matches
         RETURNING target.id`,
  params: [ids, ids.length],
});
