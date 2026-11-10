import { Calendar, UserRound, Clock, ArrowLeft, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate } from "@/utils/Helpers";
import { extractHeadings } from "@/utils/blogHeadings";
import { highlightPlugin } from "@/utils/rehypeHighlight";
import { SITE_URL } from "@/utils/metadata";
import { shareIcons } from "@/assets/assets";
import { ProgressLink } from "../Modules/RouteProgress";
import TableOfContents, {
  MobileTableOfContents,
} from "../Modules/TableOfContents";
import BlogNav from "./BlogNav";

const getShareLink = (platformKey, url, title) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (platformKey) {
    case "twitterLink":
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    case "linkedinLink":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "facebookLink":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "whatsappLink":
      return `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
    default:
      return "#";
  }
};

// Rendered on the server, so readers don't download the markdown and syntax
// highlighting libraries. Only the table of contents runs in the browser.
const ViewBlog = ({ blogPost }) => {
  // One set of ids for the article and the table of contents.
  const headings = extractHeadings(blogPost.blog_content);
  const idsByOffset = new Map(headings.map((h) => [h.offset, h.id]));

  const AnchoredHeading = ({ as: Tag, node, children, ...props }) => (
    <Tag
      id={idsByOffset.get(node.position?.start.offset)}
      style={{ scrollMarginTop: "6rem" }}
      {...props}
    >
      {children}
    </Tag>
  );

  const markdownComponents = {
    h2: (props) => <AnchoredHeading as="h2" {...props} />,
    h3: (props) => <AnchoredHeading as="h3" {...props} />,
  };

  const shareUrl = `${SITE_URL}/blog/${blogPost.slug}`;

  return (
    <div>
      <div className="container-page flex flex-col py-8 lg:flex-row lg:gap-6">
        <article className="w-full max-w-none min-w-0">
          {/* Header Section */}
          <header className="mb-6">
            <h1 className="text-text-primary text-h1 mb-4 font-semibold">
              {blogPost.blog_title}
            </h1>

            {/* The tagline reads as a standfirst under the title now that the
                author card is gone. */}
            {blogPost.author_tagline && (
              <p className="bg-accent/10 text-accent rounded-chip mb-6 w-fit px-3 py-1 font-mono text-xs text-nowrap">
                {blogPost.author_tagline}
              </p>
            )}

            {/* Meta Information */}
            <div className="text-text-muted flex flex-wrap items-center gap-4 text-sm sm:gap-6 sm:text-base">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium">{blogPost.blog_author}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{formatDate(blogPost.blog_date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{blogPost.read_time}</span>
              </div>

              <ProgressLink
                href="/blogs"
                className="hover:text-text-primary flex items-center gap-2 transition-colors duration-150"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>back to blogs</span>
              </ProgressLink>
            </div>

            <div className="text-text-muted mt-6 flex items-center gap-4">
              <span className="inline-flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                Share:
              </span>
              <div className="flex items-center gap-2">
                {Object.entries(shareIcons).map(([key, Icon]) => (
                  <a
                    key={key}
                    href={getShareLink(key, shareUrl, blogPost.blog_title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share the blog on ${key.replace("Link", "")}`}
                    className="border-border-subtle hover:border-accent hover:text-text-primary rounded-control border p-2 transition-colors"
                  >
                    <Icon className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          </header>

          {/* Divider */}
          <div className="bg-border-subtle mb-8 h-px sm:mb-12" />

          <MobileTableOfContents headings={headings} />

          {/* Content Section */}
          <div className="prose prose-lg dark:prose-invert prose-img:rounded-card prose-headings:font-semibold prose-a:text-accent max-w-none wrap-break-word">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[highlightPlugin]}
              components={markdownComponents}
            >
              {blogPost.blog_content}
            </ReactMarkdown>
          </div>

          {/* Bottom Divider */}
          <div className="bg-border-subtle mt-12 h-px sm:mt-16" />

          {/* Neighbouring blogs — keeps the reader moving between posts and
              names where each link lands before they commit to it. */}
          <BlogNav blogPost={blogPost} />
        </article>
        {/* The sidebar (only visible on large screens via CSS in the component) */}
        <TableOfContents headings={headings} />
      </div>
    </div>
  );
};

export default ViewBlog;
