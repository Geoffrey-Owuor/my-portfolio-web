// A sheet-shaped placeholder (A4/Letter are both ~1:1.3–1.41). Kept apart
// from ResumeViewer so importing it doesn't pull PDF.js into the bundle.
const ResumePageSkeleton = () => (
  <div
    className="bg-surface-raised border-border-subtle rounded-card aspect-[1/1.35] w-full animate-pulse border"
    aria-hidden="true"
  />
);

export default ResumePageSkeleton;
