import { useEffect } from "react";

// Locks the app's scrolling surface while a drawer/modal is open. The canvas
// (not the document) is what scrolls, so that's what has to be frozen —
// see components/Layout/AppCanvas.jsx.
export const useHideScrollbar = (bool) => {
  useEffect(() => {
    if (!bool) return;

    const canvas = document.getElementById("app-canvas");
    if (!canvas) return;

    const previousOverflow = canvas.style.overflowY;
    const previousPadding = canvas.style.paddingRight;

    // Measure the shift the lock actually caused rather than assuming one.
    // Where `scrollbar-gutter: stable` is honoured the gutter survives the
    // lock and this is 0; where it isn't, the content gains the scrollbar's
    // width and needs compensating.
    const widthBefore = canvas.clientWidth;
    canvas.style.overflowY = "hidden";
    const reclaimed = canvas.clientWidth - widthBefore;

    if (reclaimed > 0) {
      canvas.style.paddingRight = `${reclaimed}px`;
    }

    return () => {
      canvas.style.overflowY = previousOverflow;
      canvas.style.paddingRight = previousPadding;
    };
  }, [bool]);
};
