import ClientPortal from "./ClientPortal";
import { Loader2 } from "lucide-react";

export const LoadingCircle = () => {
  const content = (
    <div
      className={`bg-surface/50 fixed inset-0 z-9999 flex h-screen items-center justify-center transition-all duration-200`}
    >
      {/* Container to align the spinner and text horizontally */}
      <div className="flex items-center space-x-2">
        {/* The Lucide Loader spinner */}
        <Loader2
          strokeWidth={1}
          className="text-text-primary h-20 w-20 animate-spin"
          aria-label="loading"
        />
      </div>
    </div>
  );
  return <ClientPortal>{content}</ClientPortal>;
};
