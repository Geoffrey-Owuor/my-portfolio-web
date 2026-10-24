"use client";

import { useEffect, useRef } from "react";

// The sphere generation canvas component - Totally AI-Generated
// `className` sizes/positions the canvas; `dotCount` should scale with that
// size, or a small sphere turns into noise.
// `anchor="right"` centres the sphere on the canvas's right edge, so only its
// left hemisphere is drawn — a half globe for a canvas that sits flush
// against the viewport edge (see components/Home/Hero.jsx).
export default function SphereBg({
  className = "absolute inline-flex h-90 w-90 md:h-115 md:w-115 lg:h-130 lg:w-130",
  dotCount = 900,
  anchor = "center",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const isRight = anchor === "right";
    // Reduced motion keeps the globe but stops the idle spin.
    const spin = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 0.0025;
    let animId;
    const rot = { x: 0.3, y: 0, z: 0, targetX: 0.3, targetY: 0 };

    // setTransform rather than scale: scale() compounds on every resize.
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    // Observed on the canvas itself, not the window: it can mount hidden
    // (display: none below a breakpoint) or change size without a window
    // resize, and a stale backing store draws nothing.
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Fibonacci sphere — perfectly even dot distribution
    const DOT_COUNT = dotCount;
    const dots = Array.from({ length: DOT_COUNT }, (_, i) => ({
      phi: Math.acos(1 - (2 * (i + 0.5)) / DOT_COUNT),
      theta: Math.PI * (1 + Math.sqrt(5)) * i,
    }));

    // Sphere centre and radius for the canvas's current size.
    const geometry = (W, H) =>
      isRight
        ? { cx: W, cy: H / 2, radius: Math.min(W * 0.95, H * 0.44) }
        : { cx: W / 2, cy: H / 2, radius: Math.min(W, H) * 0.36 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const { cx, cy, radius } = geometry(rect.width, rect.height);
      const clamp = (v) => Math.max(-1, Math.min(1, v));
      const mx = clamp((e.clientX - rect.left - cx) / radius);
      const my = clamp((e.clientY - rect.top - cy) / radius);
      rot.targetX = 0.3 + my * 0.45;
      rot.targetY = mx * 0.45;
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    function rotatePoint(x, y, z, rx, ry) {
      const y1 = y * Math.cos(rx) - z * Math.sin(rx);
      const z1 = y * Math.sin(rx) + z * Math.cos(rx);
      const x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
      const z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
      return [x2, y1, z2];
    }

    // Colour palette — adjust these stops to match your brand
    const STOPS = [
      [191, 219, 254], // blue-200
      [96, 165, 250], // blue-400
      [29, 78, 216], // blue-700
    ];

    function dotColor(nx, ny, nz, alpha) {
      const t = Math.max(
        0,
        Math.min(1, (nx * 0.5 + ny * 0.3 + nz * 0.4 + 1) / 2),
      );
      const scaled = t * (STOPS.length - 1);
      const i = Math.min(Math.floor(scaled), STOPS.length - 2);
      const u = scaled - i;
      const [r1, g1, b1] = STOPS[i];
      const [r2, g2, b2] = STOPS[i + 1];
      const r = Math.round(r1 + (r2 - r1) * u);
      const g = Math.round(g1 + (g2 - g1) * u);
      const b = Math.round(b1 + (b2 - b1) * u);
      return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
    }

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      // Smooth lerp toward mouse target
      rot.x += (rot.targetX - rot.x) * 0.05;
      rot.y += (rot.targetY - rot.y) * 0.05;
      rot.z += spin; // auto-spin speed

      const { cx, cy, radius } = geometry(W, H);

      const rendered = dots.map(({ phi, theta }) => {
        const sx = Math.sin(phi) * Math.cos(theta);
        const sy = Math.sin(phi) * Math.sin(theta);
        const sz = Math.cos(phi);
        const [rx, ry, rz] = rotatePoint(sx, sy, sz, rot.x, rot.y + rot.z);
        const persp = 2.5 / (2.5 + rz);
        return {
          px: cx + rx * radius * persp,
          py: cy + ry * radius * persp,
          depth: (rz + 1) / 2,
          // Dot size tracks the radius (2.6px at the original ~187px radius)
          // so the sphere keeps its texture when drawn small.
          size: persp * Math.max(0.8, radius * 0.014),
          nx: rx,
          ny: ry,
          nz: rz,
        };
      });

      // Back-to-front so near dots draw on top
      rendered.sort((a, b) => a.depth - b.depth);

      for (const d of rendered) {
        if (d.px - d.size > W) continue; // off the clipped edge
        const alpha = 0.12 + d.depth * 0.88;
        ctx.beginPath();
        ctx.arc(d.px, d.py, d.size, 0, Math.PI * 2);
        ctx.fillStyle = dotColor(d.nx, d.ny, d.nz, alpha);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    // Only spin while the sphere is on screen — 900 projected dots a frame
    // is wasted work once the hero has scrolled away.
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(animId);
      if (entry.isIntersecting) draw();
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
    };
  }, [dotCount, anchor]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
