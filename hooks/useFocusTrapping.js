import { useEffect } from "react";

export const useFocusTrapping = (modalRef, modalOpen, closeModal) => {
  // Effect to handle Focus Trapping when fixed modals are open
  useEffect(() => {
    if (!modalOpen) return;

    if (!modalRef.current) return;

    // Find all focusable elements inside the mobile menu
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Automatically focus the first element (Close button) when menu opens
    if (firstElement) firstElement.focus();

    const handleKeyDown = (e) => {
      // Close menu on Escape key
      if (e.key === "Escape") {
        closeModal();
        return;
      }

      // Handle Tab key focus trapping
      if (e.key === "Tab") {
        if (e.shiftKey) {
          // Shift + Tab (going backwards)
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab (going forwards)
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen, closeModal, modalRef]);
};
