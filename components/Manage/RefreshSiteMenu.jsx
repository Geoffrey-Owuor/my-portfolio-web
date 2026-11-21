"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, RefreshCw } from "lucide-react";
import apiClient from "@/lib/AxiosClient";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";
import { useToast } from "../Modules/Toaster";
import { SITE_CACHES } from "@/utils/siteCaches";

const TOAST_ID = "refresh-site";

// A split button beside the /manage tabs: the main half refreshes every
// cached part of the public site, the chevron opens a menu to refresh just
// one. Edits made here already refresh their own section; this is for
// changes made elsewhere. Same menu look and keys as PageSizeMenu.
const RefreshSiteMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const containerRef = useRef(null);
  const toast = useToast();

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

  // `section` null means everything.
  const refresh = async (section) => {
    closeMenu();
    if (pending) return;
    const label = section
      ? SITE_CACHES.find((cache) => cache.id === section)?.label
      : null;

    setPending(true);
    try {
      await apiClient.post("/manage/revalidate", section ? { section } : {});
      toast.success(
        label
          ? `${label} will show the latest content on the next visit.`
          : "Every section will show the latest content on the next visit.",
        { title: "Site refreshed", id: TOAST_ID },
      );
    } catch (error) {
      console.error("Failed to refresh the site:", error);
      toast.error(
        error.response?.data?.message ?? "Please try again in a moment.",
        { title: "Couldn't refresh the site", id: TOAST_ID },
      );
    } finally {
      setPending(false);
    }
  };

  const handleMenuKeyDown = (e) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const items = [...e.currentTarget.querySelectorAll('[role="menuitem"]')];
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

  const halfClass =
    "text-text-muted hover:bg-surface-raised hover:text-text-primary inline-flex items-center py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div
      ref={containerRef}
      className="border-border-subtle rounded-control relative flex shrink-0 border"
    >
      <button
        type="button"
        onClick={() => refresh(null)}
        disabled={pending}
        aria-label="Refresh the live site"
        title="Refresh every section of the live site"
        className={`${halfClass} rounded-l-control gap-2 px-3`}
      >
        <RefreshCw
          className={`h-4 w-4 ${pending ? "motion-safe:animate-spin" : ""}`}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">Refresh site</span>
      </button>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={pending}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Refresh one section"
        className={`${halfClass} border-border-subtle rounded-r-control border-l px-1.5`}
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label="Refresh one section"
            onKeyDown={handleMenuKeyDown}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="bg-surface border-border-subtle z-raised rounded-card absolute top-full right-0 mt-2 w-48 origin-top-right border p-1.5 shadow-lg"
          >
            <p className="text-text-muted px-3 pt-1.5 pb-1 font-mono text-xs">
              Refresh only
            </p>
            {SITE_CACHES.map((cache, index) => (
              <button
                key={cache.id}
                type="button"
                role="menuitem"
                data-autofocus={index === 0 ? "" : undefined}
                onClick={() => refresh(cache.id)}
                className="text-text-muted hover:bg-surface-raised hover:text-text-primary rounded-control flex w-full items-center px-3 py-2 text-left text-sm transition-colors"
              >
                {cache.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RefreshSiteMenu;
