"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Clamp-safe markdown for card previews.
 *
 * Every block-level node is flattened to an inline <span> so the whole preview
 * stays one continuous inline flow — that is what keeps `line-clamp-*` on the
 * wrapper honest. Inline emphasis (bold, italics, code, strikethrough) still
 * renders; headings, images and rules are stripped of their block styling so a
 * long README-style description can't blow out a card's height.
 */
const Flatten = ({ children }) => <span>{children} </span>;

// Headings keep a little weight so they still read as labels once flattened.
const FlatHeading = ({ children }) => (
  <span className="text-text-primary font-semibold">{children} </span>
);

const previewComponents = {
  h1: FlatHeading,
  h2: FlatHeading,
  h3: FlatHeading,
  h4: FlatHeading,
  h5: FlatHeading,
  h6: FlatHeading,
  p: Flatten,
  blockquote: Flatten,
  ul: Flatten,
  ol: Flatten,
  li: ({ children }) => <span>• {children} </span>,
  table: Flatten,
  thead: Flatten,
  tbody: Flatten,
  tr: Flatten,
  th: Flatten,
  td: Flatten,
  pre: ({ children }) => <span>{children}</span>,
  code: ({ children }) => <code className="md-inline-code">{children}</code>,
  // The card itself is the link target, so nested anchors are downgraded to
  // plain text — an <a> inside a clickable card is both invalid and confusing.
  a: ({ children }) => <span className="text-accent">{children}</span>,
  img: () => null,
  hr: () => null,
  br: () => <span> </span>,
  input: () => null, // gfm task-list checkboxes
};

const MarkdownPreview = ({ children, className = "" }) => {
  if (!children) return null;

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={previewComponents}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
