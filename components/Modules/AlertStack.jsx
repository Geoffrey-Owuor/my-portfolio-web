"use client";
import { AnimatePresence } from "framer-motion";
import { useAlertStore } from "@/store/useAlertStore";
import { SectionAlert } from "./SectionAlert";
import ClientPortal from "./ClientPortal";

export const AlertStack = () => {
  const alerts = useAlertStore((state) => state.alerts);
  const removeAlert = useAlertStore((state) => state.removeAlert);

  // Portalled to <body> so the alerts sit outside the scrolling canvas: they
  // stay anchored to the viewport instead of inheriting a containing block
  // from whichever animated ancestor happens to wrap them.
  return (
    <ClientPortal>
      <AnimatePresence>
        {alerts.map((alert, index) => (
          <SectionAlert
            key={alert.id}
            stackIndex={index}
            message={alert.message}
            type={alert.type}
            IconComponent={alert.iconComponent}
            onClose={() => removeAlert(alert.id)}
          ></SectionAlert>
        ))}
      </AnimatePresence>
    </ClientPortal>
  );
};
