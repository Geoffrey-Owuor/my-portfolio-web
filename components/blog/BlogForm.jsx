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
              className="text-text-muted mb-2 flex items-center gap-2 text-sm font-semibold"
            >
              <Highlighter className="text-text-muted h-4 w-4" />
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title..."
              className="border-border-subtle bg-surface text-text-primary placeholder:text-text-muted focus:border-accent w-full rounded-lg border px-4 py-3 text-base transition-colors focus:outline-none"
              required
            />
          </div>

          {/* Author Input */}
          <div>
            <label
              htmlFor="author"
              className="text-text-muted mb-2 flex items-center gap-2 text-sm font-semibold"
            >
              <UserRound className="text-text-muted h-4 w-4" />
              Author Name
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Your name or pen name"
              className="border-border-subtle bg-surface text-text-primary placeholder:text-text-muted focus:border-accent w-full rounded-lg border px-4 py-3 text-base transition-colors focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="tagline"
              className="text-text-muted mb-2 flex items-center gap-2 text-sm font-semibold"
            >
              <Signature className="text-text-muted h-4 w-4" />
              Tagline
            </label>
            <input
              type="text"
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Your hashtag line"
              className="border-border-subtle bg-surface text-text-primary placeholder:text-text-muted focus:border-accent w-full rounded-lg border px-4 py-3 text-base transition-colors focus:outline-none"
              required
            />
          </div>

          {/* Content Textarea */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="content"
                className="text-text-muted flex items-center gap-2 text-sm font-semibold"
              >
                <Library className="text-text-muted h-4 w-4" />
                Content
              </label>
              <span className="text-text-muted text-xs">
                {formData.content.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <CustomMdEditor value={formData.content} onChange={handleChange} />

            <p className="text-text-muted mt-2 text-xs">
              **Use markdown tools for editing**
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="bg-text-primary text-surface flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
              className="bg-surface-raised text-text-primary hover:bg-border-subtle/50 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors duration-150"
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
