"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { THEME_COLORS } from "@/utils/themeColors";

/**
 * Keeps the browser/app title bar on the site's chosen theme. Until
 * hydration the layout's two media-keyed `theme-color` tags follow the OS.
 * After it, this adds a tag of its own with no media query at the top of
 * <head>. Browsers use the first matching tag, so a choice made with the
 * toggle wins over the OS. Next re-renders its own metadata tags on client
 * navigation, which is why their content is never edited here. Headless.
 */
const ThemeColor = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = THEME_COLORS[resolvedTheme];
    if (!color) return;
    let meta = document.getElementById("theme-color-active");
    if (!meta) {
      meta = document.createElement("meta");
      meta.id = "theme-color-active";
      meta.name = "theme-color";
      document.head.prepend(meta);
    }
    meta.content = color;
  }, [resolvedTheme]);

  return null;
};

export default ThemeColor;
