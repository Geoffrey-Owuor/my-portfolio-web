"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { ExternalLink, PenLine, Plus, Trash2 } from "lucide-react";
import apiClient from "@/lib/AxiosClient";
import { formatDate } from "@/utils/Helpers";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import EmptyState from "../Modules/EmptyState";
import { LoadingCircle } from "../Modules/LoadingCircle";
import { ProgressLink } from "../Modules/RouteProgress";
import { useToast } from "../Modules/Toaster";
import { iconButtonClass } from "./manageLists";

// The editor pulls in the markdown preview, so it only loads when opened.
const BlogModal = dynamic(() => import("../blog/BlogModal"), { ssr: false });

// `rows` is null when the read failed.
const BlogsTab = ({ rows, author }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  // { blogInfo } while the editor is open; blogInfo is null for a new post.
  const [editing, setEditing] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  // /createblog lands here with ?new=1. The flag is consumed once, so a reload
  // doesn't reopen the editor.
  const consumedNew = useRef(false);
  useEffect(() => {
    if (consumedNew.current || searchParams.get("new") !== "1") return;
    consumedNew.current = true;
    setEditing({ blogInfo: null });
    const params = new URLSearchParams(searchParams.toString());
    params.delete("new");
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [searchParams]);

  if (rows === null) {
    return <EmptyState command="manage blogs" failed />;
  }

  const handleEdit = async (row) => {
    setBusy(true);
    try {
      const { data } = await apiClient.get(`/manage/blogs/${row.id}`);
      setEditing({ blogInfo: data });
    } catch (error) {
      console.error("Error loading the blog:", error);
      toast.error(error.response?.data?.message || error.message, {
        title: "Couldn't open the blog",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    const row = confirmingDelete;
    setConfirmingDelete(null);
    setBusy(true);
    try {
      const { data } = await apiClient.delete(`/blogpost/${row.id}`);
      toast.success(data.message, { title: "Blog deleted" });
      router.refresh();
    } catch (error) {
      console.error("Error deleting the blog:", error);
      toast.error(error.response?.data?.message || error.message, {
        title: "Couldn't delete the blog",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setEditing({ blogInfo: null })}
          className="bg-text-primary text-surface rounded-control inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New blog
        </button>
      </div>

      {rows.length === 0 ? (
        <EmptyState command="manage blogs" emptyMessage="No posts yet." />
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li
              key={row.id}
              data-row={row.id}
              className="border-border-subtle bg-surface rounded-card flex flex-col gap-2 border p-4 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-text-primary line-clamp-2 text-sm font-medium wrap-anywhere">
                  {row.blog_title}
                </p>
                <p className="text-text-muted mt-1 truncate text-sm">
                  {formatDate(row.blog_date)} · {row.read_time}
                </p>
              </div>

              <div className="flex shrink-0 items-center justify-end gap-1">
                <ProgressLink
                  href={`/blog/${row.slug}`}
                  aria-label={`View ${row.blog_title}`}
                  className={iconButtonClass}
                >
                  <ExternalLink className="h-4 w-4" />
                </ProgressLink>
                <button
                  type="button"
                  onClick={() => handleEdit(row)}
                  aria-label={`Edit ${row.blog_title}`}
                  className={iconButtonClass}
                >
                  <PenLine className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(row)}
                  aria-label={`Delete ${row.blog_title}`}
                  className={`${iconButtonClass} hover:text-danger`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <BlogModal
          blogInfo={editing.blogInfo}
          defaultAuthor={author ?? ""}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmingDelete && (
        <ConfirmationDialog
          title="Delete Blog"
          message={`Delete "${confirmingDelete.blog_title}"? This can't be undone.`}
          showConfirmation
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(null)}
        />
      )}

      {busy && <LoadingCircle />}
    </section>
  );
};

export default BlogsTab;
