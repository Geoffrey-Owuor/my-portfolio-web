"use client";

import { useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useToast } from "./Toaster";

// Shared id, so "back online" replaces the offline toast in place.
const NETWORK_TOAST = "network";

// Offline status as a toast: persistent while offline, then swapped for a
// short "back online" confirmation. Renders nothing itself.
const NetworkStatus = () => {
  const toast = useToast();

  useEffect(() => {
    let offlineTimer;
    let wasOffline = false;

    const showOffline = () =>
      toast.error("Some features may not work until you reconnect.", {
        id: NETWORK_TOAST,
        title: "You're offline",
        icon: WifiOff,
        duration: Infinity,
      });

    // Wait 2s before announcing, so a momentary blip doesn't flash a toast.
    const handleOffline = () => {
      clearTimeout(offlineTimer);
      offlineTimer = setTimeout(() => {
        wasOffline = true;
        showOffline();
      }, 2000);
    };

    const handleOnline = () => {
      clearTimeout(offlineTimer);
      if (!wasOffline) return;
      wasOffline = false;
      toast.success("Your connection has been restored.", {
        id: NETWORK_TOAST,
        title: "Back online",
        icon: Wifi,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // In case the page loads while already offline.
    if (!navigator.onLine) {
      wasOffline = true;
      showOffline();
    }

    return () => {
      clearTimeout(offlineTimer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  return null;
};

export default NetworkStatus;
