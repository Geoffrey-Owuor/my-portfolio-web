"use client";

import { useEffect, useRef } from "react";

// The sphere generation canvas component - Totally AI-Generated
export default function SphereBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let animId;
    const rot = { x: 0.3, y: 0, z: 0, targetX: 0.3, targetY: 0 };

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Fibonacci sphere — perfectly even dot distribution
    const DOT_COUNT = 900;
    const dots = Array.from({ length: DOT_COUNT }, (_, i) => ({
      phi: Math.acos(1 - (2 * (i + 0.5)) / DOT_COUNT),
      theta: Math.PI * (1 + Math.sqrt(5)) * i,
    }));

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const my = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
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
      [147, 197, 253], // blue-300
      [196, 181, 253], // violet-300
      [167, 243, 208], // emerald-300
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
      rot.z += 0.0025; // auto-spin speed

      const cx = W / 2;
      const cy = H / 2;
      const radius = Math.min(W, H) * 0.36;

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
          size: persp * 2.6,
          nx: rx,
          ny: ry,
          nz: rz,
        };
      });

      // Back-to-front so near dots draw on top
      rendered.sort((a, b) => a.depth - b.depth);

      for (const d of rendered) {
        const alpha = 0.12 + d.depth * 0.88;
        ctx.beginPath();
        ctx.arc(d.px, d.py, d.size, 0, Math.PI * 2);
        ctx.fillStyle = dotColor(d.nx, d.ny, d.nz, alpha);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute hidden h-130 w-130 lg:inline-flex"
    />
  );
}
