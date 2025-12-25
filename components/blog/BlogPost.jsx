"use client";
import { useState } from "react";
import { FileText, User, Send, Tags } from "lucide-react";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import { AnimatePresence } from "framer-motion";
import LogoutButton from "../Modules/LogoutButton";
import UserInfoCard from "../Modules/UserInfoCard";
import { useUser } from "@/context/UserContext";
import BlogAlert from "../Modules/BlogAlert";
import apiClient from "@/lib/AxiosClient";

const BlogPost = () => {
  const { name } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    author: name,
    tagline: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    showAlert: "",
    type: "",
    alertMessage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleSubmit = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);

    try {
      // Blog post api endpoint
      const response = await apiClient.post("/blogpost", {
        ...formData,
        readTime: `${Math.ceil(formData.content.split(" ").length / 200)} min read`,
      });

      // Axios puts the response body in `response.data`
      const data = response.data;

      setAlertInfo({
        showAlert: true,
        type: "success",
        alertMessage: data.message,
      });
      setFormData({ title: "", author: "", content: "", tagline: "" });
    } catch (error) {
      // Axios error handling
      const message =
        error.response?.data?.message || error.message || "Failed to post blog";

      setAlertInfo({
        showAlert: true,
        type: "error",
        alertMessage: message,
      });

      console.error("Error posting blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.title.trim() && formData.author.trim() && formData.content.trim();

  return (
    <>
      <BlogAlert
        message={alertInfo.alertMessage}
        type={alertInfo.type}
        isVisible={alertInfo.showAlert}
        hideAlert={() =>
          setAlertInfo({ type: "", alertMessage: "", showAlert: false })
        }
      />
      <AnimatePresence>
        {showConfirmation && (
          <ConfirmationDialog
            title="Post Blog"
            onConfirm={handleSubmit}
            message="Are you sure you want to post this blog"
            onCancel={() => setShowConfirmation(false)}
          />
        )}
      </AnimatePresence>
      <div className="mx-auto mt-12 w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800">
          {/* Header - Neutral & Clean */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-6 dark:border-gray-800">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                Create New Blog Post
              </h1>
              <p className="mt-1 text-sm text-gray-500 sm:text-base dark:text-gray-400">
                Share your thoughts with the world
              </p>
            </div>
            <div className="flex items-center gap-4">
              <UserInfoCard />
              <LogoutButton />
            </div>
          </div>

          {/* Form Content */}
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
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
