import { create } from "zustand";
import { persist } from "zustand/middleware";

export const FONT_STORAGE_KEY = "font-preference";

// Keyed by the same values written to <html data-font>, so FONTS[font] and
// the CSS overrides in globals.css always agree.
export const FONTS = {
  dmsans: { label: "DM Sans", family: "font-dmsans", category: "Sans-serif" },
  geist: { label: "Geist", family: "font-geistsans", category: "Sans-serif" },
  inter: { label: "Inter", family: "font-inter", category: "Sans-serif" },
  merriweather: {
    label: "Merriweather",
    family: "font-merriweather",
    category: "Serif",
  },
  lora: { label: "Lora", family: "font-lora", category: "Serif" },
};

export const FONT_ORDER = ["geist", "dmsans", "inter", "merriweather", "lora"];

export const useFontStore = create(
  persist(
    (set) => ({
      font: "geist",
      setFont: (font) => {
        set({ font });
        document.documentElement.setAttribute("data-font", font);
      },
    }),
    { name: FONT_STORAGE_KEY },
  ),
);
