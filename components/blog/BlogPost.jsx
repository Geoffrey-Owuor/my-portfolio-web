"use client";
import { useState } from "react";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import LogoutButton from "../Modules/LogoutButton";
import UserInfoCard from "../Modules/UserInfoCard";
import BlogAlert from "../Modules/BlogAlert";
import apiClient from "@/lib/AxiosClient";
import { LoadingCircle } from "../Modules/LoadingCircle";
import BlogForm from "./BlogForm";
import revalidateBlogsData from "@/cache/revalidateBlogsData";

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

      <div className="mx-auto w-full max-w-5xl px-4 py-16">
        <div className="border-border-subtle overflow-hidden rounded-2xl border">
          {/* Header - Neutral & Clean */}
          <div className="border-border-subtle flex items-center justify-between border-b px-6 py-6">
            <div>
              <h1 className="font-mono text-text-primary text-xl font-semibold sm:text-2xl">
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
          />
        </div>
      </div>
    </>
  );
};

export default BlogPost;
