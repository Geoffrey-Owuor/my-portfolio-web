"use client";

import { RefreshCcw } from "lucide-react";

/**
 * Shown where a homepage list has nothing to render. Distinguishes a failed
 * read (`failed` — the cached reader returned null) from a list that is
 * genuinely empty, so visitors aren't told to "wait" for something that is
 * never coming. Written as a terminal exchange to match the section chrome.
 */
const EmptyState = ({ command, failed, emptyMessage, compact = false }) => (
  <div
    className={`border-border-subtle text-text-muted flex flex-col gap-1.5 rounded-lg border border-dashed font-mono text-sm ${
      compact ? "px-4 py-3" : "px-5 py-8"
    }`}
  >
    <p>
      <span className="text-accent" aria-hidden="true">
        ${" "}
      </span>
      {command}
    </p>
    {failed ? (
      <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-danger">
          Couldn&apos;t reach the database, so this didn&apos;t load.
        </span>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-text-primary hover:text-accent inline-flex cursor-pointer items-center gap-1.5 underline underline-offset-4 transition-colors"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Reload page
        </button>
      </p>
    ) : (
      <p>{emptyMessage}</p>
    )}
  </div>
);

export default EmptyState;
