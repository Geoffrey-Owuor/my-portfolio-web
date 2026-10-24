import { create } from "zustand";
import { persist } from "zustand/middleware";

export const FONT_STORAGE_KEY = "font-preference";

// Bump when the default font changes: persist writes the store back on every
// load, so without a version bump returning visitors would keep the old
// default. layout.js's pre-hydration script checks this too.
export const FONT_STORAGE_VERSION = 1;

// Keyed by the same values written to <html data-font>, so FONTS[font] and
// the CSS overrides in globals.css always agree. `mono` is the code font each
// one is paired with — display only; the pairing itself lives in globals.css.
export const FONTS = {
  dmsans: {
    label: "DM Sans",
    family: "font-dmsans",
    category: "Sans-serif",
    mono: { label: "DM Mono", family: "font-dm-mono" },
  },
  geist: {
    label: "Geist",
    family: "font-geistsans",
    category: "Sans-serif",
    mono: { label: "Geist Mono", family: "font-geistmono" },
  },
  inter: {
    label: "Inter",
    family: "font-inter",
    category: "Sans-serif",
    mono: { label: "JetBrains Mono", family: "font-jetbrainsmono" },
  },
  merriweather: {
    label: "Merriweather",
    family: "font-merriweather",
    category: "Serif",
    mono: { label: "Courier Prime", family: "font-courierprime" },
  },
  lora: {
    label: "Lora",
    family: "font-lora",
    category: "Serif",
    mono: { label: "Courier Prime", family: "font-courierprime" },
  },
};

export const FONT_ORDER = ["inter", "dmsans", "geist", "merriweather", "lora"];

export const useFontStore = create(
  persist(
    (set) => ({
      font: "inter",
      setFont: (font) => {
        set({ font });
        document.documentElement.setAttribute("data-font", font);
      },
    }),
    {
      name: FONT_STORAGE_KEY,
      version: FONT_STORAGE_VERSION,
      // v0 defaulted to Geist — reset everyone onto the new Inter default.
      migrate: () => ({ font: "inter" }),
    },
  ),
);
