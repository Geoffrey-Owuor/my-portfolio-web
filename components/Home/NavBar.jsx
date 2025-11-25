"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ThemeToggleCompact from "../Theme/ThemeToggleCompact";

const NavBar = () => {
  // State to track if the page has been scrolled
  const [isScrolled, setIsScrolled] = useState(false);
  // State to manage the mobile menu's open/closed status
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Ref for the mobile menu to detect outside clicks
  const menuRef = useRef(null);

  // Array of navigation links for cleaner code
  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#skills", label: "Skills" },
    { href: "#stack", label: "Stack" },
    { href: "#projects", label: "Projects" },
    { href: "#experience", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" },
  ];

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

  // Effect to prevent html scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
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
      {/* Main Navigation Bar */}
      <nav
        className={`fixed top-0 right-0 left-0 z-50 h-18 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-white/70 shadow-md custom-blur dark:bg-gray-950/70"
            : "bg-white dark:bg-gray-950"
        }`}
      >
        {/* Centered Content Container */}
        <div className="mx-auto flex h-full containerizing items-center justify-between px-4">
          {/* Logo */}
          <a
            href="#home"
            className="text-2xl font-semibold font-mono text-gray-900 dark:text-white"
            onClick={closeMenu} // Close menu if logo is clicked on mobile
          >
            <span>{"<Jeff/>"}</span>
          </a>

          {/* Desktop Navigation Links */}
          <ul
            className={`hidden items-center gap-6 lg:flex lg:gap-8 ${isScrolled ? "" : "rounded-full border border-gray-200 px-6 py-3 shadow-md dark:border-none dark:bg-gray-900"}`}
          >
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-semibold text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Side Icons (GitHub + Mobile Toggle) */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <ThemeToggleCompact />

            {/* GitHub Link */}
            <a
              href="https://github.com/Geoffrey-Owuor"
              aria-label="GitHub Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 rounded-[10px] bg-gray-950 px-3 py-1.5 text-white  transition-colors hover:bg-gray-900 hover:text-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:hover:text-gray-900"
            >
              My portfolio
              <ArrowUpRight className="h-4 w-4" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMenu}
              className="rounded-md p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay - appears when menu is open */}
      <div
        className={`fixed inset-0 z-70 bg-white/50 dark:bg-black/50 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer - slides from right to left */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 bottom-0 z-80 w-72 transform bg-white shadow-2xl dark:border-l dark:border-gray-800 transition-transform duration-300 ease-in-out lg:hidden dark:bg-gray-950 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="px-4">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-4">
            <span className="text-xl font-semibold font-mono  text-gray-900 dark:text-white">
              {"<Menu/>"}
            </span>

            <button
              onClick={closeMenu}
              className="rounded-md p-2 text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
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
                className="block w-full rounded-lg px-4 py-3 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile GitHub Link */}
        <div className="absolute bottom-6 left-6 right-6">
          <a
            href="https://github.com/Geoffrey-Owuor"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-gray-950 px-4 py-3 text-white transition-colors hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
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
