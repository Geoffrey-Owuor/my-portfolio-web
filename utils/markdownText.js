import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";

// Kept out of utils/Helpers.js so the many client components that import
// Helpers don't ship the markdown parser.

const parser = unified().use(remarkParse).use(remarkGfm);

// Nodes that end a block: their text is kept apart from the next block's
const BLOCKS = new Set([
  "paragraph",
  "heading",
  "listItem",
  "tableCell",
  "blockquote",
  "code",
  "footnoteDefinition",
]);

const collect = (node, out) => {
  switch (node.type) {
    case "text":
    case "inlineCode":
    case "code":
      out.push(node.value);
      if (node.type === "code") out.push("\n");
      return;
    case "image":
      if (node.alt) out.push(node.alt);
      return;
    case "html":
      // Raw HTML (<details>, <kbd>...): its text, not its tags
      out.push(node.value.replace(/<[^>]*>/g, " "));
      return;
    case "break":
      out.push(" ");
      return;
    case "definition":
      return;
  }
  for (const child of node.children ?? []) collect(child, out);
  if (BLOCKS.has(node.type)) out.push("\n");
};

// The text a reader sees once the post is rendered: no syntax, link URLs or
// tags, with blocks kept apart
export const markdownToText = (markdown = "") => {
  const out = [];
  collect(parser.parse(markdown), out);
  return out.join("");
};

// Words a reader actually reads, so `**`, `##`, URLs and tags don't count
export const countPostWords = (markdown = "") =>
  markdownToText(markdown).match(/\S+/g)?.length ?? 0;

const WORDS_PER_MINUTE = 200;

export const estimateReadTime = (markdown) =>
  `${Math.max(1, Math.ceil(countPostWords(markdown) / WORDS_PER_MINUTE))} min read`;
