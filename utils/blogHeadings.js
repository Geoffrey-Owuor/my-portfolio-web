import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { toString } from "mdast-util-to-string";
import { generateSlug } from "./Helpers";

const parser = unified().use(remarkParse).use(remarkGfm);

// The anchor for a heading node. Works on both trees, so the article's ids and
// the table of contents' links can't disagree.
export const headingId = (node) => generateSlug(toString(node));

// The post's top-level ### headings. Parsed rather than pattern-matched, so
// code samples are skipped and inline markdown doesn't leak into the labels.
export const extractHeadings = (content) =>
  parser
    .parse(content ?? "")
    .children.filter((node) => node.type === "heading" && node.depth === 3)
    .map((node) => ({ text: toString(node), id: headingId(node) }));
