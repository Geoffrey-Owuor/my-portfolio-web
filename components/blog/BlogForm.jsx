"use client";
import {
  Send,
  ArrowUpRight,
  UserRound,
  Highlighter,
  Signature,
  Library,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import LoadingLine from "../Modules/LoadingLine";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css"; // 2. Import MD styles

const BlogForm = ({
  handleConfirmSubmit,
  formData,
  handleChange,
  isFormValid,
  isSubmitting,
  IsUpdating,
}) => {
  const [isLoadingLine, setIsLoadingLine] = useState(false);
  const { resolvedTheme } = useTheme();

  //Handle change wrapper for md editoe
  const handleEditorChange = (value) => {
    handleChange({
      target: {
        name: "content", // This matches the key in your formData state
        value: value || "", // Ensure we never pass undefined
      },
    });
  };

  // Getting resolved theme
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  return (
    <>
      {isLoadingLine && <LoadingLine />}
      <div className="p-6 sm:p-8">
        <form onSubmit={handleConfirmSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              <Highlighter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900 ring-offset-2 transition-colors placeholder:text-gray-400 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:text-white dark:ring-offset-gray-950 dark:placeholder:text-gray-600 dark:focus:ring-gray-500"
              required
            />
          </div>

          {/* Author Input */}
          <div>
            <label
              htmlFor="author"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              <UserRound className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Author Name
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Your name or pen name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900 ring-offset-2 transition-colors placeholder:text-gray-400 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:text-white dark:ring-offset-gray-950 dark:placeholder:text-gray-600 dark:focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="tagline"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              <Signature className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Tagline
            </label>
            <input
              type="text"
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Your hashtag line"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900 ring-offset-2 transition-colors placeholder:text-gray-400 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:text-white dark:ring-offset-gray-950 dark:placeholder:text-gray-600 dark:focus:ring-gray-500"
              required
            />
          </div>

          {/* Content Textarea */}
          <div data-color-mode={theme}>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="content"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <Library className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                Content
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {formData.content.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            {/* <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              rows={12}
              className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 ring-offset-2 transition-colors placeholder:text-gray-400 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:ring-offset-gray-950 dark:placeholder:text-gray-600 dark:focus:ring-gray-500"
              required
            /> */}
            {/* 4. The MDEditor Component */}
            <MDEditor
              value={formData.content}
              onChange={handleEditorChange}
              height={400}
              preview="edit" // Options: "edit", "live", "preview"
              textareaProps={{
                placeholder:
                  "Write your blog content here... (Markdown supported)",
              }}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Use the toolbar above for bold, italic, lists, and links.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-800"
            >
              <Send className="h-4 w-4" />
              {IsUpdating ? (
                <>
                  Update <span className="hidden sm:block">Post</span>
                </>
              ) : (
                <>
                  Publish <span className="hidden sm:block">Post</span>
                </>
              )}
            </button>
            <Link
              href="/blogs"
              onClick={() => setIsLoadingLine(true)}
              className="flex items-center gap-2 rounded-full bg-gray-300/50 px-6 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-gray-400/50 dark:bg-gray-700/50 dark:hover:bg-gray-600/50"
            >
              View <span className="hidden sm:block">Blogs</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default BlogForm;
