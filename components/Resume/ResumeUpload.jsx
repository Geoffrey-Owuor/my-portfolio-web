"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import apiClient from "@/lib/AxiosClient";
import { useToast } from "../Modules/Toaster";

const MAX_BYTES = 4 * 1024 * 1024; // matches RESUME_MAX_BYTES on the server

// Signed-in only: picks a PDF and replaces the stored résumé, then refreshes
// the page so the preview shows the new version.
const ResumeUpload = ({ hasResume }) => {
  const inputRef = useRef(null);
  const router = useRouter();
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // let the same file be picked again
    if (!file) return;

    if (file.type && file.type !== "application/pdf") {
      toast.error("Choose a PDF file.", { title: "Not a PDF" });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("The PDF must be 4 MB or smaller.", {
        title: "File too large",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      // The client defaults to JSON, which would make axios serialise the
      // FormData; the multipart type lets the browser add the boundary.
      const { data } = await apiClient.post("/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(data.message, { title: "Résumé updated" });
      router.refresh();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Couldn't upload your résumé";
      toast.error(message, { title: "Upload failed" });
      console.error("Error uploading résumé:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFile}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="border-accent text-accent hover:bg-accent/10 rounded-control inline-flex items-center gap-2 border px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-60"
      >
        <Upload className="h-4 w-4" />
        {isUploading
          ? "Uploading…"
          : hasResume
            ? "Replace résumé"
            : "Upload résumé"}
      </button>
    </>
  );
};

export default ResumeUpload;
