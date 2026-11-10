import { useCallback, useEffect, useRef } from "react";

const SAVE_DELAY_MS = 400;

// localStorage can throw (private windows, blocked site data). A draft is a
// convenience, so failing to keep one is never an error.
const storage = {
  read: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  write: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

// Keeps a form's unsaved values in localStorage, so an expired session's
// redirect to /login or a closed tab doesn't lose the writing. Restores them on
// mount and calls `onRestore`. A form back at its starting values has no draft.
export const useFormDraft = (key, formData, setFormData, onRestore) => {
  const initialRef = useRef(JSON.stringify(formData));
  const timerRef = useRef(null);
  const onRestoreRef = useRef(onRestore);

  useEffect(() => {
    const saved = storage.read(key);
    if (!saved || saved === initialRef.current) return;

    try {
      setFormData(JSON.parse(saved));
      onRestoreRef.current?.();
    } catch {
      storage.remove(key);
    }
  }, [key, setFormData]);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const current = JSON.stringify(formData);
      if (current === initialRef.current) storage.remove(key);
      else storage.write(key, current);
    }, SAVE_DELAY_MS);

    return () => clearTimeout(timerRef.current);
  }, [key, formData]);

  const clearDraft = useCallback(() => {
    clearTimeout(timerRef.current);
    storage.remove(key);
  }, [key]);

  const discardDraft = useCallback(() => {
    clearDraft();
    setFormData(JSON.parse(initialRef.current));
  }, [clearDraft, setFormData]);

  return {
    hasDraft: JSON.stringify(formData) !== initialRef.current,
    clearDraft,
    discardDraft,
  };
};
