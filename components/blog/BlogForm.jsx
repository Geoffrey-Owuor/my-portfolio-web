"use client";
import {
  Send,
  ArrowUpRight,
  UserRound,
  Highlighter,
  Signature,
  Library,
} from "lucide-react";
import { ProgressLink } from "../Modules/RouteProgress";
import CustomMdEditor from "./CustomMdEditor";
import { countWords } from "@/utils/Helpers";
import { BLOG_LIMITS } from "@/utils/blogFields";

const inputClass =
  "border-border-subtle bg-surface text-text-primary placeholder:text-text-muted focus:border-accent aria-invalid:border-danger rounded-control w-full border px-4 py-3 text-base transition-colors focus:outline-none";

const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} className="text-danger mt-1.5 text-sm">
      {message}
    </p>
  ) : null;

// What marks a field invalid and points it at its message.
const invalidProps = (errors, name) =>
  errors[name]
    ? { "aria-invalid": true, "aria-describedby": `${name}-error` }
    : {};

const BlogForm = ({
  handleConfirmSubmit,
  formData,
  handleChange,
  errors = {},
  isSubmitting,
  IsUpdating,
  canDiscard,
  onDiscard,
}) => {
  return (
    <>
      <div className="p-6 sm:p-8">
        <form onSubmit={handleConfirmSubmit} noValidate className="space-y-6">
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
              maxLength={BLOG_LIMITS.title}
              {...invalidProps(errors, "title")}
              className={inputClass}
            />
            <FieldError id="title-error" message={errors.title} />
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
              maxLength={BLOG_LIMITS.author}
              {...invalidProps(errors, "author")}
              className={inputClass}
            />
            <FieldError id="author-error" message={errors.author} />
          </div>
          <div>
            <label
              htmlFor="tagline"
              className="text-text-muted mb-2 flex items-center gap-2 text-sm font-semibold"
            >
              <Signature className="text-text-muted h-4 w-4" />
              Tagline
              <span className="font-normal">(optional)</span>
            </label>
            <input
              type="text"
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Your hashtag line"
              maxLength={BLOG_LIMITS.tagline}
              {...invalidProps(errors, "tagline")}
              className={inputClass}
            />
            <FieldError id="tagline-error" message={errors.tagline} />
          </div>

          {/* Content Textarea */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="markdown-textarea"
                className="text-text-muted flex items-center gap-2 text-sm font-semibold"
              >
                <Library className="text-text-muted h-4 w-4" />
                Content
              </label>
              <span className="text-text-muted text-xs">
                {countWords(formData.content)} words
              </span>
            </div>
            <CustomMdEditor
              value={formData.content}
              onChange={handleChange}
              invalid={Boolean(errors.content)}
              describedBy={errors.content ? "content-error" : undefined}
            />
            <FieldError id="content-error" message={errors.content} />

            <p className="text-text-muted mt-2 text-xs">
              **Use markdown tools for editing**
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-text-primary text-surface rounded-control flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
            <ProgressLink
              href="/blogs"
              className="bg-surface-raised text-text-primary hover:bg-border-subtle/50 rounded-control flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors duration-150"
            >
              View <span className="hidden sm:block">Blogs</span>
              <ArrowUpRight className="h-4 w-4" />
            </ProgressLink>
            {canDiscard && (
              <button
                type="button"
                onClick={onDiscard}
                className="text-text-muted hover:text-danger rounded-control px-3 py-3 text-sm font-semibold transition-colors duration-150"
              >
                Discard <span className="hidden sm:inline">changes</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default BlogForm;
