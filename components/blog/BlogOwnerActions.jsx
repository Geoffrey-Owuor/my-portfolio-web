"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { PenLine, Trash2 } from "lucide-react";
import apiClient from "@/lib/AxiosClient";
import { useSignedIn } from "@/hooks/useSignedIn";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import { LoadingCircle } from "../Modules/LoadingCircle";
import { useProgressRouter } from "../Modules/RouteProgress";
import { useToast } from "../Modules/Toaster";

// The editor pulls in the markdown preview, so it only loads once the owner
// asks for it.
const EditBlog = dynamic(() => import("./EditBlog"), { ssr: false });

const buttonClass =
  "flex cursor-pointer items-center gap-2 transition-colors duration-150";

// Edit and Delete on a blog post. The page is cached and identical for every
// visitor, so whether to offer them is settled here in the browser; the routes
// still check the session themselves.
const BlogOwnerActions = ({ blogInfo }) => {
  const signedIn = useSignedIn();
  const [showEdit, setShowEdit] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const progressRouter = useProgressRouter();
  const toast = useToast();

  if (!signedIn) return null;

  const handleDelete = async () => {
    setConfirmingDelete(false);
    setDeleting(true);

    try {
      const { data } = await apiClient.delete(`/blogpost/${blogInfo.blog_id}`);
      toast.success(data.message, { title: "Blog deleted" });
      progressRouter.push("/blogs");
      // Drops the deleted post from listings the client router still holds.
      router.refresh();
    } catch (error) {
      console.error("Error deleting the blog:", error);
      toast.error(error.response?.data?.message || error.message, {
        title: "Couldn't delete the blog",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {showEdit && (
        <EditBlog
          showEditModal={showEdit}
          setShowEditModal={setShowEdit}
          blogInfo={blogInfo}
        />
      )}

      {confirmingDelete && (
        <ConfirmationDialog
          title="Delete Blog"
          message={`Delete "${blogInfo.blog_title}"? This can't be undone.`}
          showConfirmation={confirmingDelete}
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}

      {deleting && <LoadingCircle />}

      <button
        type="button"
        onClick={() => setShowEdit(true)}
        className={`hover:text-text-primary ${buttonClass}`}
      >
        <PenLine className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Edit</span>
      </button>

      <button
        type="button"
        onClick={() => setConfirmingDelete(true)}
        className={`hover:text-danger ${buttonClass}`}
      >
        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Delete</span>
      </button>
    </>
  );
};

export default BlogOwnerActions;
