// Date formatter
export const formatDate = (dateInput) => {
  return new Date(dateInput).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// simple slugify function to create safe ids from text
export const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

// Flatten markdown source down to a plain-text excerpt — for places that can
// only take a bare string (meta descriptions, Open Graph tags, share text),
// where raw `##`/`**` syntax would otherwise leak out verbatim.
export const stripMarkdown = (text, maxLength = 160) => {
  if (!text) return "";

  const plain = text
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`([^`]*)`/g, "$1") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → their label
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // heading markers
    .replace(/^\s{0,3}>\s?/gm, "") // blockquote markers
    .replace(/^\s{0,3}([-*_]\s*){3,}$/gm, " ") // horizontal rules
    .replace(/^\s{0,3}[-*+]\s+/gm, "") // bullet markers
    .replace(/^\s{0,3}\d+\.\s+/gm, "") // ordered list markers
    .replace(/^\s{0,3}(?=[^\n]*-)[-:\s|]*\|[-:\s|]*$/gm, " ") // table delimiter rows
    .replace(/\|/g, " ") // table pipes
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // italics
    .replace(/~~(.*?)~~/g, "$1") // strikethrough
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;

  // Trim back to the last word boundary so the excerpt never ends mid-word.
  const clipped = plain.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
};
