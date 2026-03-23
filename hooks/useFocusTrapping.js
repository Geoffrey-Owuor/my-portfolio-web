import { useEffect } from "react";

export const useFocusTrapping = (modalRef, modalOpen, closeModal) => {
  useEffect(() => {
    if (!modalOpen) return;

    // Defer until after portal renders into the DOM
    const timer = setTimeout(() => {
      if (!modalRef.current) return;

      const previousFocus = document.activeElement;
      const element = modalRef.current;
      const focusableSelector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = element.querySelectorAll(focusableSelector);

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement.focus();

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          closeModal();
          return;
        }
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        if (previousFocus) previousFocus.focus();
      };
    }, 0);

    return () => clearTimeout(timer);
  }, [modalOpen, closeModal, modalRef]);
};
