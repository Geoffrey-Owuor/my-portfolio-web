"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, ExternalLink, FileText, LayoutTemplate } from "lucide-react";
import ResumeDocument from "./ResumeDocument";
import ResumePreview from "./ResumePreview";

const FILE_URL = "/resume/file";

const actionClass =
  "rounded-control inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors";

const VIEWS = [
  { id: "web", label: "Web", icon: LayoutTemplate },
  { id: "pdf", label: "PDF", icon: FileText },
];

// The résumé with its actions and, when it has an HTML view, a Web/PDF
// switch. Shared by /resume and the /manage Résumé tab, which passes its
// upload controls as `children` (shown first in the action row).
//   resume : { key, updatedAt } | null (nothing uploaded yet)
//   html   : { blocks, hidden? } | null (no web version)
//   failed : storage couldn't be reached
// The chosen view is kept in ?view=pdf so it survives a reload and can be
// linked to; the web view is the default.
const ResumeView = ({ resume, html, failed = false, children }) => {
  const searchParams = useSearchParams();
  const hasWeb = Boolean(html?.blocks?.length);
  // Null until a view is picked here, so the default follows the web
  // version appearing (created from /manage) or going away.
  const [choice, setChoice] = useState(null);
  const preferred =
    choice ?? (searchParams.get("view") === "pdf" ? "pdf" : "web");
  const shown = hasWeb ? preferred : "pdf";

  const chooseView = (next) => {
    setChoice(next);
    // Kept out of history (one entry per switch would bury the back button)
    // and out of the router, so nothing re-renders on the server.
    const url = new URL(window.location.href);
    if (next === "pdf") url.searchParams.set("view", "pdf");
    else url.searchParams.delete("view");
    window.history.replaceState(window.history.state, "", url);
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {children}
        {resume && (
          <>
            <a
              href={`${FILE_URL}?download=1`}
              download
              className={`bg-text-primary text-surface hover:opacity-90 ${actionClass}`}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
            <a
              href={FILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`border-border-subtle text-text-primary hover:border-accent hover:text-accent border ${actionClass}`}
            >
              <ExternalLink className="h-4 w-4" />
              Open in new tab
            </a>
          </>
        )}

        {resume && hasWeb && (
          <div
            role="group"
            aria-label="Résumé format"
            className="border-border-subtle bg-surface-raised rounded-card flex items-center gap-0.5 border p-1 sm:ml-auto"
          >
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => chooseView(id)}
                aria-pressed={shown === id}
                className={`rounded-control flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  shown === id
                    ? "bg-surface text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {resume ? (
        <div className="mx-auto w-full max-w-[850px]">
          {shown === "web" ? (
            <ResumeDocument blocks={html.blocks} />
          ) : (
            // The key changes on every upload, so the viewer never reuses a
            // stale copy of the previous version, and the preview remounts
            // to show its loading state again.
            <ResumePreview
              key={resume.key}
              file={`${FILE_URL}?v=${encodeURIComponent(resume.key)}`}
            />
          )}
        </div>
      ) : (
        <p
          className={`border-border-subtle rounded-card border border-dashed px-5 py-8 text-center text-sm ${
            failed ? "text-danger" : "text-text-muted"
          }`}
        >
          {failed
            ? "Couldn't load the résumé right now. Please try again shortly."
            : "The résumé hasn't been published yet. Check back soon."}
        </p>
      )}
    </>
  );
};

export default ResumeView;
