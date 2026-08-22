"use client";
import { useState, useEffect } from "react";
import PreviewModal from "./PreviewModal";

import {
  Bold,
  Italic,
  List,
  Heading1,
  Link as LinkIcon,
  Quote,
  Heading2,
  Heading3,
  ListOrdered,
  Heading4,
  PenLine,
  Glasses,
} from "lucide-react";
import TooltipUI from "../Theme/TooltipUI";

// --- 2. THE MAIN EDITOR COMPONENT ---
const CustomMdEditor = ({ value, onChange }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showToolTip, setShowToolTip] = useState(false);
  const [suppressHover, setSuppressHover] = useState(false);

  // UseEffect which is a shortcut for toggling preview mode (alt + P)
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for alt + p
      if (event.altKey && event.key === "p") {
        // prevent browsers default action for this particular shortcut
        event.preventDefault();

        setShowPreview((prev) => !prev);
      }
    };

    // Add an avent listener when this component mounts
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showPreview]); //rerun when showPreview changes

  // Detect if current device supports hovering and has a pointer
  const canHover =
    typeof window !== "undefined" &&
    window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  // Helper to insert markdown characters
  const insertText = (before, after) => {
    const textarea = document.getElementById("markdown-textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousText = textarea.value;
    const beforeText = previousText.substring(0, start);
    const selectedText = previousText.substring(start, end);
    const afterText = previousText.substring(end);

    const newText = `${beforeText}${before}${selectedText}${after}${afterText}`;

    // Simulate event for parent handler
    onChange({ target: { name: "content", value: newText } });

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleClick = () => {
    setShowToolTip(false);
    setSuppressHover(true);
    setShowPreview(true);
  };

  const handleMouseEnter = () => {
    if (canHover && !suppressHover) {
      setShowToolTip(true);
    }
  };

  const handleMouseLeave = () => {
    if (canHover) {
      setSuppressHover(false);
      setShowToolTip(false);
    }
  };

  return (
    <div className="border-border-subtle w-full rounded-xl border transition-colors focus:outline-none">
      {/* Toolbar */}
      <div className="border-border-subtle bg-surface-raised flex flex-wrap items-center gap-2 rounded-t-xl border-b p-2">
        {/* Toolbar buttons */}
        {!showPreview && (
          <div className="flex flex-wrap items-center gap-1">
            <ToolbarButton
              icon={<Bold size={18} />}
              onClick={() => insertText("**", "**")}
              label="Bold"
            />
            <ToolbarButton
              icon={<Italic size={18} />}
              onClick={() => insertText("*", "*")}
              label="Italic"
            />
            <ToolbarButton
              icon={<Heading1 size={18} />}
              onClick={() => insertText("# ", "")}
              label="Heading1"
            />
            <ToolbarButton
              icon={<Heading2 size={18} />}
              onClick={() => insertText("## ", "")}
              label="Heading2"
            />
            <ToolbarButton
              icon={<Heading3 size={18} />}
              onClick={() => insertText("### ", "")}
              label="Heading3"
            />
            <ToolbarButton
              icon={<Heading4 size={18} />}
              onClick={() => insertText("#### ", "")}
              label="Heading4"
            />
            <div className="bg-border-subtle mx-2 h-4 w-px" />
            <ToolbarButton
              icon={<List size={18} />}
              onClick={() => insertText("- ", "")}
              label="List"
            />
            <ToolbarButton
              icon={<ListOrdered size={18} />}
              onClick={() => insertText("1. ", "")}
              label="Numbered List"
            />
            <ToolbarButton
              icon={<Quote size={18} />}
              onClick={() => insertText("> ", "")}
              label="Quote"
            />
            <ToolbarButton
              icon={<LinkIcon size={18} />}
              onClick={() => insertText("[", "](url)")}
              label="Link"
            />
          </div>
        )}
        {/* Preview Heading */}
        {showPreview && (
          <div className="px-2 py-[3px]">
            <span className="font-semibold">Blog Preview</span>
          </div>
        )}
        <div className="grow" /> {/* Spacer */}
        {/* Preview Trigger Button and Write Button */}
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          className={`flex items-center gap-2 rounded-lg ${!showPreview ? "bg-text-primary text-surface hover:opacity-90" : "bg-surface-raised text-text-muted hover:text-text-primary"} px-3 py-1.5 text-xs font-semibold transition-colors`}
        >
          <PenLine size={14} />
          Write
        </button>
        <div className="relative">
          <button
            type="button"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className={`mr-2 flex items-center gap-2 rounded-lg ${showPreview ? "bg-text-primary text-surface hover:opacity-90" : "bg-surface-raised text-text-muted hover:text-text-primary"} px-3 py-1.5 text-xs font-semibold transition-colors`}
          >
            <Glasses size={14} />
            Preview
          </button>
          {/* Tooltip div */}
          <TooltipUI
            canHover={canHover}
            shortcut="alt + P"
            showToolTip={showToolTip}
          />
        </div>
      </div>

      {/* Text Area */}
      {!showPreview && (
        <textarea
          id="markdown-textarea"
          name="content"
          value={value}
          onChange={onChange}
          rows={16}
          className="text-text-primary placeholder:text-text-muted w-full resize-none p-4 text-sm leading-relaxed [scrollbar-width:thin] focus:outline-none"
          placeholder="Start writing your masterpiece... (Markdown supported)"
        />
      )}

      {/* Render the preview modal - within the content div */}
      <PreviewModal isOpen={showPreview} content={value} />
    </div>
  );
};

// Helper for Toolbar Buttons
const ToolbarButton = ({ icon, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className="text-text-muted hover:bg-surface hover:text-text-primary cursor-pointer rounded-md p-1.5 transition-colors"
  >
    {icon}
  </button>
);

export default CustomMdEditor;
