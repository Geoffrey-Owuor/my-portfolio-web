"use client";
import { LoadingCircle } from "../Modules/LoadingCircle";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import { X } from "lucide-react";
import BlogForm from "./BlogForm";
import apiClient from "@/lib/AxiosClient";
import { useState, useRef, useId } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ClientPortal from "../Modules/ClientPortal";
import { useToast } from "../Modules/Toaster";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";
import { useFormDraft } from "@/hooks/useFormDraft";
import { estimateReadTime } from "@/utils/Helpers";

// Writes a new post (`blogInfo` null) or edits one. Mounted only while open, so
// each opening starts from the saved values plus any draft.
const BlogModal = ({ blogInfo, defaultAuthor = "", onClose }) => {
  const toast = useToast();
  const router = useRouter();
  const modalRef = useRef(null);
  const titleId = useId();
  const isNew = !blogInfo;

  useHideScrollbar(true);
  useFocusTrapping(modalRef, true, onClose);

  const [formData, setFormData] = useState({
    title: blogInfo?.blog_title || "",
    author: blogInfo?.blog_author || defaultAuthor,
    tagline: blogInfo?.author_tagline || "",
    content: blogInfo?.blog_content || "",
  });

  const { hasDraft, clearDraft, discardDraft } = useFormDraft(
    `blog-draft:${isNew ? "new" : blogInfo.blog_id}`,
    formData,
    setFormData,
    () =>
      toast.info(
        isNew
          ? "Picking up where you left off."
          : "Your unsaved edits to this post are back.",
        { id: "blog-draft", title: "Draft restored" },
      ),
  );

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
      const payload = {
        ...formData,
        readTime: estimateReadTime(formData.content),
      };
      const { data } = isNew
        ? await apiClient.post("/blogpost", payload)
        : await apiClient.put(`/blogpost/${blogInfo.blog_id}`, payload);

      // The route has already refreshed the server cache; this redraws the
      // list and drops stale listings from the client router.
      router.refresh();

      toast.success(data.message, {
        title: isNew ? "Blog published" : "Blog updated",
      });
      clearDraft();
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to save the blog";

      toast.error(message, {
        title: isNew ? "Couldn't publish the blog" : "Couldn't update the blog",
      });

      console.error("Error saving the blog:", error);
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
          title={isNew ? "Post Blog" : "Edit Blog"}
          onConfirm={handleSubmit}
          showConfirmation={showConfirmDialog}
          message={
            isNew
              ? "Are you sure you want to post this blog?"
              : "Are you sure you want to edit this blog?"
          }
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
      {isSubmitting && <LoadingCircle />}
      <ClientPortal>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="z-modal fixed inset-0 flex items-stretch justify-center bg-black/50 sm:items-center dark:bg-black/60"
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            // Full-screen below sm; a centred card from sm up.
            className="border-border-subtle bg-surface sm:rounded-dialog h-dvh w-full max-w-4xl overflow-y-auto shadow-2xl sm:mx-4 sm:h-auto sm:max-h-[calc(100dvh-3rem)] sm:border"
          >
            <div className="border-border-subtle bg-surface z-raised sticky top-0 border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h2
                    id={titleId}
                    className="text-text-primary text-2xl font-semibold"
                  >
                    {isNew ? "Write a new blog" : "Edit the blog"}
                  </h2>
                  <p className="text-text-muted mt-1 text-sm">
                    {isNew
                      ? "Share your thoughts with the world"
                      : "Update your blog content and details"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close blog dialog"
                  className="text-text-muted hover:bg-surface-raised hover:text-text-primary rounded-control p-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <BlogForm
              handleConfirmSubmit={handleConfirmSubmit}
              formData={formData}
              handleChange={handleChange}
              isFormValid={isFormValid}
              IsUpdating={!isNew}
              isSubmitting={isSubmitting}
              canDiscard={hasDraft}
              onDiscard={discardDraft}
            />
          </motion.div>
        </motion.div>
      </ClientPortal>
    </>
  );
};

export default BlogModal;
