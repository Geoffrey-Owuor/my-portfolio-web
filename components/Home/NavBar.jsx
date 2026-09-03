"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { tools } from "@/assets/assets";
import { Menu, X, ArrowUpRight } from "lucide-react";
import LoadingLine from "../Modules/LoadingLine";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggleCompact from "../Theme/ThemeToggleCompact";
import FontSwitcher from "../Modules/FontSwitcher";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";
import { useScrollContainer } from "../Layout/AppCanvas";
import { motion } from "framer-motion";

// Section links double as scroll-spy targets — `id` must match the id on the
// corresponding <section>. `blogs` is a route, not a section, so it is matched
// against the pathname instead.
const navLinks = [
  { id: "skills", href: "/#skills", label: "Skills" },
  { id: "stack", href: "/#stack", label: "Stack" },
  { id: "projects", href: "/#projects", label: "Projects" },
  { id: "experience", href: "/#experience", label: "Experience" },
  { id: "education", href: "/#education", label: "Education" },
  { id: "contact", href: "/#contact", label: "Contact" },
];

const GITHUB_URL = "https://github.com/Geoffrey-Owuor";

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

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoadingLine, setIsLoadingLine] = useState(false);

  // Scroll state read off the canvas, not the window — the document no longer
  // scrolls (see components/Layout/AppCanvas.jsx).
  const [activeId, setActiveId] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const canvasRef = useScrollContainer();

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
    const canvas = canvasRef?.current;
    if (!canvas) return;

    let queued = false;

    const measure = () => {
      queued = false;

      if (!isInHome) {
        setActiveId("");
        return;
      }

      // Whichever section straddles the canvas midline is the active one.
      const midline =
        canvas.getBoundingClientRect().top + canvas.clientHeight / 2;
      let current = "";

      for (const link of navLinks) {
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
    canvas.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      canvas.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [canvasRef, isInHome, pathname]);

  const handleNavbarRouting = (route) => {
    setIsLoadingLine(true);
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

  // Wordmark/section links render as plain <a href="/#id"> while on the
  // homepage (for accessibility/middle-click/new-tab), but a left click is
  // intercepted so the jump goes through the same explicit smooth-scroll
  // path as the tabs — native fragment navigation would otherwise scroll
  // instantly now that AppCanvas no longer sets CSS scroll-smooth.
  const handleSectionLinkClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to explicitly close the mobile menu (used for link clicks)
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Ref for the sidebar menu
  const menuRef = useRef(null);

  // UseEffect to reset loading when navigation completes
  useEffect(() => {
    setIsLoadingLine(false);
  }, [pathname]);

  // Run scrollbar hook to hide scrollbar when sidebar is open
  useHideScrollbar(isMenuOpen);

  // Hook to handle Focus Trapping inside the mobile menu
  useFocusTrapping(menuRef, isMenuOpen, closeMenu);

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu and scroll
  const handleSidebarClick = (route) => {
    setIsMenuOpen(false);
    setIsLoadingLine(true);
    router.push(route);
  };

  const handleBlogLinkClick = () => {
    setIsMenuOpen(false);
    setIsLoadingLine(true);
  };

  return (
    <>
      {isLoadingLine && <LoadingLine />}

      {/* ── Desktop: command bar. Sits in the top gutter above the canvas,
          sharing its 0.5rem inset so the two read as two panels of a single
          shell. Deliberately unclipped: the theme toggle hangs its tooltip
          below the bar, so no `overflow-hidden` on this panel. ── */}
      <nav
        aria-label="Main"
        className="bg-surface fixed top-2 right-2 left-2 z-50 mx-auto hidden h-12 max-w-7xl items-center justify-between gap-3 px-2 lg:flex"
      >
        {/* Left cluster */}
        <div className="flex items-center gap-3">
          {/* Wordmark */}
          {isInHome ? (
            <a href="/#home" onClick={(e) => handleSectionLinkClick(e, "home")}>
              <Wordmark />
            </a>
          ) : (
            <button
              onClick={() => handleNavbarRouting("/#home")}
              className="cursor-pointer"
            >
              <Wordmark />
            </button>
          )}

          <span
            className="bg-border-subtle h-6 w-px shrink-0"
            aria-hidden="true"
          />

          {/* Tabs — the sliding pill tracks the section under the canvas midline */}
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
      </nav>

      {/* ── Mobile: flush, full-bleed header. Nothing scrolls beneath it, so
          it is a solid panel rather than a blur. ── */}
      <header className="bg-surface fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between px-3 lg:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMenu}
            className="text-text-muted hover:bg-surface-raised rounded-lg p-2 transition"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>

          {isInHome ? (
            <a href="/#home" onClick={(e) => handleSectionLinkClick(e, "home")}>
              <Wordmark />
            </a>
          ) : (
            <button
              onClick={() => handleNavbarRouting("/#home")}
              className="cursor-pointer"
            >
              <Wordmark />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <div className="text-text-muted hover:bg-surface-raised flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
            <FontSwitcher />
          </div>

          <div className="text-text-muted hover:bg-surface-raised flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
            <ThemeToggleCompact />
          </div>

          <a
            href={GITHUB_URL}
            title="My Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:bg-surface-raised hover:text-text-primary rounded-lg p-2 transition-colors"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center">
              <Image
                src={tools.githubLogo}
                alt="GitHub Logo"
                width={24}
                height={24}
                className="h-6 w-6 dark:invert"
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
              {isInHome ? (
                <a
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
                </a>
              ) : (
                <button
                  onClick={() => handleSidebarClick(link.href)}
                  className="text-text-muted hover:bg-surface-raised hover:text-text-primary block w-full rounded-xl px-4 py-3 text-left text-base transition-colors"
                >
                  {link.label}
                </button>
              )}
            </li>
          ))}
          <li>
            {pathname === "/blogs" ? (
              <span className="bg-surface-raised text-text-primary block w-full rounded-xl px-4 py-3 text-base">
                Blogs
              </span>
            ) : (
              <Link
                href="/blogs"
                onClick={handleBlogLinkClick}
                className="text-text-muted hover:bg-surface-raised hover:text-text-primary block w-full rounded-xl px-4 py-3 text-base transition-colors"
              >
                Blogs
              </Link>
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
    </>
  );
};

export default NavBar;
