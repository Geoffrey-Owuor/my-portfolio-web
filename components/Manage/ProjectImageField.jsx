"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";
import {
  checkProjectImage,
  PROJECT_IMAGE_TYPES,
} from "@/utils/projectImageRules";

const actionClass =
  "border-border-subtle text-text-primary hover:border-accent hover:text-accent rounded-control inline-flex cursor-pointer items-center gap-2 border px-4 py-2 text-sm font-medium transition-colors";

// Picks, previews or removes a project's image. Nothing uploads until the form
// is saved: `onChange` reports { file, remove } to the form.
const ProjectImageField = ({ currentImage, value, onChange }) => {
  const inputRef = useRef(null);
  const baseId = useId();
  const errorId = `${baseId}-error`;
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!value.file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value.file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value.file]);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // let the same file be picked again
    if (!file) return;

    const problem = checkProjectImage(file);
    setError(problem ?? "");
    if (!problem) onChange({ file, remove: false });
  };

  const shown = previewUrl ?? (value.remove ? null : currentImage);

  return (
    <div>
      <p className="text-text-muted mb-2 text-sm font-semibold">
        Image <span className="font-normal">(optional)</span>
      </p>

      {shown ? (
        <Image
          src={shown}
          alt="Project preview"
          width={1792}
          height={830}
          unoptimized={Boolean(previewUrl)}
          sizes="(max-width: 768px) 100vw, 720px"
          className="border-border-subtle rounded-control mb-3 h-auto max-h-56 w-full border object-contain"
        />
      ) : (
        <p className="border-border-subtle text-text-muted rounded-control mb-3 border border-dashed px-4 py-6 text-center text-sm">
          No image. The project shows its placeholder.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={PROJECT_IMAGE_TYPES.join(",")}
        onChange={handleFile}
        aria-label="Choose a project image"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="sr-only"
        tabIndex={-1}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={actionClass}
        >
          <ImagePlus className="h-4 w-4" />
          {shown ? "Replace image" : "Choose image"}
        </button>
        {shown && (
          <button
            type="button"
            onClick={() => {
              setError("");
              onChange({ file: null, remove: true });
            }}
            className={`${actionClass} hover:border-danger hover:text-danger`}
          >
            <Trash2 className="h-4 w-4" />
            Remove image
          </button>
        )}
      </div>

      <p className="text-text-muted mt-2 text-xs">
        WebP, PNG, JPEG or AVIF, up to 4 MB.
      </p>
      {error && (
        <p id={errorId} className="text-danger mt-1.5 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default ProjectImageField;
