import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";

export const LoadingCircle = () => {
  const content = (
    <div
      className={`fixed inset-0 z-9999 flex h-screen items-center justify-center bg-white/50 transition-all duration-200 dark:bg-black/60`}
    >
      {/* Container to align the spinner and text horizontally */}
      <div className="flex items-center space-x-2">
        {/* The Lucide Loader spinner */}
        <Loader2
          strokeWidth={1}
          className="h-20 w-20 animate-spin text-black dark:text-white"
          aria-label="loading"
        />
      </div>
    </div>
  );
  return createPortal(content, document.body);
};
