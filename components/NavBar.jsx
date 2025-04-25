"use client";
import { assets } from "@/assets/assets";
import {
  CircleXIcon,
  MenuIcon,
  Monitor,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const NavBar = ({ theme, setTheme }) => {
  const [isScroll, setIsScroll] = useState(false);
  const sideMenuRef = useRef();
  const openMenu = () => {
    sideMenuRef.current.style.transform = "translateX(-16rem)";
  };
  const closeMenu = () => {
    sideMenuRef.current.style.transform = "translateX(16rem)";
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (scrollY > 50) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    });
  }, []);

  return (
    <>
      <div className="fixed top-0 right-0 -z-10 w-11/12 translate-y-[-65%] dark:hidden">
        <Image
          src={assets.header_bg_color}
          alt="header background"
          className="w-full"
          priority
        />
      </div>

      <nav
        className={`font-roboto fixed z-50 flex w-full items-center justify-between px-5 py-4 lg:px-8 xl:px-[8%] ${isScroll ? "dark:bg-darkTheme bg-white/50 shadow-sm backdrop-blur-lg dark:shadow-white/20" : ""}`}
      >
        <a href="#top">
          <h1 className="font-righteous text-3xl font-extrabold">
            <span className="text-pink-400 dark:text-purple-700">Geo</span>
            <span>ffrey</span>
          </h1>
        </a>
        <ul
          className={`hidden items-center gap-6 rounded-full border-2 border-transparent px-12 py-3 md:flex lg:gap-8 ${isScroll ? "" : "bg-white/50 shadow-sm dark:border-white/50 dark:bg-transparent"}`}
        >
          <li>
            <a
              href="#top"
              className="hover:text-gray-600 dark:hover:text-gray-300"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="hover:text-gray-600 dark:hover:text-gray-300"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#services"
              className="hover:text-gray-600 dark:hover:text-gray-300"
            >
              Services
            </a>
          </li>
          <li>
            <a
              href="#work"
              className="hover:text-gray-600 dark:hover:text-gray-300"
            >
              Work
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="hover:text-gray-600 dark:hover:text-gray-300"
            >
              Contact
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-4">
          {/* Theme Selector as Icons */}
          <div className="dark:bg-menuTheme flex items-center gap-1 rounded-full bg-white/50 p-1 text-sm shadow-sm md:p-2">
            <button
              onClick={() => setTheme("light")}
              className={`cursor-pointer p-1 transition-colors ${theme === "light" ? "text-yellow-500" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
              aria-label="Light mode"
              title="light"
            >
              <SunIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`cursor-pointer p-1 transition-colors ${theme === "system" ? "text-purple-600" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
              aria-label="System preference"
              title="system"
            >
              <Monitor className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`cursor-pointer p-1 transition-colors ${theme === "dark" ? "text-blue-500" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
              aria-label="Dark mode"
              title="dark"
            >
              <MoonIcon className="h-5 w-5" />
            </button>
          </div>

          <button
            className="ml-3 block cursor-pointer md:hidden"
            onClick={openMenu}
          >
            <MenuIcon />
          </button>
        </div>

        {/* ---------Mobile Menu Navigation----------- */}
        <ul
          ref={sideMenuRef}
          className="dark:bg-menuTheme fixed top-0 -right-64 bottom-0 z-50 flex h-screen w-64 flex-col gap-4 bg-rose-50 px-10 py-20 transition duration-500 md:hidden"
        >
          <div className="absolute top-6 right-6" onClick={closeMenu}>
            <CircleXIcon className="h-7 w-7 cursor-pointer" />
          </div>
          <li>
            <a href="#top" onClick={closeMenu}>
              Home
            </a>
          </li>
          <li>
            <a href="#about" onClick={closeMenu}>
              About Me
            </a>
          </li>
          <li>
            <a href="#services" onClick={closeMenu}>
              Services
            </a>
          </li>
          <li>
            <a href="#work" onClick={closeMenu}>
              My Work
            </a>
          </li>
          <li>
            <a href="#contact" onClick={closeMenu}>
              Contact Me
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
