import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { highlightPlugin } from "@/utils/rehypeHighlight";
import { rehypeBlogAnchors, sanitizeSchema } from "@/utils/markdownPlugins";
import MarkdownCodeBlock from "./MarkdownCodeBlock";
import HeadingLink from "./HeadingLink";

// react-markdown passes the hast `node` to every custom component; it must
// not reach the DOM (it renders as node="[object Object]")
const withoutNode = ({ node: _node, ...props }) => props;

const baseComponents = {
  pre: MarkdownCodeBlock,
  // Absolute links open in a new tab, so the reader keeps their place
  a: (props) => {
    const { href, ...rest } = withoutNode(props);
    const isExternal = typeof href === "string" && /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        {...rest}
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      />
    );
  },
  // Wide tables scroll sideways instead of widening the page on phones
  table: (props) => (
    <div className="scrollbar-slim my-8 overflow-x-auto">
      <table {...withoutNode(props)} className="my-0" />
    </div>
  ),
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element -- post images of unknown size
    <img
      {...withoutNode(props)}
      alt={props.alt ?? ""}
      loading="lazy"
      decoding="async"
    />
  ),
};

// Section headings with a self-link, for the published post
const SectionHeading = ({ as: Tag, node: _node, id, children, ...props }) =>
  id && !props.className?.includes("sr-only") ? (
    <Tag id={id} {...props} className="group">
      {children}
      <HeadingLink id={id} />
    </Tag>
  ) : (
    <Tag id={id} {...props}>
      {children}
    </Tag>
  );

const postComponents = {
  ...baseComponents,
  h2: (props) => <SectionHeading as="h2" {...props} />,
  h3: (props) => <SectionHeading as="h3" {...props} />,
};

const SIZE_CLASSES = { lg: "prose-lg", sm: "prose-sm" };

// Post markdown, shared by the post page (on the server) and the editor
// preview (in the browser) so both render the same thing. `headings` comes
// from extractHeadings and supplies the ids; the preview passes none.
const MarkdownContent = ({ content, headings, size = "lg" }) => {
  const idsByOffset = headings
    ? new Map(headings.map((h) => [h.offset, h.id]))
    : undefined;

  return (
    <div
      className={`md-content prose ${SIZE_CLASSES[size]} dark:prose-invert prose-img:rounded-card prose-headings:font-semibold prose-headings:scroll-mt-6 prose-a:text-accent max-w-none wrap-break-word`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // Ids are prefixed once, by sanitize; rehypeBlogAnchors fixes the links
        remarkRehypeOptions={{ clobberPrefix: "" }}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, sanitizeSchema],
          highlightPlugin,
          [rehypeBlogAnchors, { idsByOffset }],
        ]}
        components={headings ? postComponents : baseComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
