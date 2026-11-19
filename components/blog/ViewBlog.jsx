import { Calendar, UserRound, Clock, ArrowLeft, Share2 } from "lucide-react";
import { formatDate } from "@/utils/Helpers";
import { extractHeadings } from "@/utils/blogHeadings";
import { SITE_URL } from "@/utils/metadata";
import { shareIcons } from "@/assets/assets";
import { ProgressLink } from "../Modules/RouteProgress";
import TableOfContents, {
  MobileTableOfContents,
} from "../Modules/TableOfContents";
import BlogNav from "./BlogNav";
import MarkdownContent from "./MarkdownContent";

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

  const shareUrl = `${SITE_URL}/blog/${blogPost.slug}`;

  // Only worth a mention once the edit falls on a later day than publishing.
  const publishedOn = formatDate(blogPost.blog_date);
  const updatedOn =
    blogPost.updated_at && formatDate(blogPost.updated_at) !== publishedOn
      ? formatDate(blogPost.updated_at)
      : null;

  return (
    <div>
      <div className="container-page flex justify-center gap-10 py-8 xl:gap-16">
        {/* ~72 characters a line at the post's text size */}
        <article className="w-full max-w-3xl min-w-0">
          {/* Header Section */}
          <header className="mb-6">
            <ProgressLink
              href="/blogs"
              className="text-text-muted hover:text-text-primary mb-6 inline-flex items-center gap-1.5 font-mono text-sm transition-colors duration-150"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              back to blogs
            </ProgressLink>

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
                {updatedOn && (
                  <span className="text-text-muted/80">
                    (updated {updatedOn})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{blogPost.read_time}</span>
              </div>
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
          <MarkdownContent
            content={blogPost.blog_content}
            headings={headings}
          />

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
