"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyText } from "@/utils/copyText";

const LABELS = { idle: "Copy", copied: "Copied", failed: "Copy failed" };

// The only part of a code block that runs in the browser
const CopyCodeButton = ({ text }) => {
  const [state, setState] = useState("idle");
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await copyText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  };

  const Icon = state === "copied" ? Check : Copy;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={state === "copied" ? "Copied" : "Copy code"}
      className="text-text-muted hover:text-text-primary hover:bg-surface focus-visible:ring-accent rounded-control inline-flex shrink-0 cursor-pointer items-center gap-1.5 px-2 py-1 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span aria-live="polite">{LABELS[state]}</span>
    </button>
  );
};

export default CopyCodeButton;
