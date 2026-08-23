"use client";

import { XIcon, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import ClientPortal from "./ClientPortal";

const Alert = ({ message, type, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200); // Match this with animation duration
  };

  //Auto close after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Determine which icon to display based on type
  const IconComponent = type === "success" ? CheckCircle : AlertCircle;

  // Determine icon color
  const iconColorClass = type === "success" ? "text-success" : "text-danger";

  return (
    <ClientPortal>
      <div
        className={`adjust-padding fixed right-2 bottom-8 left-2 z-50 md:right-auto md:left-4 ${
          isClosing ? "animate-slideDown" : "animate-slideUp"
        }`}
      >
        <div
          className={`bg-text-primary text-surface mt-4 flex w-auto items-center justify-between rounded-xl px-6 py-4.5 shadow-md`}
        >
          <div className="flex items-center gap-2">
            {/* Render the appropriate icon */}
            <IconComponent className={`h-5 w-5 shrink-0 ${iconColorClass}`} />
            <p className="text-sm">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-surface/70 hover:text-surface ml-4 cursor-pointer"
            aria-label="Close alert"
          >
            <XIcon className="h-5 w-5 shrink-0" />
          </button>
        </div>
      </div>
    </ClientPortal>
  );
};

export default Alert;
