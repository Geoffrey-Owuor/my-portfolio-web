"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CornerDownLeft,
  FileText,
  FolderGit2,
  Hash,
  Mail,
  NotebookPen,
  SunMoon,
} from "lucide-react";
import ClientPortal from "./ClientPortal";
import { useProgressRouter } from "./RouteProgress";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";
import { sections } from "../Home/sections";
import { EMAIL, GITHUB_URL, RESUME_URL } from "@/utils/links";

// Fetched once per page load, the first time the palette opens.
let searchIndexPromise = null;
const loadSearchIndex = () => {
  searchIndexPromise ??= fetch("/api/search-index")
    .then((res) => (res.ok ? res.json() : { projects: [], blogs: [] }))
    .catch(() => {
      searchIndexPromise = null; // let the next open retry
      return { projects: [], blogs: [] };
    });
  return searchIndexPromise;
};

/**
 * ⌘K / Ctrl+K command palette. Focus stays in the input throughout (combobox
 * pattern): ↑/↓ move the active option, Enter runs it, Esc closes.
 * Controlled by the navbar, which owns the trigger buttons.
 */
const CommandPalette = ({ isOpen, onClose }) => {
  const [queryText, setQueryText] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [index, setIndex] = useState({ projects: [], blogs: [] });

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const pathname = usePathname();
  const router = useProgressRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  useHideScrollbar(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    setQueryText("");
    setActiveIndex(0);
    loadSearchIndex().then(setIndex);

    // Hand focus back to whatever opened the palette.
    const previousFocus = document.activeElement;
    return () => previousFocus?.focus?.();
  }, [isOpen]);

  const commands = useMemo(() => {
    const goToSection = (id) => {
      if (pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`/#${id}`);
      }
    };
    const openExternal = (url) =>
      window.open(url, "_blank", "noopener,noreferrer");

    return [
      ...sections.map((section) => ({
        id: `section-${section.id}`,
        group: "Sections",
        label: section.label,
        hint: section.index,
        icon: Hash,
        run: () => goToSection(section.id),
      })),
      {
        id: "page-blogs",
        group: "Sections",
        label: "All blog posts",
        icon: NotebookPen,
        run: () => router.push("/blogs"),
      },
      ...index.projects.map((project) => ({
        id: `project-${project.id}`,
        group: "Case studies",
        label: project.title,
        icon: FolderGit2,
        run: () => router.push(`/projects/${project.id}`),
      })),
      ...index.blogs.map((blog) => ({
        id: `blog-${blog.id}`,
        group: "Blog posts",
        label: blog.title,
        icon: FileText,
        run: () => router.push(`/blog/${blog.id}`),
      })),
      {
        id: "action-theme",
        group: "Actions",
        label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`,
        icon: SunMoon,
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        id: "action-resume",
        group: "Actions",
        label: "Download résumé",
        icon: ArrowUpRight,
        run: () => openExternal(RESUME_URL),
      },
      {
        id: "action-github",
        group: "Actions",
        label: "Open GitHub profile",
        icon: ArrowUpRight,
        run: () => openExternal(GITHUB_URL),
      },
      {
        id: "action-email",
        group: "Actions",
        label: "Email Jeff",
        icon: Mail,
        run: () => {
          window.location.href = `mailto:${EMAIL}`;
        },
      },
    ];
  }, [index, pathname, router, resolvedTheme, setTheme]);

  const results = useMemo(() => {
    const needle = queryText.trim().toLowerCase();
    if (!needle) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.group}`.toLowerCase().includes(needle),
    );
  }, [commands, queryText]);

  // Keep the highlighted row on screen as the arrow keys walk the list.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const runCommand = (command) => {
    onClose();
    command.run();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((i) => (i + step + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) runCommand(results[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      // The input is the dialog's only stop; keep focus inside.
      e.preventDefault();
    }
  };

  const activeId = results[activeIndex]
    ? `cmd-${results[activeIndex].id}`
    : undefined;

  return (
    <ClientPortal>
      <AnimatePresence>
        {isOpen && (
          <div className="z-modal fixed inset-0 flex items-start justify-center px-4 pt-[12vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/50 dark:bg-black/60"
              onClick={onClose}
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97, y: -8 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.98, y: -4 }
              }
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onAnimationStart={() => inputRef.current?.focus()}
              className="border-border-subtle bg-surface rounded-dialog relative w-full max-w-xl overflow-hidden border shadow-2xl"
            >
              {/* Prompt */}
              <div className="border-border-subtle flex items-center gap-2 border-b px-4 py-3 font-mono text-sm">
                <span
                  className="text-accent shrink-0 select-none"
                  aria-hidden="true"
                >
                  visitor@jeff:~$
                </span>
                <input
                  ref={inputRef}
                  autoFocus
                  value={queryText}
                  onChange={(e) => {
                    setQueryText(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="jump to a section, project or post"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="command-palette-list"
                  aria-activedescendant={activeId}
                  aria-autocomplete="list"
                  className="text-text-primary placeholder:text-text-muted min-w-0 flex-1 bg-transparent focus:outline-none"
                />
                <kbd className="border-border-subtle text-text-muted rounded-chip hidden border px-1.5 py-0.5 text-[10px] sm:block">
                  esc
                </kbd>
              </div>

              {/* Results */}
              <ul
                ref={listRef}
                id="command-palette-list"
                role="listbox"
                aria-label="Commands"
                className="max-h-[min(60vh,26rem)] overflow-y-auto overscroll-contain p-2"
              >
                {results.length === 0 && (
                  <li className="text-text-muted px-3 py-8 text-center text-sm">
                    Nothing matches &ldquo;{queryText}&rdquo;. Try a section
                    name like &ldquo;projects&rdquo;.
                  </li>
                )}

                {results.map((command, i) => {
                  const Icon = command.icon;
                  const isActive = i === activeIndex;
                  const startsGroup =
                    i === 0 || results[i - 1].group !== command.group;

                  return (
                    <li key={command.id} role="presentation">
                      {startsGroup && (
                        <p
                          role="presentation"
                          className="text-text-muted px-3 pt-3 pb-1.5 text-xs"
                        >
                          {command.group}
                        </p>
                      )}
                      <div
                        id={`cmd-${command.id}`}
                        role="option"
                        aria-selected={isActive}
                        data-index={i}
                        onMouseMove={() => setActiveIndex(i)}
                        onClick={() => runCommand(command)}
                        className={`rounded-control flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                          isActive
                            ? "bg-surface-raised text-text-primary"
                            : "text-text-muted"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 ${isActive ? "text-accent" : ""}`}
                        />
                        <span className="min-w-0 flex-1 truncate">
                          {command.label}
                        </span>
                        {command.hint && (
                          <span className="font-mono text-xs tabular-nums">
                            {command.hint}
                          </span>
                        )}
                        {isActive && (
                          <CornerDownLeft className="text-text-muted h-3.5 w-3.5 shrink-0" />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ClientPortal>
  );
};

export default CommandPalette;
