"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useToast } from "./Toaster";
import ConfirmationDialog from "./ConfirmationDialog";
import { hasUnsavedChanges } from "@/hooks/useUnsavedChanges";

// The deployment this tab's code came from (see next.config.mjs).
const LOADED_DEPLOYMENT = process.env.NEXT_PUBLIC_DEPLOYMENT_ID;

const CHECK_EVERY_MS = 30 * 60 * 1000;
// Focus and visibility often fire together; one request covers both.
const MIN_GAP_MS = 60 * 1000;
const UPDATE_TOAST = "deployment";

// Offers a reload once a newer deployment is live. Checks when the tab comes
// back into view and every 30 minutes while it's visible. Each deployment is
// announced once: dismissing the toast keeps the tab quiet until the next
// one. A plain reload is enough, since asset names are hashed per build;
// server caches are left alone. Renders nothing but the unsaved-changes
// confirmation.
const DeploymentWatcher = () => {
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const announcedRef = useRef(null);

  const reload = useCallback(() => window.location.reload(), []);

  const showUpdate = useCallback(() => {
    toast.info("Reload to get the latest version.", {
      id: UPDATE_TOAST,
      title: "The site has been updated",
      icon: RefreshCw,
      duration: Infinity,
      action: {
        label: "Reload",
        icon: RefreshCw,
        onClick: () => (hasUnsavedChanges() ? setConfirming(true) : reload()),
      },
    });
  }, [toast, reload]);

  useEffect(() => {
    if (!LOADED_DEPLOYMENT) return;
    let lastCheck = Date.now();
    let checking = false;

    const check = async () => {
      if (document.visibilityState !== "visible" || checking) return;
      if (Date.now() - lastCheck < MIN_GAP_MS) return;
      checking = true;
      lastCheck = Date.now();
      try {
        const response = await fetch("/api/version", { cache: "no-store" });
        if (!response.ok) return;
        const { deploymentId } = await response.json();
        if (
          !deploymentId ||
          deploymentId === LOADED_DEPLOYMENT ||
          deploymentId === announcedRef.current
        ) {
          return;
        }
        announcedRef.current = deploymentId;
        showUpdate();
      } catch {
        // Offline or mid-deploy: the next check will try again.
      } finally {
        checking = false;
      }
    };

    const interval = setInterval(check, CHECK_EVERY_MS);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, [showUpdate]);

  return (
    <AnimatePresence>
      {confirming && (
        <ConfirmationDialog
          showConfirmation={confirming}
          title="Reload with unsaved changes?"
          message="Typed text is kept as a draft and comes back when you reopen the form, but a picked image or a save in progress will be lost."
          confirmLabel="Reload anyway"
          tone="danger"
          onConfirm={reload}
          onCancel={() => {
            setConfirming(false);
            // Cancelling isn't dismissing: keep the offer on screen.
            showUpdate();
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default DeploymentWatcher;
