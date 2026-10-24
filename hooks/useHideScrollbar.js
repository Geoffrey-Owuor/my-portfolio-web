import { useEffect } from "react";

// Locks the document's scroll while a drawer/modal is open.
export const useHideScrollbar = (bool) => {
  useEffect(() => {
    if (!bool) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPadding = root.style.paddingRight;

    // Measure the shift the lock actually caused rather than assuming one.
    // Where `scrollbar-gutter: stable` is honoured (styles/globals.css) the
    // gutter survives the lock and this is 0; where it isn't, the content
    // gains the scrollbar's width and needs compensating.
    const widthBefore = root.clientWidth;
    root.style.overflow = "hidden";
    const reclaimed = root.clientWidth - widthBefore;

    if (reclaimed > 0) {
      root.style.paddingRight = `${reclaimed}px`;
    }

    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
    };
  }, [bool]);
};
