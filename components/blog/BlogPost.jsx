"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import LogoutButton from "../Modules/LogoutButton";
import UserInfoCard from "../Modules/UserInfoCard";
import { useToast } from "../Modules/Toaster";
import apiClient from "@/lib/AxiosClient";
import { LoadingCircle } from "../Modules/LoadingCircle";
import BlogForm from "./BlogForm";
import IconPattern from "../Modules/IconPattern";
import { useFormDraft } from "@/hooks/useFormDraft";
import { estimateReadTime } from "@/utils/Helpers";

const BlogPost = ({ user }) => {
  const name = user.name;

  const [formData, setFormData] = useState({
    title: "",
    author: name ?? "",
    tagline: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const { hasDraft, clearDraft, discardDraft } = useFormDraft(
    "blog-draft:new",
    formData,
    setFormData,
    () =>
      toast.info("Picking up where you left off.", {
        id: "blog-draft",
        title: "Draft restored",
      }),
  );

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
        readTime: estimateReadTime(formData.content),
      });

      // Axios puts the response body in `response.data`
      const data = response.data;

      // The route has already refreshed the server cache; this drops stale
      // listings from the client router.
      router.refresh();

      toast.success(data.message, { title: "Blog published" });
      clearDraft();
      setFormData({ title: "", author: name ?? "", content: "", tagline: "" });
    } catch (error) {
      // Axios error handling
      const message =
        error.response?.data?.message || error.message || "Failed to post blog";

      toast.error(message, { title: "Couldn't publish the blog" });

      console.error("Error posting blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.title.trim() && formData.author.trim() && formData.content.trim();

  return (
    <>
      {showConfirmation && (
        <ConfirmationDialog
          title="Post Blog"
          onConfirm={handleSubmit}
          showConfirmation={showConfirmation}
          message="Are you sure you want to post this blog?"
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {/* Loading Circle */}
      {isSubmitting && <LoadingCircle />}

      {/* Full-bleed wrapper so the pattern reaches the viewport edges */}
      <div className="relative isolate">
        <IconPattern />
        <div className="container-page py-section">
          <div className="mx-auto max-w-5xl">
            <div className="border-border-subtle bg-surface rounded-dialog overflow-hidden border">
              {/* Header - Neutral & Clean */}
              <div className="border-border-subtle flex items-center justify-between border-b px-6 py-6">
                <div>
                  <h1 className="text-text-primary text-h2 font-semibold">
                    Create New Blog Post
                  </h1>
                  <p className="text-text-muted mt-1 text-sm sm:text-base">
                    Share your thoughts with the world
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <UserInfoCard user={user} />
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
                canDiscard={hasDraft}
                onDiscard={discardDraft}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
