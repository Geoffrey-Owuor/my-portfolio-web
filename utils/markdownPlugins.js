import { defaultSchema } from "rehype-sanitize";

// Raw HTML in posts is allowed, limited to GitHub's safe subset (details,
// summary, kbd, sub/sup, dl, br...). Scripts, styles, iframes and event
// handlers are dropped, and ids get a "user-content-" prefix so a post can't
// take over one of the page's own ids.
export const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Let GFM tables keep their column alignment
    th: [...(defaultSchema.attributes?.th ?? []), "align"],
    td: [...(defaultSchema.attributes?.td ?? []), "align"],
  },
};

const walk = (node, visit) => {
  for (const child of node.children ?? []) {
    if (child.type === "element") {
      visit(child);
      walk(child, visit);
    }
  }
};

// Runs after sanitize.
// - Gives each ## / ### heading the id extractHeadings (utils/blogHeadings.js)
//   chose for it, found by its position in the source, so the article and the
//   table of contents always agree.
// - Points in-page links at the sanitized ids: footnotes are written as
//   "#fn-1" but sanitize renamed their targets to "user-content-fn-1".
export const rehypeBlogAnchors =
  ({ idsByOffset } = {}) =>
  (tree) => {
    const ids = new Set();

    walk(tree, (el) => {
      if (
        idsByOffset &&
        (el.tagName === "h2" || el.tagName === "h3") &&
        !el.properties.id
      ) {
        const id = idsByOffset.get(el.position?.start.offset);
        if (id) el.properties.id = id;
      }
      if (typeof el.properties?.id === "string") ids.add(el.properties.id);
    });

    walk(tree, (el) => {
      const href = el.properties?.href;
      if (
        el.tagName !== "a" ||
        typeof href !== "string" ||
        !href.startsWith("#")
      )
        return;
      let target = href.slice(1);
      try {
        target = decodeURIComponent(target);
      } catch {
        // malformed escape: compare the raw fragment
      }
      if (!ids.has(target) && ids.has(`user-content-${target}`)) {
        el.properties.href = `#user-content-${target}`;
      }
    });
  };
