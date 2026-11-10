"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, RefreshCcw, Trash2 } from "lucide-react";
import apiClient from "@/lib/AxiosClient";
import { isEmail } from "@/utils/contactValidation";
import { formatDate } from "@/utils/Helpers";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import EmptyState from "../Modules/EmptyState";
import { LoadingCircle } from "../Modules/LoadingCircle";
import Pagination from "../Modules/Pagination";
import { useToast } from "../Modules/Toaster";
import { iconButtonClass } from "./manageLists";

const shortLabel = (text) =>
  text.length > 40 ? `${text.slice(0, 40)}…` : text;

// Visitor text is untrusted: it only ever renders as plain text, and only a
// value that passes isEmail becomes a mailto link.
const InboxTab = () => {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(null);

  useEffect(() => {
    let current = true;
    setFailed(false);

    apiClient
      .get("/manage/inbox", { params: { page } })
      .then((response) => {
        if (!current) return;
        // The last message on the last page was deleted.
        if (response.data.messages.length === 0 && page > 1) {
          setPage(page - 1);
          return;
        }
        setData(response.data);
      })
      .catch((error) => {
        if (!current) return;
        console.error("Error loading the inbox:", error);
        setFailed(true);
      });

    return () => {
      current = false;
    };
  }, [page, reloadKey]);

  if (failed) {
    return (
      <div className="border-border-subtle rounded-card flex flex-col items-center gap-3 border border-dashed px-5 py-8 text-sm">
        <p className="text-danger">Couldn&apos;t load the inbox.</p>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          className="text-text-primary hover:text-accent inline-flex cursor-pointer items-center gap-1.5 underline underline-offset-4 transition-colors"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-text-muted py-8 text-center text-sm" role="status">
        Loading messages…
      </p>
    );
  }

  const toggleRead = async (message) => {
    const read = !message.read_at;
    setBusy(true);
    try {
      const { data: updated } = await apiClient.patch(
        `/manage/inbox/${message.id}`,
        { read },
      );
      setData((previous) => ({
        ...previous,
        messages: previous.messages.map((item) =>
          item.id === message.id ? { ...item, read_at: updated.read_at } : item,
        ),
      }));
    } catch (error) {
      console.error("Error updating the message:", error);
      toast.error(error.response?.data?.message || error.message, {
        title: "Couldn't update the message",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    const message = confirmingDelete;
    setConfirmingDelete(null);
    setBusy(true);
    try {
      const { data: result } = await apiClient.delete(
        `/manage/inbox/${message.id}`,
      );
      toast.success(result.message, { title: "Message deleted" });
      setReloadKey((key) => key + 1);
    } catch (error) {
      console.error("Error deleting the message:", error);
      toast.error(error.response?.data?.message || error.message, {
        title: "Couldn't delete the message",
      });
    } finally {
      setBusy(false);
    }
  };

  const { messages, total, pageSize } = data;

  if (total === 0) {
    return (
      <EmptyState command="manage inbox" emptyMessage="No messages yet." />
    );
  }

  const firstIndex = (data.page - 1) * pageSize;

  return (
    <section>
      <ul className="space-y-2">
        {messages.map((message) => {
          const unread = !message.read_at;
          const sender = shortLabel(message.user_identity);
          return (
            <li
              key={message.id}
              data-row={message.id}
              className="border-border-subtle bg-surface rounded-card border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-text-primary flex items-center gap-2 text-sm wrap-anywhere">
                    {unread && (
                      <span
                        className="bg-accent h-2 w-2 shrink-0 rounded-full"
                        aria-hidden="true"
                      />
                    )}
                    {unread && <span className="sr-only">Unread:</span>}
                    {isEmail(message.user_identity) ? (
                      <a
                        href={`mailto:${encodeURIComponent(message.user_identity)}`}
                        className={`hover:text-accent underline-offset-2 transition-colors hover:underline ${unread ? "font-semibold" : ""}`}
                      >
                        {message.user_identity}
                      </a>
                    ) : (
                      <span className={unread ? "font-semibold" : ""}>
                        {message.user_identity}
                      </span>
                    )}
                  </p>
                  <p className="text-text-muted mt-1 text-xs">
                    {message.created_at
                      ? formatDate(message.created_at)
                      : "Date not recorded"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleRead(message)}
                    disabled={busy}
                    aria-label={`Mark message from ${sender} as ${unread ? "read" : "unread"}`}
                    className={iconButtonClass}
                  >
                    {unread ? (
                      <MailOpen className="h-4 w-4" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(message)}
                    disabled={busy}
                    aria-label={`Delete message from ${sender}`}
                    className={`${iconButtonClass} hover:text-danger`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-text-primary mt-3 text-sm wrap-anywhere whitespace-pre-wrap">
                {message.feedback_description}
              </p>
            </li>
          );
        })}
      </ul>

      <Pagination
        currentPage={data.page}
        setCurrentPage={setPage}
        totalPages={Math.ceil(total / pageSize)}
        indexOfFirstBlog={firstIndex}
        indexOfLastBlog={firstIndex + pageSize}
        blogsLength={total}
      />

      {confirmingDelete && (
        <ConfirmationDialog
          title="Delete message"
          message={`Delete the message from "${shortLabel(confirmingDelete.user_identity)}"? This can't be undone.`}
          showConfirmation
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(null)}
        />
      )}

      {busy && <LoadingCircle />}
    </section>
  );
};

export default InboxTab;
