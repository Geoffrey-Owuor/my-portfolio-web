"use client";
import { useState } from "react";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import { AnimatePresence } from "framer-motion";
import LogoutButton from "../Modules/LogoutButton";
import UserInfoCard from "../Modules/UserInfoCard";
import { useUser } from "@/context/UserContext";
import BlogAlert from "../Modules/BlogAlert";
import apiClient from "@/lib/AxiosClient";
import { LoadingCircle } from "../Modules/LoadingCircle";
import BlogForm from "./BlogForm";
import revalidateBlogsData from "@/cache/revalidateBlogsData";

const BlogPost = () => {
  const { name } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    author: name ?? "",
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

      // Revalidate blogs data
      await revalidateBlogsData();

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
            message="Are you sure you want to post this blog?"
            onCancel={() => setShowConfirmation(false)}
          />
        )}
      </AnimatePresence>
      {/* Loading Circle */}
      {isSubmitting && <LoadingCircle />}

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

          {/* Blog Form */}
          <BlogForm
            handleConfirmSubmit={handleConfirmSubmit}
            formData={formData}
            handleChange={handleChange}
            isFormValid={isFormValid}
            isSubmitting={isSubmitting}
            IsUpdating={false}
          />
        </div>
      </div>
    </>
  );
};

export default BlogPost;
