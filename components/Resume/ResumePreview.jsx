"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import ResumePageSkeleton from "./ResumePageSkeleton";

// PDF.js is browser-only and heavy, so it loads on the client, on this page
// only.
const ResumeViewer = dynamic(() => import("./ResumeViewer"), { ssr: false });

// The one loading state for the whole sequence (viewer chunk, PDF download,
// page paint): it stays put until the viewer reports it has something to show.
const ResumePreview = ({ file }) => {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  return (
    <div className="relative mx-auto w-full max-w-[850px]">
      {!ready && <ResumePageSkeleton />}
      <ResumeViewer file={file} onReady={handleReady} />
    </div>
  );
};

export default ResumePreview;
