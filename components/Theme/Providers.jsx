"use client";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <ThemeProvider
      enableSystem={true}
      defaultTheme="system"
      disableTransitionOnChange={true}
    >
      {children}
    </ThemeProvider>
  );
}
