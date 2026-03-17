"use client";
import { AnimatePresence } from "framer-motion";
import { useAlertStore } from "@/store/useAlertStore";
import { SectionAlert } from "./SectionAlert";

export const AlertStack = () => {
  const alerts = useAlertStore((state) => state.alerts);
  const removeAlert = useAlertStore((state) => state.removeAlert);

  return (
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
  );
};
