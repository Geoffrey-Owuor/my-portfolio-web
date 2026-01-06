"use client";
import React, { useState } from "react";
import ClientPortal from "../Modules/ClientPortal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Italic,
  List,
  Heading1,
  Link as LinkIcon,
  Quote,
  Eye,
  X,
  Maximize2,
  Heading2,
  Heading3,
  ListOrdered,
  Heading4,
} from "lucide-react";

// --- 1. THE PORTAL PREVIEW MODAL ---
const PreviewModal = ({ isOpen, onClose, content }) => {
  <ClientPortal>
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="custom-blur absolute inset-0 bg-black/50 dark:bg-black/60"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-slate-950"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                <Eye className="h-5 w-5 text-gray-500" />
                Post Preview
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {/* 'prose' class comes from @tailwindcss/typography */}
              <article className="prose prose-lg dark:prose-invert prose-img:rounded-xl prose-headings:font-bold prose-a:text-blue-600 max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || "*Nothing to preview yet...*"}
                </ReactMarkdown>
              </article>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </ClientPortal>;
};

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
    <>
      <div className="group w-full rounded-xl border border-gray-300 shadow-sm transition-all focus:outline-none dark:border-gray-700">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 rounded-t-xl border-b border-gray-200 bg-gray-50/50 p-2 dark:border-gray-700 dark:bg-gray-900/50">
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
          <div className="grow" /> {/* Spacer */}
          {/* Preview Trigger Button */}
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Maximize2 size={14} />
            Preview
          </button>
        </div>

        {/* Text Area */}
        <textarea
          id="markdown-textarea"
          name="content"
          value={value}
          onChange={onChange}
          rows={16}
          className="w-full resize-y bg-transparent p-4 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
          placeholder="Start writing your masterpiece... (Markdown supported)"
        />
      </div>

      {/* Render the Portal Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        content={value}
      />
    </>
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
