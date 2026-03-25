"use client";
import { LoadingCircle } from "../Modules/LoadingCircle";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import { X } from "lucide-react";
import BlogForm from "./BlogForm";
import apiClient from "@/lib/AxiosClient";
import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import ClientPortal from "../Modules/ClientPortal";
import revalidateBlogsData from "@/cache/revalidateBlogsData";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";

const EditBlog = ({
  showEditModal,
  setShowEditModal,
  setAlertInfo,
  blogInfo,
}) => {
  const blogId = blogInfo.blog_id;
  const modalRef = useRef(null);
  const closeModal = useCallback(
    () => setShowEditModal(false),
    [setShowEditModal],
  );

  // Calling our layout hooks
  useHideScrollbar(showEditModal);
  useFocusTrapping(modalRef, showEditModal, closeModal);

  const [formData, setFormData] = useState({
    title: blogInfo.blog_title || "",
    author: blogInfo.blog_author || "",
    tagline: blogInfo.author_tagline || "",
    content: blogInfo.blog_content || "",
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Revalidate blogs data
      await revalidateBlogsData();

      setAlertInfo({
        showAlert: true,
        type: "success",
        alertMessage: data.message,
      });

      setFormData({ title: "", author: "", content: "", tagline: "" });

      // Hide edit modal immediately
      setShowEditModal(false);
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

  return (
    <>
      {showConfirmDialog && (
        <ConfirmationDialog
          title="Edit Blog"
          onConfirm={handleSubmit}
          showConfirmation={showConfirmDialog}
          message="Are you sure you want to edit this blog?"
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
      {/* Loading Circle */}
      {isSubmitting && <LoadingCircle />}
      {/* The main content */}
      {showEditModal && (
        <ClientPortal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowEditModal(false)}
            className="custom-blur adjust-padding fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/60"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="mx-4 max-h-[calc(100vh-5rem)] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)] dark:border-gray-800 dark:bg-slate-950"
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
        </ClientPortal>
      )}
    </>
  );
};

export default EditBlog;
