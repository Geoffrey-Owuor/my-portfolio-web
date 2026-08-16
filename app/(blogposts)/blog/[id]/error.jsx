"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

const Error = ({ error, reset }) => {
  useEffect(() => {
    console.error("Error rendering blog post:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-5 py-24 text-center sm:px-6 lg:px-16">
      <AlertTriangle className="text-danger mb-6 h-16 w-16" />
      <h2 className="text-text-primary mb-4 text-3xl font-bold">
        Something went wrong
      </h2>
      <p className="text-text-muted mb-8 max-w-md">
        We ran into a problem while loading this blog post. Please try again.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="bg-text-primary text-surface inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-opacity hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/blogs"
          className="border-border-subtle text-text-primary hover:bg-surface-raised inline-flex items-center gap-2 rounded-full border px-6 py-3 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Link>
      </div>
    </div>
  );
};

export default Error;
