"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Wifi, WifiOff, X } from "lucide-react";

const NetworkStatus = () => {
  // distinct states: 'hidden' | 'offline' | 'restored'
  const [status, setStatus] = useState("hidden");

  //   Handlers for browser events
  useEffect(() => {
    // Handlers for browser events

    const handleOffline = () => {
      // Set offline status after 2 seconds
      const timer = setTimeout(() => setStatus("offline"), 2000);

      return () => clearTimeout(timer);
    };

    const handleOnline = () => {
      setStatus("restored");

      // Hide message automatically after 6 seconds
      const timer = setTimeout(() => setStatus("hidden"), 6000);

      return () => clearTimeout(timer);
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 3. Initial Check (in case user loads page while offline)
    if (!navigator.onLine) {
      setStatus("offline");
    }

    // 4. Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const isOffline = status === "offline";

  return (
    <AnimatePresence>
      {status !== "hidden" && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="pointer-events-none fixed right-0 bottom-4 left-0 z-9999 flex justify-center px-4 md:bottom-6"
        >
          <div className="bg-text-primary text-surface pointer-events-auto flex w-full items-center gap-3 rounded-xl px-4 py-3 shadow-lg sm:w-auto sm:max-w-md sm:px-6 sm:py-3.5">
            {/* Icon Switching */}
            {isOffline ? (
              <WifiOff className="text-danger h-5 w-5 shrink-0 animate-pulse" />
            ) : (
              <Wifi className="text-success h-5 w-5 shrink-0" />
            )}

            {/* Text Switching */}
            <span className="flex-1 text-sm leading-snug font-medium wrap-break-word sm:text-base">
              {isOffline
                ? "You are offline. Some features may not work as expected."
                : "Hooray! You are back online"}
            </span>

            {/* Optional Close Button (mostly for offline state if it persists) */}
            <button
              onClick={() => setStatus("hidden")}
              className="text-surface/70 hover:text-surface shrink-0 cursor-pointer rounded-full p-1 transition-colors"
              aria-label="Dismiss network status message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatus;
