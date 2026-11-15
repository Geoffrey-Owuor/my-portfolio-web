"use client";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import ThemeColor from "./ThemeColor";

export function Providers({ children }) {
  return (
    <ThemeProvider enableSystem defaultTheme="system" disableTransitionOnChange>
      <ThemeColor />
      {/* Under the visitor's reduced-motion setting, framer skips transform
          and layout animations and keeps opacity fades, for every motion
          component in the app. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
