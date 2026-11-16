import { useRef } from "react";

// Props for a modal's backdrop: it closes the modal only when a click both
// starts and ends on the backdrop itself. A plain onClick would also fire when
// a text selection is dragged from a field out past the dialog's edge, and
// close the form mid-edit.
export const useBackdropClose = (onClose) => {
  const pressedOnBackdrop = useRef(false);

  return {
    onPointerDown: (event) => {
      pressedOnBackdrop.current = event.target === event.currentTarget;
    },
    onClick: (event) => {
      if (pressedOnBackdrop.current && event.target === event.currentTarget) {
        onClose();
      }
      pressedOnBackdrop.current = false;
    },
  };
};
