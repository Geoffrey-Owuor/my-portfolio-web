"use client";
import { Calendar, UserRound, Clock, ArrowLeft, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import BlogAlert from "../Modules/BlogAlert";
import { useUser } from "@/context/UserContext";
import { formatDate, generateSlug } from "@/utils/Helpers";
import EditBlog from "./EditBlog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import LoadingLine from "../Modules/LoadingLine";
import TableOfContents from "../Modules/TableOfContents";

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
        <h3 id={id} {...props}>
          {children}
        </h3>
      );
    },
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

      <div className="mx-auto flex max-w-7xl gap-10">
        <article className="px-4 py-12 sm:px-6 lg:px-8">
          {/* Header Section */}
          <header className="mb-8 sm:mb-12">
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
          </header>

          {/* Divider */}
          <div className="mb-8 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent sm:mb-12 dark:via-gray-700" />

          {/* Content Section */}
          <div className="prose prose-lg dark:prose-invert prose-img:rounded-xl prose-headings:font-semi-bold prose-a:text-blue-600 max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={MarkdownComponents}
            >
              {blogPost.blog_content}
            </ReactMarkdown>
          </div>

          {/* Bottom Divider */}
          <div className="mt-12 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent sm:mt-16 dark:via-gray-700" />

          {/* Author Card */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-2xl p-6 sm:mt-12 sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 sm:h-16 sm:w-16">
                <span className="text-base font-bold text-white sm:text-xl">
                  {blogPost.blog_author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
                  {blogPost.blog_author}
                </h3>
                <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
                  {blogPost.author_tagline}
                </p>
              </div>
            </div>
          </div>
        </article>
        {/* 3. The Sidebar (Only visible on large screens via CSS in component) */}
        <TableOfContents content={blogPost.blog_content} />
      </div>
    </div>
  );
};

export default ViewBlog;
