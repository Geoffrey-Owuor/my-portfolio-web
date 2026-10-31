"use client";
import {
  Calendar,
  UserRound,
  Clock,
  ArrowLeft,
  Share2,
  PenLine,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "../Modules/Toaster";
import { formatDate, generateSlug } from "@/utils/Helpers";
import EditBlog from "./EditBlog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";
import { useProgressRouter } from "../Modules/RouteProgress";
import TableOfContents from "../Modules/TableOfContents";
import { shareIcons } from "@/assets/assets";
import BlogNav from "./BlogNav";

const ViewBlog = ({ blogPost, userId }) => {
  const router = useRouter();
  const [showEditBlog, setShowEditBlog] = useState(false);
  const progressRouter = useProgressRouter();
  const toast = useToast();

  const shareIconEntries = Object.entries(shareIcons);

  const handleBlogsRoute = (link) => {
    progressRouter.push(link);
  };

  // 1. Define custom renderer for ReactMarkdown to add IDs to h3
  const MarkdownComponents = {
    h3: ({ node, children, ...props }) => {
      // Extract text content from children to generate the slug
      const text = children?.toString() || "";
      const id = generateSlug(text);
      return (
        <h3 id={id} style={{ scrollMarginTop: "6rem" }} {...props}>
          {children}
        </h3>
      );
    },
  };

  // 1. State to hold the current URL (avoids hydration mismatch)
  const [currentUrl, setCurrentUrl] = useState("");

  // UseEffect to run some functionalities on mount
  useEffect(() => {
    // Determine the URL only after mounting on the client
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    // The flags mark position in the /blogs listing, which runs newest first —
    // so the first blog is the newset one written and the last is the oldest.
    // A fixed id, so a re-run (Strict Mode, or the same flags again) replaces
    // the note instead of stacking a second copy.
    if (blogPost.is_first_blog) {
      toast.info("More magic coming soon! 🔮", {
        id: "blog-position",
        title: "You've reached the latest post",
      });
    } else if (blogPost.is_last_blog) {
      toast.info("Where the magic began. 🕰️🚀", {
        id: "blog-position",
        title: "This is my very first post",
      });
    }
  }, [blogPost.is_first_blog, blogPost.is_last_blog, toast]);

  // 2. Helper to generate share links based on the platform key
  const getShareLink = (platformKey, url, title) => {
    if (!url) return "#"; // Fallback if URL isn't loaded yet

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    switch (platformKey) {
      case "twitterLink":
        // X (Twitter) format
        return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
      case "linkedinLink":
        // LinkedIn format
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      case "facebookLink":
        // Facebook format
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case "whatsappLink":
        // WhatsApp format
        return `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
      default:
        return "#";
    }
  };

  // Check if blogPost is null, undefined, or empty
  if (!blogPost || Object.keys(blogPost).length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <h2 className="text-text-primary mb-4 text-3xl font-bold">
            Blog Not Found
          </h2>
          <p className="text-text-muted mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => handleBlogsRoute("/blogs")}
            className="bg-text-primary text-surface rounded-control inline-flex items-center gap-2 px-6 py-3 font-medium transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  // Data needed by the Edit Blog Modal
  const editBlogData = {
    blog_id: blogPost.id,
    blog_title: blogPost.blog_title,
    blog_author: blogPost.blog_author,
    blog_content: blogPost.blog_content,
    author_tagline: blogPost.author_tagline,
  };
  return (
    <div>
      <EditBlog
        setShowEditModal={setShowEditBlog}
        showEditModal={showEditBlog}
        blogInfo={editBlogData}
      />

      <div className="container-page flex flex-col py-8 lg:flex-row lg:gap-6">
        <article className="w-full max-w-none min-w-0">
          {/* Header Section */}
          <header className="mb-6">
            <h1 className="text-text-primary text-h1 mb-4 font-semibold">
              {blogPost.blog_title}
            </h1>

            {/* The tagline doubles as the post's meta description, so it reads
                as a standfirst under the title now that the author card is gone. */}
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

              {/* The edit button */}
              {userId && (
                <button
                  onClick={() => setShowEditBlog(true)}
                  className="hover:text-text-primary flex cursor-pointer items-center gap-2 transition-colors duration-150"
                >
                  <PenLine className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Edit</span>
                </button>
              )}

              <button
                onClick={() => handleBlogsRoute("/blogs")}
                className="hover:text-text-primary flex cursor-pointer items-center gap-2 transition-colors duration-150"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>back to blogs</span>
              </button>
            </div>

            <div className="text-text-muted mt-6 flex items-center gap-4">
              <span className="inline-flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                Share:
              </span>
              <div className="flex items-center gap-2">
                {shareIconEntries.map(([key, Icon]) => (
                  <a
                    key={key}
                    href={getShareLink(key, currentUrl, blogPost.blog_title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share the blog on ${key.replace("Link", "")}`}
                    className="border-border-subtle hover:border-accent hover:text-text-primary rounded-full border p-2 transition-colors"
                  >
                    <Icon className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          </header>

          {/* Divider */}
          <div className="bg-border-subtle mb-8 h-px sm:mb-12" />

          {/* Content Section */}
          <div className="prose prose-lg dark:prose-invert prose-img:rounded-card prose-headings:font-semibold prose-a:text-accent max-w-none wrap-break-word">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={MarkdownComponents}
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
        {/* 3. The Sidebar (Only visible on large screens via CSS in component) */}
        <TableOfContents content={blogPost.blog_content} />
      </div>
    </div>
  );
};

export default ViewBlog;
