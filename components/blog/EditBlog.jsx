"use client";
import { useUser } from "@/context/UserContext";
import BlogAlert from "../Modules/BlogAlert";
import { LoadingCircle } from "../Modules/LoadingCircle";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import { X } from "lucide-react";
import BlogForm from "./BlogForm";
import apiClient from "@/lib/AxiosClient";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import revalidateBlogsData from "@/cache/revalidateBlogsData";

const EditBlog = ({ showEditModal, setShowEditModal, blogInfo }) => {
  const { id: userId } = useUser();

  const blogId = blogInfo.blog_id;

  const [formData, setFormData] = useState({
    title: blogInfo.blog_title || "",
    author: blogInfo.blog_author || "",
    tagline: blogInfo.author_tagline || "",
    content: blogInfo.blog_content || "",
  });
  const [alertInfo, setAlertInfo] = useState({
    showAlert: false,
    type: "",
    alertMessage: "",
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //   UseEffect to remove html scrollbar when modal is open
  useEffect(() => {
    if (showEditModal) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.documentElement.style.overflow = "unset";
    };
  }, [showEditModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      // Prepare api payload
      const readTime = `${Math.ceil(formData.content.split(" ").length / 200)} min read`;
      const apiPayload = {
        ...formData,
        readTime,
      };
      // Blog put api endpoint
      const response = await apiClient.put(`/blogpost/${blogId}`, apiPayload);

      // Axios puts the response body in `response.data`
      const data = response.data;

      // Invalidate server components data
      await revalidateBlogsData();

      setAlertInfo({
        showAlert: true,
        type: "success",
        alertMessage: data.message,
      });

      setFormData({ title: "", author: "", content: "", tagline: "" });

      //   Timeout to hide modal after 4 seconds
      setTimeout(() => setShowEditModal(false), 4000);
    } catch (error) {
      // Axios error handling
      const message =
        error.response?.data?.message || error.message || "Failed to post blog";

      setAlertInfo({
        showAlert: true,
        type: "error",
        alertMessage: message,
      });

      console.error("Error updating the blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.title.trim() && formData.author.trim() && formData.content.trim();

  if (!userId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setShowEditModal(false)}
        className="custom-blur custom-blur fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-950/50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-slate-950"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Edit Unauthorized
            </h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="rounded-xl p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            You are not authorized to edit this blog
          </p>
        </motion.div>
      </motion.div>
    );
  }

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
        {showConfirmDialog && (
          <ConfirmationDialog
            title="Edit Blog"
            onConfirm={handleSubmit}
            message="Are you sure you want to edit this blog?"
            onCancel={() => setShowConfirmDialog(false)}
          />
        )}
      </AnimatePresence>
      {/* Loading Circle */}
      {isSubmitting && <LoadingCircle />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setShowEditModal(false)}
        className="custom-blur custom-blur fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-950/50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="mx-4 max-h-[calc(100vh-3rem)] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-slate-950"
        >
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Edit the blog
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Update your blog content and details
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* The blog form */}
          <BlogForm
            handleConfirmSubmit={handleConfirmSubmit}
            formData={formData}
            handleChange={handleChange}
            isFormValid={isFormValid}
            IsUpdating={true}
            isSubmitting={isSubmitting}
          />
        </motion.div>
      </motion.div>
    </>
  );
};

export default EditBlog;
