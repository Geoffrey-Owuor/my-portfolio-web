"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { tools } from "@/assets/assets";
import { Menu, X, ArrowUpRight } from "lucide-react";
import LoadingLine from "../Modules/LoadingLine";
import { usePathname } from "next/navigation";
import ThemeToggleCompact from "../Theme/ThemeToggleCompact";

const NavBar = () => {
  // State to track if the page has been scrolled
  const [isScrolled, setIsScrolled] = useState(false);
  // State to manage the mobile menu's open/closed status
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoadingLine, setIsLoadingLine] = useState(false);
  const pathname = usePathname();

  // Ref for the mobile menu to detect outside clicks
  const menuRef = useRef(null);

  // Array of navigation links for cleaner code
  const navLinks = [
    { href: "/#skills", label: "Skills" },
    { href: "/#stack", label: "Stack" },
    { href: "/#projects", label: "Projects" },
    { href: "/#experience", label: "Experience" },
    { href: "/#education", label: "Education" },
    { href: "/#contact", label: "Contact" },
  ];

  // UseEffect to reset loading when navigation completes
  useEffect(() => {
    setIsLoadingLine(false);
  }, [pathname]);

  // Effect to handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if user has scrolled more than 50px
      setIsScrolled(window.scrollY > 50);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect to prevent html scroll when menu is open (for screens larger than 640px)
  useEffect(() => {
    if (isMenuOpen && window.innerWidth >= 640) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.documentElement.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to explicitly close the mobile menu (used for link clicks)
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {isLoadingLine && <LoadingLine />}
      {/* Main Navigation Bar */}
      <nav
        className={`fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300 ease-in-out ${
          isScrolled
            ? "custom-blur bg-white/50 shadow-md dark:bg-gray-950/50"
            : ""
        }`}
      >
        {/* Centered Content Container */}
        <div className="containerizing flex items-center justify-between px-4 py-3 lg:py-4">
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
            <a
              href="/#home"
              className="font-roboto-mono text-xl font-semibold text-gray-900 dark:text-white"
            >
              <span>{"<Jeff/>"}</span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center space-x-5 text-sm lg:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center gap-0.5 text-black transition-colors hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                >
                  {link.label}
                </a>
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
              className="hidden items-center gap-2 rounded-[10px] bg-gray-950 px-3 py-1.5 text-sm text-white transition-colors hover:bg-gray-900 hover:text-gray-200 lg:flex dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:hover:text-gray-900"
            >
              <Image
                src={tools.githubLogo}
                alt="GitHub Logo"
                width={24}
                height={24}
                className="h-5 w-5 invert dark:invert-0"
              />
              My portfolio
            </a>
          </div>
        </div>
      </nav>

      {/* Overlay - appears when menu is open */}
      <div
        className={`fixed inset-0 z-80 bg-black/50 transition-all duration-300 lg:hidden dark:bg-black/60 ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer - slides from left to right */}
      <div
        ref={menuRef}
        className={`fixed top-0 bottom-0 left-0 z-80 w-72 transform bg-white shadow-2xl transition-all duration-300 ease-in-out lg:hidden dark:border-r dark:border-gray-800 dark:bg-gray-950 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="px-4">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
            <span className="font-roboto-mono text-xl font-semibold text-gray-900 dark:text-white">
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
              <a
                href={link.href}
                onClick={closeMenu} // Close menu on link click
                className="block w-full rounded-xl px-4 py-3 text-base text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            {pathname === "/blogs" ? (
              <span className="flex w-full cursor-default items-center gap-2 rounded-xl px-4 py-3 text-base text-gray-500 dark:text-gray-400">
                Blogs
                <ArrowUpRight className="h-4 w-4" />
              </span>
            ) : (
              <Link
                href="/blogs"
                onClick={() => setIsLoadingLine(true)}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-base text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
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
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gray-950 px-4 py-3 text-white transition-colors hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            My portfolio
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </>
  );
};

export default NavBar;
