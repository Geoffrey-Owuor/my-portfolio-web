import { useEffect } from "react";

export const useHideScrollbar = (bool) => {
  // Effect to prevent html scroll when menu is open
  useEffect(() => {
    if (!bool) return;

    // Calculate the width of the scrollbar
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth + 0.3;

    // Prevent scrolling
    document.documentElement.style.overflow = "hidden";

    // Add padding to compensate for the missing scrollbar to prevent layout shift
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;

    const elements = document.querySelectorAll(".adjust-padding");

    elements.forEach((el) => {
      el.style.paddingRight = `${scrollbarWidth}px`;
    });

    return () => {
      // Cleanup
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
      elements.forEach((el) => {
        el.style.paddingRight = "";
      });
    };
  }, [bool]);
};
