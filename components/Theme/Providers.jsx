"use client";
import { ThemeProvider } from "next-themes";
import ThemeColor from "./ThemeColor";

export function Providers({ children }) {
  return (
    <ThemeProvider enableSystem defaultTheme="system" disableTransitionOnChange>
      <ThemeColor />
      {children}
    </ThemeProvider>
  );
}
