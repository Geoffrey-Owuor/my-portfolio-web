"use client";

import { useEffect, useState } from "react";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Services from "@/components/Services";
import Work from "@/components/Work";

export default function Home() {
  const [theme, setTheme] = useState(null); // null means "theme not loaded yet"

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "system";
    setTheme(storedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (selectedTheme) => {
      if (selectedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else if (selectedTheme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        // system
        if (mediaQuery.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    applyTheme(storedTheme);

    const handleSystemThemeChange = () => {
      if (localStorage.getItem("theme") === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  useEffect(() => {
    if (theme === null) return; // Don't apply theme if not loaded
    localStorage.setItem("theme", theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (mediaQuery.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  if (theme === null) {
    // Prevent hydration mismatch by not rendering until theme is loaded
    return null;
  }

  return (
    <>
      <NavBar theme={theme} setTheme={setTheme} />
      <Header />
      <About />
      <Services />
      <Work />
      <Contact />
      <Footer />
    </>
  );
}
