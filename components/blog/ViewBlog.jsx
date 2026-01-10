"use client";
import {
  Calendar,
  UserRound,
  Clock,
  ArrowLeft,
  PenLine,
  Share2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import BlogAlert from "../Modules/BlogAlert";
import { useUser } from "@/context/UserContext";
import { formatDate, generateSlug } from "@/utils/Helpers";
import EditBlog from "./EditBlog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import LoadingLine from "../Modules/LoadingLine";
import TableOfContents from "../Modules/TableOfContents";
import { shareIcons } from "@/assets/assets";
import Image from "next/image";

const ViewBlog = ({ blogPost }) => {
  const { id: userId } = useUser();
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

  const handleBlogNavigation = (id) => {
    setShowLoadingLine(true);
    router.push(`/blog/${id}`);
  };

  // 1. Define custom renderer for ReactMarkdown to add IDs to h3
  const MarkdownComponents = {
    h3: ({ node, children, ...props }) => {
      // Extract text content from children to generate the slug
      const text = children?.toString() || "";
      const id = generateSlug(text);
      return (
        <h3 id={id} {...props}>
          {children}
        </h3>
      );
    },
  };

  // 1. State to hold the current URL (avoids hydration mismatch)
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Determine the URL only after mounting on the client
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
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
      <div className="mx-auto mt-10 flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Blog Not Found
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => handleBlogsRoute("/blogs")}
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
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

      <AnimatePresence>
        {showEditBlog && (
          <EditBlog
            setShowEditModal={setShowEditBlog}
            blogInfo={editBlogData}
            setAlertInfo={setAlertInfo}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <article className="w-full max-w-none px-4 py-12 sm:px-6 lg:px-16">
          {/* Header Section */}
          <header className="mb-6">
            <h1 className="mb-6 text-3xl leading-tight font-bold text-gray-900 sm:text-4xl dark:text-white">
              {blogPost.blog_title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 sm:gap-6 sm:text-base dark:text-gray-400">
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

              <button
                disabled={!userId}
                onClick={() => setShowEditBlog(true)}
                className="flex cursor-pointer items-center gap-2 transition-colors duration-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-gray-500"
              >
                <PenLine className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleBlogsRoute("/blogs")}
                className="flex cursor-pointer items-center gap-2 transition-colors duration-200 hover:text-gray-700 dark:hover:text-gray-500"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>back to blogs</span>
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4 text-gray-500 dark:text-gray-400">
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
                    className="rounded-full border border-gray-300 p-2 transition-colors dark:border-gray-600"
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
          <div className="mb-8 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent sm:mb-12 dark:via-gray-700" />

          {/* Content Section */}
          <div className="prose prose-lg dark:prose-invert prose-img:rounded-xl prose-headings:font-semi-bold prose-a:text-blue-600 max-w-none wrap-break-word">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={MarkdownComponents}
            >
              {blogPost.blog_content}
            </ReactMarkdown>
          </div>

          {/* Bottom Divider */}
          <div className="mt-12 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent sm:mt-16 dark:via-gray-700" />

          {/* Author Card and Back & Forward Logs */}
          <div className="mt-8 flex items-center justify-between sm:mt-12">
            <button
              onClick={() => handleBlogNavigation(blogPost.previous_blog_id)}
              disabled={!blogPost.previous_blog_id}
              className="cursor-pointer rounded-full p-2 hover:bg-gray-200/50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700/50"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <div className="inline-flex items-center gap-4 rounded-2xl p-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 sm:h-16 sm:w-16">
                <span className="text-base font-bold text-white sm:text-xl">
                  {blogPost.blog_author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="hidden sm:block">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
                  {blogPost.blog_author}
                </h3>
                <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
                  {blogPost.author_tagline}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleBlogNavigation(blogPost.next_blog_id)}
              disabled={!blogPost.next_blog_id}
              className="cursor-pointer rounded-full p-2 hover:bg-gray-200/50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700/50"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>
        </article>
        {/* 3. The Sidebar (Only visible on large screens via CSS in component) */}
        <TableOfContents content={blogPost.blog_content} />
      </div>
    </div>
  );
};

export default ViewBlog;
