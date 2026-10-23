"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { project_images } from "@/assets/assets";

// How far (px) the screenshot drifts against the pointer while hovered.
const DRIFT = 10;

/**
 * Bleed-to-edge preview at the top of a project card. On hover the
 * screenshot zooms slightly and drifts opposite the pointer, so it reads as
 * a window onto a larger page. Projects without a screenshot get a quiet
 * placeholder so the grid's card heights stay even.
 */
const ProjectThumb = ({ projectId, name }) => {
  const prefersReducedMotion = useReducedMotion();
  const image = project_images.find((entry) => entry.id === projectId)?.image;

  // Pointer position across the frame, -0.5 … 0.5 on each axis.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 180, damping: 22, mass: 0.4 };
  const x = useSpring(useTransform(px, [-0.5, 0.5], [DRIFT, -DRIFT]), spring);
  const y = useSpring(useTransform(py, [-0.5, 0.5], [DRIFT, -DRIFT]), spring);

  const handlePointerMove = (e) => {
    if (prefersReducedMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handlePointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="border-border-subtle bg-surface-raised relative -mx-6 -mt-6 mb-5 aspect-[16/9] overflow-hidden border-b"
    >
      {image ? (
        // Drift (inline transform, from framer) and hover zoom (CSS) live on
        // separate elements so neither overwrites the other's transform.
        <motion.div
          style={prefersReducedMotion ? undefined : { x, y }}
          className="absolute -inset-3"
        >
          <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <Image
              src={image}
              alt={`${name} preview`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="object-cover object-top"
            />
          </div>
        </motion.div>
      ) : (
        <div className="text-text-muted absolute inset-0 flex items-center justify-center bg-[radial-gradient(var(--border-subtle)_1px,transparent_1px)] [background-size:14px_14px] font-mono text-xs">
          <span className="bg-surface-raised rounded px-2 py-1">
            ~/projects/{projectId}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProjectThumb;
