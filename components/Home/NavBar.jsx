"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { tools } from "@/assets/assets";
import { Menu, X, ArrowUpRight, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { ProgressLink, useProgressRouter } from "../Modules/RouteProgress";
import ThemeToggleCompact from "../Theme/ThemeToggleCompact";
import FontSwitcher from "../Modules/FontSwitcher";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";
import { sections } from "./sections";
import { GITHUB_URL } from "@/utils/links";
import CommandPalette from "../Modules/CommandPalette";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

// Section links double as scroll-spy targets (see components/Home/sections.js).
// `blogs` is a route, not a section, so it is matched against the pathname
// instead.
const navLinks = sections.filter((section) => section.nav !== false);

const Wordmark = () => (
  <span className="text-text-primary font-mono text-[17px] font-medium">
    Jeff
  </span>
);

// Every tab in the command bar: a transparent hit area with the single active
// pill sliding underneath it via a shared layout animation. Declared at module
// scope so the pill isn't remounted (and the animation lost) on each render.
const Tab = ({ isActive, onClick, children }) => (
  <li className="relative">
    {isActive && (
      <motion.span
        layoutId="command-bar-pill"
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="bg-surface-raised border-border-subtle absolute inset-0 rounded-lg border"
        aria-hidden="true"
      />
    )}
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "true" : undefined}
      className={`relative cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors ${
        isActive
          ? "text-text-primary"
          : "text-text-muted hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  </li>
);

// Reading progress through the page, drawn along the header's bottom edge.
const ScrollProgress = () => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    mass: 0.3,
  });

  return (
    <motion.span
      aria-hidden="true"
      style={{ scaleX: prefersReducedMotion ? scrollYProgress : smoothed }}
      className="bg-accent pointer-events-none absolute right-0 bottom-0 left-0 h-px origin-left"
    />
  );
};

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // "⌘K" on Apple platforms, "Ctrl K" elsewhere — resolved after mount so
  // the server-rendered label never mismatches.
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");

  const [activeId, setActiveId] = useState("");

  const pathname = usePathname();
  const router = useProgressRouter();

  // derived state to check if we are in the homepage
  const isInHome = pathname === "/";

  // On /blogs the pill parks on the Blogs tab; anywhere else off-home nothing
  // is active until the user navigates back to a section.
  const activeKey = useMemo(() => {
    if (pathname === "/blogs") return "blogs";
    return isInHome ? activeId : "";
  }, [pathname, isInHome, activeId]);

  // One rAF-throttled listener drives the scroll-spy. Sections are looked up
  // per tick rather than observed once, because they stream in behind
  // <Suspense> and replace their skeletons.
  useEffect(() => {
    let queued = false;

    const measure = () => {
      queued = false;

      if (!isInHome) {
        setActiveId("");
        return;
      }

      // Whichever section straddles the viewport midline is the active one.
      const midline = window.innerHeight / 2;
      let current = "";

      for (const link of sections) {
        const node = document.getElementById(link.id);
        if (!node) continue;

        const { top, bottom } = node.getBoundingClientRect();
        if (top <= midline && bottom > midline) {
          current = link.id;
          break;
        }
      }

      setActiveId(current);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isInHome, pathname]);

  const handleNavbarRouting = (route) => {
    router.push(route);
  };

  // Jump to a section on the homepage, or route there first from elsewhere.
  const handleTabClick = (link) => {
    if (!isInHome) {
      handleNavbarRouting(link.href);
      return;
    }

    document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Wordmark/section links always render as a <Link href="/#id"> (a real
  // anchor, for accessibility/middle-click/new-tab), but a plain left click is
  // intercepted: on the homepage it goes through the same explicit
  // smooth-scroll path as the tabs — native fragment navigation would
  // otherwise scroll instantly (there's deliberately no CSS scroll-smooth, so
  // Next's own hash-scroll after a route change stays instant) — and elsewhere it routes client-side to the section.
  //
  // The markup must NOT branch on `isInHome`: the homepage is prerendered at
  // build time where usePathname() reports "/index", not "/", so any
  // home-only markup mismatches on hydration and React re-renders the whole
  // document (a full white frame in Chrome).
  const handleSectionLinkClick = (e, id) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();

    if (!isInHome) {
      handleNavbarRouting(`/#${id}`);
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to explicitly close the mobile menu (used for link clicks)
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Ref for the sidebar menu
  const menuRef = useRef(null);

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcutLabel("⌘K");

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsMenuOpen(false);
        setIsPaletteOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeSection = sections.find((section) => section.id === activeKey);

  // Run scrollbar hook to hide scrollbar when sidebar is open
  useHideScrollbar(isMenuOpen);

  // Hook to handle Focus Trapping inside the mobile menu
  useFocusTrapping(menuRef, isMenuOpen, closeMenu);

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* ── Desktop: full-width sticky command bar; the page scrolls beneath
          its translucent blur. Deliberately unclipped: the theme toggle
          hangs its tooltip below the bar, so no `overflow-hidden` here. ── */}
      <nav
        aria-label="Main"
        className="border-border-subtle bg-surface/80 navbar-blur sticky top-0 z-50 hidden h-(--header-h) border-b lg:block"
      >
        <ScrollProgress />

        <div className="container-page flex h-full items-center justify-between gap-3">
          {/* Left cluster */}
          <div className="flex items-center gap-3">
            {/* Wordmark */}
            <Link
              href="/#home"
              onClick={(e) => handleSectionLinkClick(e, "home")}
            >
              <Wordmark />
            </Link>

            <span
              className="bg-border-subtle h-6 w-px shrink-0"
              aria-hidden="true"
            />

            {/* Tabs — the sliding pill tracks the section under the viewport midline */}
            <ul className="flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Tab
                  key={link.id}
                  isActive={activeKey === link.id}
                  onClick={() => handleTabClick(link)}
                >
                  {link.label}
                </Tab>
              ))}

              <span
                className="bg-border-subtle mx-1.5 h-6 w-px shrink-0"
                aria-hidden="true"
              />

              <Tab
                isActive={activeKey === "blogs"}
                onClick={() =>
                  pathname === "/blogs"
                    ? undefined
                    : handleNavbarRouting("/blogs")
                }
              >
                Blogs
              </Tab>
            </ul>
          </div>

          {/* Right cluster */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPaletteOpen(true)}
              aria-label="Open command palette"
              aria-haspopup="dialog"
              className="border-border-subtle text-text-muted hover:text-text-primary hover:bg-surface-raised flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-sm transition-colors"
            >
              <Search className="h-4 w-4" />
              <kbd className="font-mono text-xs">{shortcutLabel}</kbd>
            </button>
            <div className="text-text-muted hover:bg-surface-raised flex h-9 w-9 items-center justify-center rounded-lg transition-colors">
              <FontSwitcher />
            </div>
            <div className="text-text-muted hover:bg-surface-raised flex h-9 w-9 items-center justify-center rounded-lg transition-colors">
              <ThemeToggleCompact />
            </div>

            <a
              href={GITHUB_URL}
              aria-label="GitHub Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-text-primary text-surface flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-opacity hover:opacity-90"
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                <Image
                  src={tools.githubLogo}
                  alt=""
                  width={24}
                  height={24}
                  className="h-4 w-4 invert dark:invert-0"
                />
              </span>
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* ── Mobile: the same sticky, blurred bar, without the tabs. ── */}
      <header className="border-border-subtle bg-surface/80 navbar-blur sticky top-0 z-50 flex h-(--header-h) items-center justify-between border-b px-3 lg:hidden">
        <ScrollProgress />

        {/* min-w-0 + truncate: a long section label ("05 Experience") used to
            push the icon cluster past the screen edge on narrow phones,
            widening the whole document. */}
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={toggleMenu}
            className="text-text-muted hover:bg-surface-raised shrink-0 rounded-lg p-2 transition"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link
            href="/#home"
            onClick={(e) => handleSectionLinkClick(e, "home")}
            className="shrink-0"
          >
            <Wordmark />
          </Link>

          {/* The mobile header has no tabs, so it names the section in view */}
          <AnimatePresence mode="wait" initial={false}>
            {activeSection && (
              <motion.span
                key={activeSection.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="text-text-muted min-w-0 truncate font-mono text-xs"
              >
                <span className="text-accent">{activeSection.index}</span>{" "}
                {activeSection.label}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setIsPaletteOpen(true)}
            aria-label="Open command palette"
            aria-haspopup="dialog"
            className="text-text-muted hover:bg-surface-raised flex size-9 items-center justify-center rounded-lg transition-colors sm:size-10"
          >
            <Search className="h-5 w-5" />
          </button>
          <div className="text-text-muted hover:bg-surface-raised flex size-9 items-center justify-center rounded-lg transition-colors sm:size-10">
            <FontSwitcher />
          </div>

          <div className="text-text-muted hover:bg-surface-raised flex size-9 items-center justify-center rounded-lg transition-colors sm:size-10">
            <ThemeToggleCompact />
          </div>

          <a
            href={GITHUB_URL}
            aria-label="GitHub Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:bg-surface-raised hover:text-text-primary flex size-9 items-center justify-center rounded-lg transition-colors sm:size-10"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              <Image
                src={tools.githubLogo}
                alt=""
                width={24}
                height={24}
                className="h-5 w-5 dark:invert"
              />
            </span>
          </a>
        </div>
      </header>

      {/* Overlay - appears when menu is open */}
      <div
        className={`fixed inset-0 z-80 bg-black/50 transition-all duration-200 lg:hidden dark:bg-black/60 ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer - slides from left to right */}
      <div
        ref={menuRef}
        className={`bg-surface fixed top-0 bottom-0 left-0 z-80 w-72 transform shadow-2xl transition-all duration-200 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="px-4">
          <div className="border-border-subtle flex items-center justify-between border-b p-4">
            <span className="text-text-primary font-mono text-xl font-medium">
              Menu
            </span>

            <button
              onClick={closeMenu}
              className="text-text-muted hover:bg-surface-raised rounded-full p-2 transition"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <ul className="flex flex-col gap-2 p-6">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={(e) => {
                  handleSectionLinkClick(e, link.id);
                  closeMenu();
                }}
                className={`block w-full rounded-xl px-4 py-3 text-base transition-colors ${
                  activeKey === link.id
                    ? "bg-surface-raised text-text-primary"
                    : "text-text-muted hover:bg-surface-raised hover:text-text-primary"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            {pathname === "/blogs" ? (
              <span className="bg-surface-raised text-text-primary block w-full rounded-xl px-4 py-3 text-base">
                Blogs
              </span>
            ) : (
              <ProgressLink
                href="/blogs"
                onClick={closeMenu}
                className="text-text-muted hover:bg-surface-raised hover:text-text-primary block w-full rounded-xl px-4 py-3 text-base transition-colors"
              >
                Blogs
              </ProgressLink>
            )}
          </li>
        </ul>

        {/* Mobile GitHub Link (In mobile sidebar) */}
        <div className="absolute right-6 bottom-6 left-6">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="bg-text-primary text-surface flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 transition-opacity hover:opacity-90"
          >
            GitHub Portfolio
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />
    </>
  );
};

export default NavBar;
