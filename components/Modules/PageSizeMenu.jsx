"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";

// "Per page: 6 ▾" — a small popover in the pagination row. It sits at the
// bottom of a list, so the menu opens upwards. Same look and keyboard
// behaviour as FontSwitcher, plus arrow keys between the options.
const PageSizeMenu = ({ value, options, onChange, label = "Per page" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const labelId = useId();

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

  const handleSelect = (size) => {
    closeMenu();
    if (size !== value) onChange(size);
  };

  const handleMenuKeyDown = (e) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const items = [
      ...e.currentTarget.querySelectorAll('[role="menuitemradio"]'),
    ];
    const current = items.indexOf(document.activeElement);
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? items.length - 1
          : (current + (e.key === "ArrowDown" ? 1 : -1) + items.length) %
            items.length;
    items[next]?.focus();
  };

  return (
    <div className="relative flex items-center gap-2" ref={containerRef}>
      <span id={labelId} className="text-text-muted text-sm">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-labelledby={labelId}
        aria-describedby={`${labelId}-value`}
        className="border-border-subtle bg-surface-raised text-text-primary hover:bg-border-subtle/50 rounded-control inline-flex items-center gap-1.5 border py-1.5 pr-2 pl-3 text-sm font-semibold transition-colors"
      >
        <span id={`${labelId}-value`}>{value}</span>
        <ChevronDown
          className={`text-text-muted h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-labelledby={labelId}
            onKeyDown={handleMenuKeyDown}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="bg-surface border-border-subtle z-raised rounded-card absolute right-0 bottom-full mb-2 w-28 origin-bottom-right border p-1.5 shadow-lg"
          >
            {options.map((size) => (
              <button
                key={size}
                type="button"
                role="menuitemradio"
                aria-checked={value === size}
                data-autofocus={value === size ? "" : undefined}
                onClick={() => handleSelect(size)}
                className={`rounded-control flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                  value === size
                    ? "bg-surface-raised text-text-primary"
                    : "text-text-muted hover:bg-surface-raised hover:text-text-primary"
                }`}
              >
                {size}
                {value === size && <Check className="h-4 w-4 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageSizeMenu;
