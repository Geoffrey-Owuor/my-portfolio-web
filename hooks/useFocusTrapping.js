import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Open traps, innermost last. Only the top one answers the keyboard, so one
// Escape closes a confirmation dialog without also closing the modal under it.
const openTraps = [];

// Keeps Tab inside `modalRef` while `modalOpen`, closes on Escape, and hands
// focus back to whatever had it once the trap closes.
export const useFocusTrapping = (modalRef, modalOpen, closeModal) => {
  // Read through a ref so an inline `closeModal` doesn't restart the trap (and
  // steal focus back to the first control) on every render.
  const closeRef = useRef(closeModal);
  useEffect(() => {
    closeRef.current = closeModal;
  });

  useEffect(() => {
    if (!modalOpen) return;

    const previousFocus = document.activeElement;
    const trap = {};
    openTraps.push(trap);

    // The controls are looked up per key press: a modal's contents change
    // while it's open (the editor swaps its toolbar for the preview).
    const getFocusable = () =>
      modalRef.current
        ? [...modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR)]
        : [];

    // Deferred until the portal has rendered into the DOM.
    const timer = setTimeout(() => getFocusable()[0]?.focus(), 0);

    const handleKeyDown = (e) => {
      if (openTraps[openTraps.length - 1] !== trap) return;

      if (e.key === "Escape") {
        closeRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const outside = !modalRef.current.contains(active);

      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      openTraps.splice(openTraps.indexOf(trap), 1);
      previousFocus?.focus?.();
    };
  }, [modalOpen, modalRef]);
};
