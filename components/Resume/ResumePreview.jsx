"use client";

import dynamic from "next/dynamic";
import ResumePageSkeleton from "./ResumePageSkeleton";

// PDF.js is browser-only and heavy, so it loads on the client, on this page
// only.
const ResumeViewer = dynamic(() => import("./ResumeViewer"), {
  ssr: false,
  loading: () => <ResumePageSkeleton />,
});

const ResumePreview = ({ file }) => <ResumeViewer file={file} />;

export default ResumePreview;
