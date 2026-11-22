import { useEffect } from "react";

// One entry per mounted component that has something a reload would lose.
// Module state rather than context: it's only ever read on demand (before a
// reload the app offers), never rendered.
const sources = new Set();

export const hasUnsavedChanges = () => sources.size > 0;

// Reports `unsaved` while it's true: typed text that isn't saved yet, a
// picked file, a save in progress.
export const useUnsavedChanges = (unsaved) => {
  useEffect(() => {
    if (!unsaved) return;
    const token = {};
    sources.add(token);
    return () => sources.delete(token);
  }, [unsaved]);
};
