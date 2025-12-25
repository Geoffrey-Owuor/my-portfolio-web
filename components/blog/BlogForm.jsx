import { FileText, User, Send, Tags } from "lucide-react";

const BlogForm = ({
  handleConfirmSubmit,
  formData,
  handleChange,
  isFormValid,
  isSubmitting,
  IsUpdating,
}) => {
  return (
    <div className="p-6 sm:p-8">
      <form onSubmit={handleConfirmSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Blog Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter an engaging title..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 ring-offset-2 transition-colors placeholder:text-gray-400 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:ring-offset-gray-950 dark:placeholder:text-gray-600 dark:focus:ring-gray-500"
            required
          />
        </div>

        {/* Author Input */}
        <div>
          <label
            htmlFor="author"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Author Name
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Your name or pen name"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 ring-offset-2 transition-colors placeholder:text-gray-400 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:ring-offset-gray-950 dark:placeholder:text-gray-600 dark:focus:ring-gray-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="tagline"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <Tags className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            Tagline
          </label>
          <input
            type="text"
            id="tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            placeholder="Your hashtag line"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 ring-offset-2 transition-colors placeholder:text-gray-400 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:ring-offset-gray-950 dark:placeholder:text-gray-600 dark:focus:ring-gray-500"
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
              <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              Content
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {formData.content.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog content here..."
            rows={12}
            className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 ring-offset-2 transition-colors placeholder:text-gray-400 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:ring-offset-gray-950 dark:placeholder:text-gray-600 dark:focus:ring-gray-500"
            required
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Markdown formatting is supported. Use **bold** for emphasis.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus:ring-gray-800 dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
          >
            <Send className="h-4 w-4" />
            {IsUpdating ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
