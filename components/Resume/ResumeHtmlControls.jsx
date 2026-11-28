"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import apiClient from "@/lib/AxiosClient";
import { useToast } from "../Modules/Toaster";

const buttonClass =
  "border-border-subtle text-text-primary hover:border-accent hover:text-accent rounded-control inline-flex items-center gap-2 border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-wait disabled:opacity-60";

// /manage only: the web version's status, with Rebuild (read the current PDF
// again) and Hide/Show (whether visitors get the Web/PDF switch).
const ResumeHtmlControls = ({ html }) => {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(null);

  const run = async (action, request, title) => {
    setBusy(action);
    try {
      const { data } = await request();
      toast.success(data.message, { title, id: "resume-html" });
      router.refresh();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Couldn't update the web version. Please try again.",
        { title: "Web version not updated", id: "resume-html" },
      );
    } finally {
      setBusy(null);
    }
  };

  const rebuild = () =>
    run(
      "rebuild",
      () => apiClient.post("/resume/html"),
      html ? "Web version rebuilt" : "Web version created",
    );

  const setHidden = (hidden) =>
    run(
      "visibility",
      () => apiClient.patch("/resume/html", { hidden }),
      hidden ? "Web version hidden" : "Web version shown",
    );

  const status = !html
    ? "No web version yet: visitors see the PDF only."
    : html.hidden
      ? "Web version hidden: visitors see the PDF only."
      : "Web version live: visitors can switch between Web and PDF.";

  return (
    <div className="border-border-subtle bg-surface-raised/50 rounded-card mb-6 flex flex-wrap items-center gap-x-4 gap-y-3 border px-4 py-3">
      <p className="text-text-muted min-w-0 flex-1 text-sm">{status}</p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={rebuild}
          disabled={Boolean(busy)}
          className={buttonClass}
        >
          <RefreshCw
            className={`h-4 w-4 ${busy === "rebuild" ? "animate-spin" : ""}`}
          />
          {html ? "Rebuild from PDF" : "Create from PDF"}
        </button>
        {html && (
          <button
            type="button"
            onClick={() => setHidden(!html.hidden)}
            disabled={Boolean(busy)}
            className={buttonClass}
          >
            {html.hidden ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
            {html.hidden ? "Show to visitors" : "Hide from visitors"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeHtmlControls;
