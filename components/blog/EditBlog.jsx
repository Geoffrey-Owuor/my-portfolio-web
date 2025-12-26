"use client";
import { useUser } from "@/context/UserContext";
import BlogAlert from "../Modules/BlogAlert";
import { LoadingCircle } from "../Modules/LoadingCircle";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import { X } from "lucide-react";
import BlogForm from "./BlogForm";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EditBlog = ({ setShowEditModal, blogInfo }) => {
  const { id: userId } = useUser();
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

  const handleSubmit = async () => {};

  const isFormValid =
    formData.title.trim() && formData.author.trim() && formData.content.trim();

  if (!userId) {
    return (
      <div className="custom-blur fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-950/50">
        <div className="flex min-h-56 flex-col items-center rounded-xl border border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-2xl">Edit Unauthorized</span>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-950 hover:text-gray-800 dark:text-white dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <span>You are not authorized to edit this blog</span>
        </div>
      </div>
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
            title="Post Blog"
            onConfirm={handleSubmit}
            message="Are you sure you want to edit this blog?"
            onCancel={() => setShowConfirmDialog(false)}
          />
        )}
      </AnimatePresence>
      {/* Loading Circle */}
      {isSubmitting && <LoadingCircle />}
      <div className="custom-blur fixed inset-0 z-100 flex items-center justify-center bg-white/50 dark:bg-gray-950/50">
        <div className="max-h-[calc(100vh-4rem)] max-w-7xl overflow-y-auto rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between border-b pb-4">
            <div className="inline-flex flex-col">
              <span className="text-2xl font-semibold">Edit the blog</span>
              <span>The div for editing the blog</span>
            </div>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-950 hover:text-gray-800 dark:text-white dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
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
        </div>
      </div>
    </>
  );
};

export default EditBlog;
