"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { tools } from "@/assets/assets";
import { Menu, X, ArrowUpRight } from "lucide-react";
import LoadingLine from "../Modules/LoadingLine";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggleCompact from "../Theme/ThemeToggleCompact";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";
import { useFocusTrapping } from "@/hooks/useFocusTrapping";

const NavBar = () => {
  // State to manage the mobile menu's open/closed status
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoadingLine, setIsLoadingLine] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
      <nav className="app-background adjust-padding fixed top-0 right-0 left-0 z-50 w-full transition-colors duration-300 ease-in-out">
        {/* Centered Content Container */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          {/* Left Side - Mobile Menu Toggle + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMenu}
              className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
              title="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            {isInHome ? (
              <a
                href="/#home"
                className="font-dm-mono text-xl font-medium text-gray-900 dark:text-white"
              >
                <span>{"<Jeff/>"}</span>
              </a>
            ) : (
              <button
                onClick={() => handleNavbarRouting("/#home")}
                className="font-dm-mono cursor-pointer text-xl font-medium text-gray-900 dark:text-white"
              >
                <span>{"<Jeff/>"}</span>
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
                    className="flex items-center gap-0.5 text-black transition-colors hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                  >
                    {link.label}
                  </a>
                ) : (
                  <button
                    onClick={() => handleNavbarRouting(link.href)}
                    className="flex cursor-pointer items-center gap-0.5 text-black transition-colors hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                  >
                    {link.label}
                  </button>
                )}
              </li>
            ))}
            <li>
              {pathname === "/blogs" ? (
                <span className="flex cursor-default items-center gap-0.5 text-gray-500 dark:text-gray-400">
                  Blogs
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              ) : (
                <Link
                  href="/blogs"
                  onClick={() => setIsLoadingLine(true)}
                  className="flex items-center gap-0.5 text-black transition-colors hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                >
                  Blogs
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </li>
          </ul>

          {/* Right Side Icons (Theme Toggle + GitHub) */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Theme Toggle Button - Reserve space for it */}
            <div className="flex h-5 w-10 items-center justify-center border-r border-gray-400 pr-6 dark:border-gray-700">
              <ThemeToggleCompact />
            </div>

            {/* GitHub Link Mobile */}
            <a
              href="https://github.com/Geoffrey-Owuor"
              title="My Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
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
              className="hidden items-center gap-2 rounded-full bg-gray-950 px-3 py-1.5 text-sm text-white transition-colors hover:bg-gray-900 hover:text-gray-200 lg:flex dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:hover:text-gray-900"
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
        className={`fixed top-0 bottom-0 left-0 z-80 w-72 transform bg-white shadow-2xl transition-all duration-200 ease-in-out lg:hidden dark:border-r dark:border-gray-800 dark:bg-gray-950 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="px-4">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
            <span className="font-dm-mono text-xl font-medium text-gray-900 dark:text-white">
              {"<Menu/>"}
            </span>

            <button
              onClick={closeMenu}
              className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
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
                  className="block w-full rounded-2xl px-4 py-3 text-base text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {link.label}
                </a>
              ) : (
                <button
                  onClick={() => handleSidebarClick(link.href)}
                  className="block w-full rounded-2xl px-4 py-3 text-left text-base text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {link.label}
                </button>
              )}
            </li>
          ))}
          <li>
            {pathname === "/blogs" ? (
              <span className="flex w-full cursor-default items-center gap-2 rounded-2xl px-4 py-3 text-base text-gray-500 dark:text-gray-400">
                Blogs
                <ArrowUpRight className="h-4 w-4" />
              </span>
            ) : (
              <Link
                href="/blogs"
                onClick={handleBlogLinkClick}
                className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-base text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Blogs
                <ArrowUpRight className="h-4 w-4" />
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
            className="flex items-center justify-center gap-1.5 rounded-full bg-gray-950 px-4 py-3 text-white transition-colors hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
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
