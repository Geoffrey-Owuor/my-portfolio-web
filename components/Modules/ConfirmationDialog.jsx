"use client";

import { X } from "lucide-react";
import ClientPortal from "./ClientPortal";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";

const ConfirmationDialog = ({
  message,
  onConfirm,
  showConfirmation,
  onCancel,
  title,
}) => {
  const modalRef = useRef(null);
  useFocusTrapping(modalRef, showConfirmation, onCancel);

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-0 z-9999 flex items-center justify-center bg-black/50 dark:bg-black/60`}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="border-border-subtle bg-surface-raised mx-auto max-w-90 rounded-2xl border p-4 shadow-2xl md:max-w-md"
      >
        <div className="relative mb-4 flex items-start justify-between">
          <h3 className="text-text-primary text-xl font-bold">{title}</h3>
          <button
            onClick={onCancel}
            type="button"
            className="text-text-muted hover:bg-surface hover:text-text-primary absolute -top-0.5 right-0 cursor-pointer rounded-full p-1 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="text-text-muted mb-4 text-center">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            type="button"
            className="border-border-subtle bg-surface text-text-primary hover:bg-surface-raised rounded-full border px-4 py-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-text-primary text-surface rounded-full px-4 py-2 transition-opacity hover:opacity-90"
          >
            Proceed
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
  return <ClientPortal>{content}</ClientPortal>;
};

export default ConfirmationDialog;
