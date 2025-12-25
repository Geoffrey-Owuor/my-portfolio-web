import React from "react";
import { createPortal } from "react-dom";
import { Loader } from "lucide-react";

const LogoutOverlay = () => {
  const content = (
    <div className="fixed inset-0 z-9999 flex h-screen items-center justify-center bg-white dark:bg-gray-950">
      {/* Container to align the spinner and text horizontally */}
      <div className="flex items-center space-x-2">
        {/* The Lucide Loader spinner */}
        <Loader
          className="h-9 w-9 animate-spin text-gray-900 dark:text-white"
          aria-label="loading"
        />

        {/* The text, styled for dark and light modes */}
        <span className="text-xl text-gray-900 dark:text-white">
          Logging out...
        </span>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default LogoutOverlay;
