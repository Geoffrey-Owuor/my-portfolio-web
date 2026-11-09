"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Must be set in the module that renders <Document> (see the react-pdf
// README); the worker is bundled, not pulled from a CDN.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const MAX_PAGE_WIDTH = 850;

// Renders every page of the PDF at the column's width, with selectable text
// and clickable links (text and annotation layers). Pages paint out of sight
// behind ResumePreview's skeleton and are revealed together via onReady.
const ResumeViewer = ({ file, onReady }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [settledPages, setSettledPages] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.min(Math.floor(entry.contentRect.width), MAX_PAGE_WIDTH)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const ready = failed || (numPages > 0 && settledPages >= numPages);

  useEffect(() => {
    if (ready) onReady();
  }, [ready, onReady]);

  const settlePage = () => setSettledPages((count) => count + 1);

  return (
    <div
      ref={containerRef}
      className={
        ready
          ? "w-full"
          : "invisible absolute inset-x-0 top-0 h-0 overflow-hidden"
      }
    >
      {width && (
        <Document
          file={file}
          suspense={false}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={() => setFailed(true)}
          onSourceError={() => setFailed(true)}
          loading={null}
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
              loading={null}
              onRenderSuccess={settlePage}
              onRenderError={settlePage}
              onLoadError={settlePage}
              className="border-border-subtle rounded-card overflow-hidden border bg-white shadow-sm"
            />
          ))}
        </Document>
      )}
    </div>
  );
};

export default ResumeViewer;
