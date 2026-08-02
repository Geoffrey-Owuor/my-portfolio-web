"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { tools } from "@/assets/assets";
import { Menu, X, ArrowUpRight, PenLine } from "lucide-react";
import LoadingLine from "../Modules/LoadingLine";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggleCompact from "../Theme/ThemeToggleCompact";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";

const NavBar = () => {
  // State to manage the mobile menu's open/closed status
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoadingLine, setIsLoadingLine] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // derived state to check if we are in the homepage
  const isInHome = pathname === "/";

  const handleNavbarRouting = (route) => {
    setIsLoadingLine(true);
    router.push(route);
  };

  // Function to explicitly close the mobile menu (used for link clicks)
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Ref for the sidebar menu
  const menuRef = useRef(null);

  // Array of navigation links for cleaner code
  const navLinks = [
    { id: "skills", href: "/#skills", label: "Skills" },
    { id: "stack", href: "/#stack", label: "Stack" },
    { id: "projects", href: "/#projects", label: "Projects" },
    { id: "experience", href: "/#experience", label: "Experience" },
    { id: "education", href: "/#education", label: "Education" },
    { id: "contact", href: "/#contact", label: "Contact" },
  ];

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
      {/* Main Navigation Bar */}
      <nav
        className={`adjust-padding fixed top-0 right-0 left-0 z-50 w-full transition-colors duration-300 ease-in-out ${
          isScrolled ? "navbar-blur bg-surface/70" : "app-background"
        }`}
      >
        {/* Centered Content Container */}
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8 2xl:max-w-7xl">
          {/* Left Side - Mobile Menu Toggle + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMenu}
              className="text-text-muted hover:bg-surface-raised rounded-full p-2 transition lg:hidden"
              title="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            {isInHome ? (
              <a
                href="/#home"
                className="font-dm-mono text-text-primary inline-flex items-center text-xl font-medium"
              >
                <span>Jeff</span>
              </a>
            ) : (
              <button
                onClick={() => handleNavbarRouting("/#home")}
                className="font-dm-mono text-text-primary inline-flex cursor-pointer items-center text-xl font-medium"
              >
                <span>Jeff</span>
              </button>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center space-x-5 text-sm lg:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                {isInHome ? (
                  <a
                    href={link.href}
                    className="text-text-primary hover:text-accent flex items-center gap-0.5 transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <button
                    onClick={() => handleNavbarRouting(link.href)}
                    className="text-text-primary hover:text-accent flex cursor-pointer items-center gap-0.5 transition-colors"
                  >
                    {link.label}
                  </button>
                )}
              </li>
            ))}
            <li>
              {pathname === "/blogs" ? (
                <span className="text-text-muted cursor-default">Blogs</span>
              ) : (
                <Link
                  href="/blogs"
                  onClick={() => setIsLoadingLine(true)}
                  className="text-text-primary hover:text-accent transition-colors"
                >
                  Blogs
                </Link>
              )}
            </li>
          </ul>

          {/* Right Side Icons (Theme Toggle + GitHub) */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Theme Toggle Button - Reserve space for it */}
            <div className="border-border-subtle flex h-5 w-10 items-center justify-center border-r pr-6">
              <ThemeToggleCompact />
            </div>

            {/* GitHub Link Mobile */}
            <a
              href="https://github.com/Geoffrey-Owuor"
              title="My Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:bg-surface-raised hover:text-text-primary rounded-full p-2 transition-colors lg:hidden"
            >
              <Image
                src={tools.githubLogo}
                alt="GitHub Logo"
                width={24}
                height={24}
                className="h-6 w-6 dark:invert"
              />
            </a>

            {/* GitHub Link Desktop */}
            <a
              href="https://github.com/Geoffrey-Owuor"
              aria-label="GitHub Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-text-primary text-surface hidden items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-opacity hover:opacity-90 lg:flex"
            >
              <Image
                src={tools.githubLogo}
                alt="GitHub Logo"
                width={24}
                height={24}
                className="h-5 w-5 invert dark:invert-0"
              />
              Portfolio
            </a>
          </div>
        </div>
      </nav>

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
        className={`bg-surface border-border-subtle fixed top-0 bottom-0 left-0 z-80 w-72 transform shadow-2xl transition-all duration-200 ease-in-out lg:hidden dark:border-r ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="px-4">
          <div className="border-border-subtle flex items-center justify-between border-b p-4">
            <span className="font-dm-mono text-text-primary text-xl font-medium">
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
                  onClick={() => setIsMenuOpen(false)}
                  className="text-text-muted hover:bg-surface-raised hover:text-text-primary block w-full rounded-2xl px-4 py-3 text-base transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <button
                  onClick={() => handleSidebarClick(link.href)}
                  className="text-text-muted hover:bg-surface-raised hover:text-text-primary block w-full rounded-2xl px-4 py-3 text-left text-base transition-colors"
                >
                  {link.label}
                </button>
              )}
            </li>
          ))}
          <li>
            {pathname === "/blogs" ? (
              <span className="text-text-muted w-full cursor-default rounded-2xl px-4 py-3 text-base">
                Blogs
              </span>
            ) : (
              <Link
                href="/blogs"
                onClick={handleBlogLinkClick}
                className="text-text-muted hover:bg-surface-raised hover:text-text-primary w-full rounded-2xl px-4 py-3 text-base transition-colors"
              >
                Blogs
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile GitHub Link (In mobile sidebar) */}
        <div className="absolute right-6 bottom-6 left-6">
          <a
            href="https://github.com/Geoffrey-Owuor"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="bg-text-primary text-surface flex items-center justify-center gap-1.5 rounded-full px-4 py-3 transition-opacity hover:opacity-90"
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
