"use client";

import {
  LogOut,
  PenLine,
  UserRound,
  Mail,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/AxiosClient";
import LoadingLine from "../Modules/LoadingLine";
import LogoutOverlay from "../Modules/LogoutOverlay";

const BlogAvatar = ({ user }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loadingLine, setLoadingLine] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Derive initials from name
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  const handleLogout = async () => {
    setOpen(false);
    setIsLoggingOut(true);
    try {
      await apiClient.post("/logout");
      // Refresh the page state
      router.refresh();
      // set logging out to false
      setIsLoggingOut(false);
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  const handleRouteChange = (route) => {
    setOpen(false);
    setLoadingLine(true);
    router.push(route);
  };

  return (
    <>
      {loadingLine && <LoadingLine />}
      {isLoggingOut && <LogoutOverlay />}
      <div className="relative" ref={dropdownRef}>
        {/* ── Avatar trigger button ── */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label={user.id ? "Open user menu" : "Go to login"}
          aria-expanded={open}
          className={`group flex cursor-pointer items-center gap-1.5 rounded-full p-0.5 ring-1 transition-all duration-200 focus:outline-none ${
            user.id
              ? "ring-blue-500/60 hover:ring-blue-500 dark:ring-blue-400/60 dark:hover:ring-blue-400"
              : "ring-gray-300/60 hover:ring-gray-400 dark:ring-gray-600/60 dark:hover:ring-gray-500"
          }`}
        >
          {/* Avatar circle */}
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium tracking-wide text-white sm:h-9 sm:w-9 sm:text-sm ${
              user.id
                ? "bg-linear-to-br from-blue-500 to-purple-600"
                : "bg-linear-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700"
            }`}
          >
            {user.id ? (
              initials
            ) : (
              <UserRound className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
            )}
          </span>

          {/* Chevron */}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`mr-1 flex items-center ${user.id ? "" : "opacity-60"}`}
          >
            <ChevronDown
              className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400"
              strokeWidth={2}
            />
          </motion.span>
        </button>

        {/* ── Dropdown panel ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 z-50 mt-2.5 w-60 origin-top-right overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700/60 dark:bg-gray-900 dark:shadow-black/40"
            >
              {user.id ? (
                <>
                  {/* User info */}
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.15 }}
                    className="px-4 py-3.5"
                  >
                    <div className="mb-0.5 flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-xs font-medium text-white">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Mail
                        className="h-3.5 w-3.5 shrink-0"
                        strokeWidth={1.8}
                      />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </motion.div>

                  {/* Divider */}
                  <div className="mx-3 h-px bg-gray-100 dark:bg-gray-800" />

                  {/* Actions */}
                  <div className="p-2">
                    <motion.button
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.15 }}
                      onClick={() => handleRouteChange("/createblog")}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/60"
                    >
                      <PenLine
                        className="h-4 w-4 text-gray-500 dark:text-gray-400"
                        strokeWidth={1.8}
                      />
                      Create Blog
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, duration: 0.15 }}
                      onClick={handleLogout}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" strokeWidth={1.8} />
                      Log out
                    </motion.button>
                  </div>
                </>
              ) : (
                /* No user state */
                <div className="p-2">
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.15 }}
                    className="mb-2 px-3 py-2.5"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      You're not signed in.
                    </p>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.15 }}
                    onClick={() => handleRouteChange("/login?blogs=true")}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/60"
                  >
                    <LogIn
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      strokeWidth={1.8}
                    />
                    Sign in
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default BlogAvatar;
