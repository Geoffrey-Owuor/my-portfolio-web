import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString } from "mdast-util-to-string";
import { generateSlug } from "./Helpers";

const parser = unified().use(remarkParse).use(remarkGfm);

// The first use of a slug stays bare, so links to it keep working when a later
// heading repeats its text. "section" covers headings with no slug characters.
const claimId = (text, usedIds) => {
  const slug = generateSlug(text) || "section";
  let id = slug;
  for (let suffix = 1; usedIds.has(id); suffix++) id = `${slug}-${suffix}`;
  usedIds.add(id);
  return id;
};

// The post's top-level ### headings. Parsed rather than pattern-matched, so
// code samples are skipped and inline markdown doesn't leak into the labels.
// `offset` is the heading's position in the source, which is how the article
// renderer finds the id assigned here.
export const extractHeadings = (content) => {
  const usedIds = new Set();

  return parser
    .parse(content ?? "")
    .children.filter((node) => node.type === "heading" && node.depth === 3)
    .map((node) => {
      const text = toString(node);
      return {
        text,
        id: claimId(text, usedIds),
        offset: node.position.start.offset,
      };
    });
};
