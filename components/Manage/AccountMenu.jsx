"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
  KeyRound,
  LogOut,
  UserRound,
} from "lucide-react";
import apiClient from "@/lib/AxiosClient";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";
import { hasUnsavedChanges } from "@/hooks/useUnsavedChanges";
import ConfirmationDialog from "../Modules/ConfirmationDialog";
import LogoutOverlay from "../Modules/LogoutOverlay";
import { useToast } from "../Modules/Toaster";
import ChangePasswordModal from "./ChangePasswordModal";

const initialsOf = (name) =>
  name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

// The /manage account control: an avatar button that opens a menu with who
// is signed in, a link to the live site, Change password and Sign out. Same menu look and keys
// as RefreshSiteMenu.
const AccountMenu = ({ user }) => {
  const { name, email } = user;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
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

  const signOut = async () => {
    setConfirming(false);
    setIsLoggingOut(true);
    try {
      await apiClient.post("/logout");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Please try again in a moment.", {
        title: "Couldn't sign you out",
      });
      setIsLoggingOut(false);
    }
  };

  // Signing out navigates away, so work still in flight (a résumé upload) is
  // asked about first. Modals cover the menu, so nothing else can be pending.
  const handleSignOutClick = () => {
    closeMenu();
    if (hasUnsavedChanges()) setConfirming(true);
    else signOut();
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

  const initials = initialsOf(name);
  const itemBase =
    "text-text-muted rounded-control flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors";

  return (
    <div ref={containerRef} className="relative">
      {isLoggingOut && <LogoutOverlay />}
      <AnimatePresence>
        {confirming && (
          <ConfirmationDialog
            showConfirmation={confirming}
            title="Sign out during an upload?"
            message="A file is still uploading. Signing out now stops it, and you'll need to upload it again."
            confirmLabel="Sign out anyway"
            tone="danger"
            onConfirm={signOut}
            onCancel={() => setConfirming(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {changingPassword && (
          <ChangePasswordModal
            email={email}
            onClose={() => setChangingPassword(false)}
          />
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isLoggingOut}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Account menu for ${name || "owner"}`}
        className="border-border-subtle hover:bg-surface-raised text-text-muted hover:text-text-primary rounded-control flex items-center gap-1 border p-1 pr-2 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          {initials ? (
            <span className="text-sm font-bold tracking-tight">{initials}</span>
          ) : (
            <UserRound className="h-5 w-5" aria-hidden="true" />
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label="Account"
            onKeyDown={handleMenuKeyDown}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="bg-surface border-border-subtle z-raised rounded-card absolute top-full right-0 mt-2 w-64 origin-top-right border p-1.5 shadow-lg"
          >
            <div className="border-border-subtle mb-1.5 border-b px-3 pt-1.5 pb-2.5">
              <p className="text-text-primary truncate text-sm font-semibold">
                {name}
              </p>
              <p className="text-text-muted truncate text-xs" title={email}>
                {email}
              </p>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener"
              role="menuitem"
              data-autofocus=""
              onClick={closeMenu}
              className={`${itemBase} hover:bg-surface-raised hover:text-text-primary`}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View live site
            </a>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                closeMenu();
                setChangingPassword(true);
              }}
              className={`${itemBase} hover:bg-surface-raised hover:text-text-primary`}
            >
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              Change password
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOutClick}
              className={`${itemBase} hover:bg-danger/10 hover:text-danger`}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountMenu;
