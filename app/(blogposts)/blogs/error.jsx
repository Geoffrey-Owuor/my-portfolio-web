"use client";

import { startTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCcw } from "lucide-react";

const Error = ({ error, reset }) => {
  const router = useRouter();

  useEffect(() => {
    console.error("Error rendering the blog listing:", error);
  }, [error]);

  // The failure happened on the server, so the page has to be fetched again
  // before the boundary is cleared: `reset` alone would redraw the same error.
  const retry = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div className="container-page py-section flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-text-primary text-h1 mb-4 font-semibold">
        Couldn&apos;t load the blogs
      </h1>
      <p className="text-text-muted mb-8">
        Something went wrong while fetching the posts. Please try again in a
        moment.
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={retry}
          className="bg-text-primary text-surface rounded-control inline-flex cursor-pointer items-center gap-2 px-6 py-3 font-medium transition-opacity hover:opacity-90"
        >
          <RefreshCcw className="h-5 w-5" />
          Try Again
        </button>
        <Link
          href="/"
          className="border-border-subtle bg-surface text-text-primary hover:bg-surface-raised rounded-control inline-flex items-center gap-2 border px-6 py-3 font-medium transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back home
        </Link>
      </div>
    </div>
  );
};

export default Error;
