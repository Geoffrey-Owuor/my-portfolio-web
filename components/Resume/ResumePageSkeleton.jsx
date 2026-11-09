// A sheet-shaped placeholder at the size the PDF renders: the viewer's width
// and US Letter proportions. Kept apart from ResumeViewer so importing it
// doesn't pull PDF.js into the bundle.
const ResumePageSkeleton = () => (
  <div
    className="bg-surface-raised border-border-subtle rounded-card aspect-[1/1.294] w-full animate-pulse border"
    aria-hidden="true"
  />
);

export default ResumePageSkeleton;
