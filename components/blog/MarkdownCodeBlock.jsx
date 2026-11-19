import CopyCodeButton from "./CopyCodeButton";

// Display names for the tag after the opening ```
const LANGUAGE_NAMES = {
  bash: "Bash",
  sh: "Shell",
  shell: "Shell",
  zsh: "Shell",
  js: "JavaScript",
  javascript: "JavaScript",
  jsx: "JSX",
  mjs: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  py: "Python",
  python: "Python",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  xml: "XML",
  html: "HTML",
  css: "CSS",
  sql: "SQL",
  md: "Markdown",
  markdown: "Markdown",
  diff: "Diff",
  text: "Plain text",
  txt: "Plain text",
  plaintext: "Plain text",
};

const textOf = (node) =>
  node.type === "text"
    ? node.value
    : (node.children ?? []).map(textOf).join("");

const languageOf = (node) => {
  const code = node?.children?.find(
    (child) => child.type === "element" && child.tagName === "code",
  );
  const classes = code?.properties?.className ?? [];
  const lang = classes
    .map(String)
    .find((c) => c.startsWith("language-"))
    ?.slice("language-".length);
  if (!lang) return null;
  return LANGUAGE_NAMES[lang.toLowerCase()] ?? lang;
};

// A fenced code block: one card with a header (language + copy) over a body
// that scrolls sideways. Rendered on the server with the article; only the
// copy button is a client component. Token colours are the --code-* rules in
// styles/globals.css.
const MarkdownCodeBlock = ({ node, children }) => {
  const language = languageOf(node);
  const code = node ? textOf(node).replace(/\n$/, "") : "";

  return (
    <figure className="md-code not-prose border-border-subtle bg-surface-raised rounded-card my-6 border">
      <figcaption className="border-border-subtle flex h-10 items-center justify-between gap-3 border-b pr-1.5 pl-4">
        <span className="text-text-muted truncate font-mono text-xs">
          {language ?? "Code"}
        </span>
        <CopyCodeButton text={code} />
      </figcaption>
      <pre
        tabIndex={0}
        className="text-text-primary focus-visible:outline-accent overflow-x-auto p-4 font-mono text-[0.8125rem] leading-6 [scrollbar-width:thin] focus-visible:outline-2 focus-visible:-outline-offset-2 sm:text-sm"
      >
        {children}
      </pre>
    </figure>
  );
};

export default MarkdownCodeBlock;
