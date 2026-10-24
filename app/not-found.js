import Link from "next/link";
import { Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page py-section flex flex-1 items-center justify-center">
      <div className="border-border-subtle rounded-card border-2 border-dashed p-8 text-center">
        <FileQuestion className="text-text-muted mx-auto mb-5 h-12 w-12" />
        <p className="text-accent font-mono text-sm">404</p>
        <h1 className="text-text-primary text-h1 mt-2 mb-3 font-semibold">
          Page not found
        </h1>
        <p className="text-text-muted mx-auto mb-8 max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-text-primary text-surface rounded-control inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          <Home className="h-4 w-4" />
          Return home
        </Link>
      </div>
    </div>
  );
}
