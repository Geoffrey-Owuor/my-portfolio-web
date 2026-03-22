// import { useEffect } from "react";

// export const useFocusTrapping = (modalRef, modalOpen, closeModal) => {
//   // Effect to handle Focus Trapping when fixed modals are open
//   useEffect(() => {
//     if (!modalOpen || !modalRef.current) return;

//     // Save the element that had focus before the modal opened
//     const previousFocus = document.activeElement;
//     const element = modalRef.current;

//     // Find all focusable elements inside the mobile menu
//     const focusableSelector =
//       'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

//     const focusableElements = element.querySelectorAll(focusableSelector);

//     if (focusableElements.length === 0) return;

//     const firstElement = focusableElements[0];
//     const lastElement = focusableElements[focusableElements.length - 1];

//     // Automatically focus the first element (Close button) when menu opens
//     firstElement.focus();

//     const handleKeyDown = (e) => {
//       // Close menu on Escape key
//       if (e.key === "Escape") {
//         closeModal();
//         return;
//       }

//       // Handle Tab key focus trapping
//       if (e.key === "Tab") {
//         if (e.shiftKey) {
//           // Shift + Tab (going backwards)
//           if (document.activeElement === firstElement) {
//             e.preventDefault();
//             lastElement.focus();
//           }
//         } else {
//           // Tab (going forwards)
//           if (document.activeElement === lastElement) {
//             e.preventDefault();
//             firstElement.focus();
//           }
//         }
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//       // Restore focus when modal closes
//       if (previousFocus) previousFocus.focus();
//     };
//   }, [modalOpen, closeModal, modalRef]);
// };

import { useEffect } from "react";

export const useFocusTrapping = (modalRef, modalOpen, closeModal) => {
  useEffect(() => {
    // 1. Ensure the modal is open AND the ref is actually attached to a DOM node
    if (!modalOpen || !modalRef.current) return;

    const element = modalRef.current;

    // 2. Select focusable elements
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const handleFocus = () => {
      const focusableElements = element.querySelectorAll(focusableSelector);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement.focus();

      const handleKeyDown = (e) => {
        if (e.key === "Escape") closeModal();
        if (e.key !== "Tab") return;

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
      };

      document.addEventListener("keydown", handleKeyDown);
      return handleKeyDown;
    };

    // Use requestAnimationFrame to ensure the browser has painted the motion.div
    const rafId = requestAnimationFrame(() => {
      const cleanupKeyDown = handleFocus();

      // Store cleanup for the inner function
      element._cleanup = cleanupKeyDown;
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (element._cleanup) {
        document.removeEventListener("keydown", element._cleanup);
      }
    };
  }, [modalOpen, closeModal, modalRef]);
};
