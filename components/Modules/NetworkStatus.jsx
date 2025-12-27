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

  return (
    <AnimatePresence>
      {status !== "hidden" && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="pointer-events-none fixed right-0 bottom-6 left-0 z-100 flex justify-center"
        >
          <div
            className={`custom-blur pointer-events-auto flex items-center gap-3 rounded-full px-6 py-3 shadow-lg transition-colors duration-300 ${
              status === "offline"
                ? "bg-red-500/90 text-white dark:bg-red-900/90"
                : "bg-green-500/90 text-white dark:bg-green-900/90"
            }`}
          >
            {/* Icon Switching */}
            {status === "offline" ? (
              <WifiOff className="h-5 w-5 animate-pulse" />
            ) : (
              <Wifi className="h-5 w-5" />
            )}

            {/* Text Switching */}
            <span className="font-medium">
              {status === "offline"
                ? "You are offline. Some features may not work as expected."
                : "Hooray! You are back online 🎉"}
            </span>

            {/* Optional Close Button (mostly for offline state if it persists) */}
            <button
              onClick={() => setStatus("hidden")}
              className="ml-2 rounded-full p-1 hover:bg-white/20"
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
