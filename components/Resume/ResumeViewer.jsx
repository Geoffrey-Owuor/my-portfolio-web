"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import ResumePageSkeleton from "./ResumePageSkeleton";

// Must be set in the module that renders <Document> (see the react-pdf
// README); the worker is bundled, not pulled from a CDN.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const MAX_PAGE_WIDTH = 850;

// Renders every page of the PDF at the column's width, with selectable text
// and clickable links (text and annotation layers).
const ResumeViewer = ({ file }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(null);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.min(Math.floor(entry.contentRect.width), MAX_PAGE_WIDTH)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-[850px]">
      {width && (
        <Document
          file={file}
          suspense={false}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<ResumePageSkeleton />}
          error={
            <p className="border-border-subtle text-danger rounded-card border border-dashed px-5 py-8 text-center text-sm">
              Couldn&apos;t display the résumé here. Use &ldquo;Open in new
              tab&rdquo; or &ldquo;Download&rdquo; above instead.
            </p>
          }
          className="flex flex-col gap-6"
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              width={width}
              loading={<ResumePageSkeleton />}
              className="border-border-subtle rounded-card overflow-hidden border bg-white shadow-sm"
            />
          ))}
        </Document>
      )}
      {!width && <ResumePageSkeleton />}
    </div>
  );
};

export default ResumeViewer;
