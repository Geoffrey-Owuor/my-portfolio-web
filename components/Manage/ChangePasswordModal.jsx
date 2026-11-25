"use client";

import { useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, X } from "lucide-react";
import apiClient from "@/lib/AxiosClient";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";
import { useBackdropClose } from "@/hooks/useBackdropClose";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";
import { newPasswordError, PASSWORD_MIN_CHARS } from "@/utils/passwordRules";
import ClientPortal from "../Modules/ClientPortal";
import { LoadingCircle } from "../Modules/LoadingCircle";
import { useToast } from "../Modules/Toaster";

const inputClass =
  "border-border-subtle bg-surface text-text-primary placeholder:text-text-muted focus:border-accent rounded-field w-full border py-3 pr-12 pl-4 text-base transition-colors focus:outline-none aria-invalid:border-danger";

const FIELDS = [
  {
    name: "currentPassword",
    label: "Current password",
    autoComplete: "current-password",
  },
  {
    name: "newPassword",
    label: "New password",
    autoComplete: "new-password",
    hint: `At least ${PASSWORD_MIN_CHARS} characters.`,
  },
  {
    name: "confirmPassword",
    label: "Confirm new password",
    autoComplete: "new-password",
  },
];

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

const validate = ({ currentPassword, newPassword, confirmPassword }) => {
  const errors = {};
  if (!currentPassword) errors.currentPassword = "Enter your current password.";
  const newError = newPasswordError(newPassword);
  if (newError) errors.newPassword = newError;
  else if (newPassword === currentPassword) {
    errors.newPassword =
      "Choose a password that's different from your current one.";
  }
  if (!confirmPassword)
    errors.confirmPassword = "Enter the new password again.";
  else if (confirmPassword !== newPassword) {
    errors.confirmPassword = "This doesn't match the new password.";
  }
  return errors;
};

// Opened from the AccountMenu. Mounted only while open, so every opening
// starts empty. Passwords are never kept in a draft: drafts go to storage.
const ChangePasswordModal = ({ email, onClose }) => {
  const toast = useToast();
  const modalRef = useRef(null);
  const baseId = useId();
  const titleId = `${baseId}-title`;

  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState({});
  const [saving, setSaving] = useState(false);

  useUnsavedChanges(Object.values(formData).some(Boolean) || saving);
  useHideScrollbar(true);
  useFocusTrapping(modalRef, true, onClose);
  const backdropProps = useBackdropClose(onClose);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => {
      if (!previous[name]) return previous;
      const { [name]: _cleared, ...rest } = previous;
      return rest;
    });
  };

  const showErrors = (found) => {
    setErrors(found);
    // After the render that marks the fields invalid.
    setTimeout(() => {
      modalRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    }, 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const found = validate(formData);
    if (Object.keys(found).length > 0) {
      showErrors(found);
      return;
    }

    setSaving(true);
    try {
      await apiClient.put("/manage/password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success("Any other devices have been signed out.", {
        title: "Password changed",
      });
      onClose();
    } catch (error) {
      // A wrong current password is an expected answer, not worth logging.
      const fieldErrors = error.response?.data?.errors;
      if (fieldErrors) {
        showErrors(fieldErrors);
      } else {
        console.error("Error changing the password:", error);
        toast.error(error.response?.data?.message || error.message, {
          title: "Couldn't change your password",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const renderField = ({ name, label, autoComplete, hint }) => {
    const id = `${baseId}-${name}`;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;
    const error = errors[name];
    const shown = Boolean(visible[name]);
    const describedBy =
      [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined;

    return (
      <div key={name}>
        <label
          htmlFor={id}
          className="text-text-muted mb-2 block text-sm font-semibold"
        >
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            name={name}
            type={shown ? "text" : "password"}
            value={formData[name]}
            onChange={handleChange}
            autoComplete={autoComplete}
            data-autofocus={name === "currentPassword" ? "" : undefined}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() =>
              setVisible((previous) => ({ ...previous, [name]: !shown }))
            }
            aria-label={
              shown
                ? `Hide ${label.toLowerCase()}`
                : `Show ${label.toLowerCase()}`
            }
            aria-pressed={shown}
            className="text-text-muted hover:text-text-primary rounded-control absolute inset-y-0 right-1 my-auto flex h-9 w-9 cursor-pointer items-center justify-center transition-colors"
          >
            {shown ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {error && (
          <p id={errorId} className="text-danger mt-1.5 text-sm">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-text-muted mt-1.5 text-sm">
            {hint}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      {saving && <LoadingCircle />}
      <ClientPortal>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          {...backdropProps}
          className="z-modal fixed inset-0 flex items-stretch justify-center bg-black/50 sm:items-center dark:bg-black/60"
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            // Full-screen below sm; a centred card from sm up.
            className="border-border-subtle bg-surface sm:rounded-dialog scrollbar-slim h-dvh w-full max-w-md overflow-y-auto shadow-2xl sm:mx-4 sm:h-auto sm:max-h-[calc(100dvh-3rem)] sm:border"
          >
            <div className="border-border-subtle bg-surface z-raised sticky top-0 flex items-center justify-between border-b px-6 py-4">
              <h2
                id={titleId}
                className="text-text-primary text-h3 font-semibold"
              >
                Change password
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="text-text-muted hover:bg-surface-raised hover:text-text-primary rounded-control cursor-pointer p-2 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5 p-6">
              {/* Tells password managers which saved login to update. */}
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={email ?? ""}
                readOnly
                hidden
              />
              {FIELDS.map(renderField)}

              <p className="text-text-muted text-sm">
                You&apos;ll stay signed in here. Any other device will be signed
                out.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-text-primary text-surface rounded-field cursor-pointer px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Change password
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-text-muted hover:text-text-primary rounded-field cursor-pointer px-3 py-3 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </ClientPortal>
    </>
  );
};

export default ChangePasswordModal;
