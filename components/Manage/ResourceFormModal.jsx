"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import apiClient from "@/lib/AxiosClient";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";
import { useFormDraft } from "@/hooks/useFormDraft";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";
import { MANAGE_FIELDS, validateManageFields } from "@/utils/manageFields";
import CustomMdEditor from "../blog/CustomMdEditor";
import ClientPortal from "../Modules/ClientPortal";
import { LoadingCircle } from "../Modules/LoadingCircle";
import { useToast } from "../Modules/Toaster";
import { capitalize, MANAGE_LISTS } from "./manageLists";

const inputClass =
  "border-border-subtle bg-surface text-text-primary placeholder:text-text-muted focus:border-accent rounded-control w-full border px-4 py-3 text-base transition-colors focus:outline-none aria-invalid:border-danger";

// Add or edit one row. `row` is null when adding. Mounted only while open, so
// each opening starts from the row's saved values plus any draft.
const ResourceFormModal = ({ resource, row, onClose }) => {
  const fields = MANAGE_FIELDS[resource];
  const { noun } = MANAGE_LISTS[resource];

  const router = useRouter();
  const toast = useToast();
  const modalRef = useRef(null);
  const baseId = useId();
  const titleId = `${baseId}-title`;

  const [formData, setFormData] = useState(() =>
    Object.fromEntries(
      fields.map((field) => [field.name, row?.[field.name] ?? ""]),
    ),
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useHideScrollbar(true);
  useFocusTrapping(modalRef, true, onClose);

  const { hasDraft, clearDraft, discardDraft } = useFormDraft(
    `manage-draft:${resource}:${row?.id ?? "new"}`,
    formData,
    setFormData,
    () =>
      toast.info("Your unsaved changes are back.", {
        id: "manage-draft",
        title: "Draft restored",
      }),
  );

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

    const { errors: found } = validateManageFields(fields, formData);
    if (Object.keys(found).length > 0) {
      showErrors(found);
      return;
    }

    setSaving(true);
    try {
      if (row) {
        await apiClient.put(`/manage/${resource}/${row.id}`, formData);
      } else {
        await apiClient.post(`/manage/${resource}`, formData);
      }
      clearDraft();
      toast.success("Your change is live on the site.", {
        title: `${capitalize(noun)} ${row ? "updated" : "added"}`,
      });
      router.refresh();
      onClose();
    } catch (error) {
      console.error(`Error saving ${resource}:`, error);
      const fieldErrors = error.response?.data?.errors;
      if (fieldErrors) {
        showErrors(fieldErrors);
      } else {
        toast.error(error.response?.data?.message || error.message, {
          title: `Couldn't save the ${noun}`,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field) => {
    const id = `${baseId}-${field.name}`;
    const errorId = `${id}-error`;
    const error = errors[field.name];
    const shared = {
      id,
      name: field.name,
      value: formData[field.name],
      onChange: handleChange,
    };
    const aria = {
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? errorId : undefined,
    };

    return (
      <div key={field.name}>
        <label
          htmlFor={id}
          className="text-text-muted mb-2 block text-sm font-semibold"
        >
          {field.label}
          {!field.required && <span className="font-normal"> (optional)</span>}
        </label>

        {field.type === "markdown" ? (
          <CustomMdEditor
            {...shared}
            rows={8}
            placeholder="Markdown supported"
            invalid={Boolean(error)}
            describedBy={error ? errorId : undefined}
          />
        ) : field.type === "textarea" ? (
          <textarea
            {...shared}
            {...aria}
            rows={4}
            className={`${inputClass} resize-y`}
          />
        ) : (
          <input
            {...shared}
            {...aria}
            type={field.type === "url" ? "url" : "text"}
            className={inputClass}
          />
        )}

        {error && (
          <p id={errorId} className="text-danger mt-1.5 text-sm">
            {error}
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
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="z-modal fixed inset-0 flex items-stretch justify-center bg-black/50 sm:items-center dark:bg-black/60"
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            // Full-screen below sm; a centred card from sm up.
            className="border-border-subtle bg-surface sm:rounded-dialog h-dvh w-full max-w-3xl overflow-y-auto shadow-2xl sm:mx-4 sm:h-auto sm:max-h-[calc(100dvh-3rem)] sm:border"
          >
            <div className="border-border-subtle bg-surface z-raised sticky top-0 flex items-center justify-between border-b px-6 py-4">
              <h2
                id={titleId}
                className="text-text-primary text-h3 font-semibold"
              >
                {row ? `Edit ${noun}` : `Add ${noun}`}
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
              {fields.map(renderField)}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-text-primary text-surface rounded-control cursor-pointer px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {row ? "Save changes" : `Add ${noun}`}
                </button>
                {hasDraft && (
                  <button
                    type="button"
                    onClick={discardDraft}
                    className="text-text-muted hover:text-danger rounded-control cursor-pointer px-3 py-3 text-sm font-semibold transition-colors"
                  >
                    Discard changes
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      </ClientPortal>
    </>
  );
};

export default ResourceFormModal;
