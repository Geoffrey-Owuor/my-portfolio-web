"use client";
import React, { useState } from "react";
import { FileText, User, Send, Loader2 } from "lucide-react";

const BlogPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/blog-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString(),
          readTime: `${Math.ceil(formData.content.split(" ").length / 200)} min read`,
        }),
      });

      if (!response.ok) throw new Error("Failed to post blog");

      setSubmitStatus("success");
      setFormData({ title: "", author: "", content: "" });
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error posting blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.title.trim() && formData.author.trim() && formData.content.trim();

  return (
    <div className="mx-auto mt-12 w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-xl dark:border-gray-800">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 px-6 py-6">
          <h1 className="mb-2 text-xl font-semibold text-white sm:text-3xl">
            Create New Blog Post
          </h1>
          <p className="text-sm text-blue-100 sm:text-base">
            Share your thoughts with the world
          </p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 sm:text-base dark:text-white"
              >
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter an engaging title for your blog post"
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 sm:py-4 sm:text-lg dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-blue-400"
                required
              />
            </div>

            {/* Author Input */}
            <div>
              <label
                htmlFor="author"
                className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 sm:text-base dark:text-white"
              >
                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Author Name
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Your name or pen name"
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 sm:py-4 sm:text-lg dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-purple-400"
                required
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label
                htmlFor="content"
                className="mb-3 flex items-center justify-between text-sm font-semibold text-gray-900 sm:text-base dark:text-white"
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Blog Content
                </span>
                <span className="text-xs font-normal text-gray-500 sm:text-sm dark:text-gray-400">
                  {formData.content.split(" ").filter((word) => word).length}{" "}
                  words
                </span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your blog content here. Use **text** for headings and paragraphs for structure..."
                rows={12}
                className="min-h-[200px] w-full resize-y rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 sm:py-4 sm:text-lg dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-green-400"
                required
              />
              <p className="mt-2 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                Tip: Wrap headings with **double asterisks** for better
                formatting
              </p>
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <p className="text-sm font-medium text-green-800 sm:text-base dark:text-green-200">
                  ✓ Blog post published successfully!
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm font-medium text-red-800 sm:text-base dark:text-red-200">
                  ✗ Failed to publish blog post. Please try again.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 sm:w-auto sm:text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Publish Blog Post
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
