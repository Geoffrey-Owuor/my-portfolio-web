"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaseSensitive, Check } from "lucide-react";
import { FONT_ORDER, FONTS, useFontStore } from "@/store/useFontStore";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";

// Accessibility control: lets a visitor swap the site's reading font (Inter
// by default) for one of four alternates — see store/useFontStore.js for
// the options and globals.css for how the choice is actually applied.
// Grouped by category (in FONT_ORDER's order); each row also previews the
// mono font that comes paired with it.
const CATEGORIES = [...new Set(FONT_ORDER.map((key) => FONTS[key].category))];

const FontSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const font = useFontStore((state) => state.font);
  const setFont = useFontStore((state) => state.setFont);
  const containerRef = useRef(null);

  const closeMenu = () => setIsOpen(false);

  useFocusTrapping(containerRef, isOpen, closeMenu);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (key) => {
    setFont(key);
    closeMenu();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Change site font, currently ${FONTS[font].label}`}
        className="text-text-muted hover:bg-surface-raised hover:text-text-primary rounded-full p-2 transition-colors"
      >
        <CaseSensitive className="h-6 w-6 lg:h-5 lg:w-5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label="Site font"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="bg-surface border-border-subtle z-raised rounded-card absolute top-full right-0 mt-2 w-52 origin-top-right border p-1.5 shadow-lg"
          >
            {CATEGORIES.map((category) => (
              <div
                key={category}
                role="group"
                aria-labelledby={`font-group-${category}`}
              >
                <p
                  id={`font-group-${category}`}
                  className="text-text-muted px-3 pt-2 pb-1 font-mono text-[11px] tracking-wider uppercase"
                >
                  {category}
                </p>
                {FONT_ORDER.filter(
                  (key) => FONTS[key].category === category,
                ).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="menuitemradio"
                    aria-checked={font === key}
                    onClick={() => handleSelect(key)}
                    className={`rounded-control flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                      font === key
                        ? "bg-surface-raised text-text-primary"
                        : "text-text-muted hover:bg-surface-raised hover:text-text-primary"
                    }`}
                  >
                    <span>
                      <span className={`block ${FONTS[key].family}`}>
                        {FONTS[key].label}
                        {key === "inter" && (
                          <span className="text-text-muted ml-1 text-xs">
                            (default)
                          </span>
                        )}
                      </span>
                      {/* Its paired code font, previewed in that face */}
                      <span
                        className={`text-text-muted block text-xs ${FONTS[key].mono.family}`}
                      >
                        <span className="sr-only">with code font </span>
                        {FONTS[key].mono.label}
                      </span>
                    </span>
                    {font === key && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FontSwitcher;
