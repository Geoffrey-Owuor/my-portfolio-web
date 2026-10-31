import { create } from "zustand";
import { persist } from "zustand/middleware";

export const FONT_STORAGE_KEY = "font-preference";

// Bump when the default font changes: persist writes the store back on every
// load, so without a version bump returning visitors would keep the old
// default. layout.js's pre-hydration script checks this too.
// v1 → v2: Merriweather was replaced by Source Serif 4 (see migrateFont).
export const FONT_STORAGE_VERSION = 2;

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
  sourceserif: {
    label: "Source Serif 4",
    family: "font-sourceserif",
    category: "Serif",
    mono: { label: "Source Code Pro", family: "font-sourcecodepro" },
  },
  lora: {
    label: "Lora",
    family: "font-lora",
    category: "Serif",
    mono: { label: "Courier Prime", family: "font-courierprime" },
  },
};

export const FONT_ORDER = ["inter", "dmsans", "geist", "sourceserif", "lora"];

// Fonts that were dropped from FONTS, mapped to their replacement. Shared with
// layout.js's pre-hydration script so a saved choice keeps applying.
export const RENAMED_FONTS = { merriweather: "sourceserif" };

// Brings a saved preference from an older storage version up to date: v0
// defaulted to Geist, so everyone on it is reset onto the Inter default; from
// v1 the choice is kept, with dropped fonts swapped for their replacement.
const migrateFont = (persisted, version) => {
  if (version < 1) return { font: "inter" };
  const font = RENAMED_FONTS[persisted?.font] ?? persisted?.font;
  return { font: FONTS[font] ? font : "inter" };
};

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
      migrate: migrateFont,
    },
  ),
);
