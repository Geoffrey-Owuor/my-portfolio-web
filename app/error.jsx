"use client";

import { startTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

// The fallback for any route without an error page of its own.
const Error = ({ error, reset }) => {
  const router = useRouter();

  useEffect(() => {
    console.error("Error rendering the page:", error);
  }, [error]);

  // A server-side failure needs the page fetched again before the boundary
  // is cleared: `reset` alone would redraw the same error.
  const retry = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div className="container-page py-section flex min-h-[60vh] flex-col items-center justify-center text-center">
      <AlertTriangle className="text-danger mb-6 h-12 w-12" />
      <h1 className="text-text-primary text-h1 mb-4 font-semibold">
        Something went wrong
      </h1>
      <p className="text-text-muted mb-8 max-w-md">
        This page ran into a problem while loading. Please try again.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={retry}
          className="bg-text-primary text-surface rounded-control inline-flex cursor-pointer items-center gap-2 px-6 py-3 font-medium transition-opacity hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="border-border-subtle text-text-primary hover:bg-surface-raised rounded-control inline-flex items-center gap-2 border px-6 py-3 font-medium transition-colors"
        >
          <Home className="h-4 w-4" />
          Return home
        </Link>
      </div>
    </div>
  );
};

export default Error;
