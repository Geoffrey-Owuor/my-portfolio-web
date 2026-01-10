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
import LoadingLine from "../Modules/LoadingLine";
import CustomMdEditor from "./CustomMdEditor";

const BlogForm = ({
  handleConfirmSubmit,
  formData,
  handleChange,
  isFormValid,
  isSubmitting,
  IsUpdating,
}) => {
  const [isLoadingLine, setIsLoadingLine] = useState(false);

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
          <div>
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
            <CustomMdEditor value={formData.content} onChange={handleChange} />

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Use markdown tools for editing
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
