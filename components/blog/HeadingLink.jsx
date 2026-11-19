"use client";
import { Link2 } from "lucide-react";
import { useToast } from "../Modules/Toaster";
import { copyText } from "@/utils/copyText";

// The link icon after a section heading: jumps to the section (the browser
// follows the hash as usual) and copies the section's address to share.
const HeadingLink = ({ id }) => {
  const toast = useToast();

  const handleClick = async (e) => {
    // ctrl/cmd-click opens a new tab as usual
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(window.location.href);
    url.hash = id;
    try {
      await copyText(url.toString());
      toast.success("Link to this section copied", { id: "heading-link" });
    } catch {
      // Copying is a bonus; the jump still happens
    }
  };

  return (
    <a
      href={`#${id}`}
      onClick={handleClick}
      aria-label="Copy link to this section"
      title="Copy link to this section"
      className="heading-link not-prose text-text-muted hover:text-accent focus-visible:ring-accent rounded-control ml-2 inline-flex translate-y-[-0.1em] items-center p-1 align-middle opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none [@media(hover:none)]:opacity-60"
    >
      <Link2 className="h-[0.75em] w-[0.75em]" aria-hidden />
    </a>
  );
};

export default HeadingLink;
