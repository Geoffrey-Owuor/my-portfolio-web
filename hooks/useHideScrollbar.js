import { useEffect } from "react";

// Locks the document's scroll while a drawer/modal is open.
//
// No scrollbar-width compensation: `scrollbar-gutter: stable` on <html>
// (styles/globals.css) keeps the gutter reserved while overflow is hidden,
// so nothing reflows. Don't measure and pad it either — on the root element
// `clientWidth` reports the full viewport once overflow is hidden even
// though the gutter is still reserved, so a measured "reclaimed" width
// double-compensates and shifts the page left.
export const useHideScrollbar = (bool) => {
  useEffect(() => {
    if (!bool) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [bool]);
};
