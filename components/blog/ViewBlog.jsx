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
import BlogAlert from "../Modules/BlogAlert";
import { formatDate, generateSlug } from "@/utils/Helpers";
import EditBlog from "./EditBlog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";
import LoadingLine from "../Modules/LoadingLine";
import TableOfContents from "../Modules/TableOfContents";
import { shareIcons } from "@/assets/assets";
import Image from "next/image";
import BlogNav from "./BlogNav";

const ViewBlog = ({ blogPost, userId }) => {
  const router = useRouter();
  const [showEditBlog, setShowEditBlog] = useState(false);
  const [showLoadingLine, setShowLoadingLine] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    showAlert: false,
    type: "",
    alertMessage: "",
  });

  const shareIconEntries = Object.entries(shareIcons);

  const handleBlogsRoute = (link) => {
    setShowLoadingLine(true);
    router.push(link);
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
    // Disable smooth scrolling on mount — on the canvas, which is what
    // actually scrolls now (see components/Layout/AppCanvas.jsx).
    const canvas = document.getElementById("app-canvas");
    if (canvas) canvas.style.scrollBehavior = "auto";

    // Determine the URL only after mounting on the client
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    // The flags mark position in the /blogs listing, which runs newest first —
    // so the first blog is the newset one written and the last is the oldest.
    if (blogPost.is_first_blog) {
      setAlertInfo({
        showAlert: true,
        type: "success",
        alertMessage:
          "You've reached the latest blog. More magic coming soon! 🔮",
      });
    } else if (blogPost.is_last_blog) {
      setAlertInfo({
        showAlert: true,
        type: "success",
        alertMessage: "Where the magic began. My very first post! 🕰️🚀",
      });
    }

    return () => {
      if (canvas) canvas.style.scrollBehavior = ""; // restore on unmount
    };
  }, []);

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
      <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-5 py-16 sm:px-6 lg:px-16">
        <div className="text-center">
          <h2 className="text-text-primary mb-4 text-3xl font-bold">
            Blog Not Found
          </h2>
          <p className="text-text-muted mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => handleBlogsRoute("/blogs")}
            className="bg-text-primary text-surface inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-opacity hover:opacity-90"
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
      <BlogAlert
        message={alertInfo.alertMessage}
        type={alertInfo.type}
        isVisible={alertInfo.showAlert}
        hideAlert={() =>
          setAlertInfo({ type: "", alertMessage: "", showAlert: false })
        }
      />

      {showLoadingLine && <LoadingLine />}

      <EditBlog
        setShowEditModal={setShowEditBlog}
        showEditModal={showEditBlog}
        blogInfo={editBlogData}
        setAlertInfo={setAlertInfo}
      />

      <div className="mx-auto flex max-w-7xl flex-col px-4 py-8 lg:flex-row lg:gap-6">
        <article className="w-full max-w-none min-w-0">
          {/* Header Section */}
          <header className="mb-6">
            <h1 className="font-dm-mono text-text-primary mb-4 text-3xl leading-tight font-bold sm:text-4xl">
              {blogPost.blog_title}
            </h1>

            {/* The tagline doubles as the post's meta description, so it reads
                as a standfirst under the title now that the author card is gone. */}
            {blogPost.author_tagline && (
              <p className="font-dm-mono bg-accent/10 text-accent mb-6 w-fit rounded-full px-3 py-1 text-xs text-nowrap">
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
                {shareIconEntries.map(([key, shareIcon]) => (
                  <a
                    key={key}
                    href={getShareLink(key, currentUrl, blogPost.blog_title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share the blog on ${key.replace("Link", "")}`}
                    className="border-border-subtle hover:border-accent rounded-full border p-2 transition-colors"
                  >
                    <Image
                      src={shareIcon.logo}
                      alt={shareIcon.link}
                      width={16}
                      height={16}
                      className="h-3 w-3 dark:invert"
                    />
                  </a>
                ))}
              </div>
            </div>
          </header>

          {/* Divider */}
          <div className="bg-border-subtle mb-8 h-px sm:mb-12" />

          {/* Content Section */}
          <div className="prose prose-lg dark:prose-invert prose-img:rounded-xl prose-headings:font-semi-bold prose-a:text-accent max-w-none wrap-break-word">
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
          <BlogNav
            blogPost={blogPost}
            onNavigate={() => setShowLoadingLine(true)}
          />
        </article>
        {/* 3. The Sidebar (Only visible on large screens via CSS in component) */}
        <TableOfContents content={blogPost.blog_content} />
      </div>
    </div>
  );
};

export default ViewBlog;
