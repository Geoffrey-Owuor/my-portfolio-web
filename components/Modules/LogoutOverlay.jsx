import React from "react";
import ClientPortal from "./ClientPortal";
import { Loader } from "lucide-react";

const LogoutOverlay = () => {
  const content = (
    <div className="bg-surface fixed inset-0 z-9999 flex h-screen items-center justify-center">
      {/* Container to align the spinner and text horizontally */}
      <div className="flex items-center space-x-2">
        {/* The Lucide Loader spinner */}
        <Loader
          className="text-text-primary h-9 w-9 animate-spin"
          aria-label="loading"
        />

        {/* The text */}
        <span className="text-text-primary text-xl">Logging out...</span>
      </div>
    </div>
  );

  return <ClientPortal>{content}</ClientPortal>;
};

export default LogoutOverlay;
