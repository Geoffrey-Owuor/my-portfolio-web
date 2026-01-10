"use client";
import { useState } from "react";
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

// --- 2. THE MAIN EDITOR COMPONENT ---
const CustomMdEditor = ({ value, onChange }) => {
  const [showPreview, setShowPreview] = useState(false);

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

  return (
    <div className="w-full rounded-xl border border-gray-300 shadow-sm transition-all focus:outline-none dark:border-gray-700">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-t-xl border-b border-gray-200 bg-gray-50/50 p-2 dark:border-gray-700 dark:bg-gray-900/50">
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
            <div className="mx-2 h-4 w-px bg-gray-300 dark:bg-gray-600" />
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
          className={`flex items-center gap-2 rounded-lg ${!showPreview ? "bg-gray-950 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200" : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"} px-3 py-1.5 text-xs font-semibold transition-colors`}
        >
          <PenLine size={14} />
          Write
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className={`mr-2 flex items-center gap-2 rounded-lg ${showPreview ? "bg-gray-950 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200" : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"} px-3 py-1.5 text-xs font-semibold transition-colors`}
        >
          <Glasses size={14} />
          Preview
        </button>
      </div>

      {/* Text Area */}
      {!showPreview && (
        <textarea
          id="markdown-textarea"
          name="content"
          value={value}
          onChange={onChange}
          rows={16}
          className="w-full resize-none p-4 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
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
    className="cursor-pointer rounded-md p-1.5 text-gray-700 transition-all hover:bg-gray-200 hover:text-black hover:shadow-sm dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
  >
    {icon}
  </button>
);

export default CustomMdEditor;
