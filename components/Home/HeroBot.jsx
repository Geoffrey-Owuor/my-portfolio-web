"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

// How far the cursor has to be before the bot is looking "all the way".
const REACH = 260;
const SPRING = { stiffness: 140, damping: 16, mass: 0.6 };

const random = (min, max) => min + Math.random() * (max - min);

/**
 * The hero's mascot: a small code-bot resting its chin on the editor card's
 * top edge, paws on the border. Its eyes follow the cursor and its head
 * leans after them (the paws stay put); it blinks now and then, and smiles
 * while the card is hovered or focused (the `group/bot` wrapper in Hero).
 *
 * With no hovering pointer (touch) it glances around on its own and looks
 * toward taps. Reduced motion: drawn at rest, eyes centred, nothing moves.
 *
 * Everything runs on motion values, so tracking never re-renders React.
 */
const HeroBot = () => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);

  // Where it's looking, -1…1 on each axis, smoothed by a spring.
  const lookX = useMotionValue(0);
  const lookY = useMotionValue(0);
  const x = useSpring(lookX, SPRING);
  const y = useSpring(lookY, SPRING);

  const eyeX = useTransform(x, (v) => v * 4);
  const eyeY = useTransform(y, (v) => v * 3);
  const headX = useTransform(x, (v) => v * 3);
  const headY = useTransform(y, (v) => v * 1.5);
  const headRotate = useTransform(x, (v) => v * 7);
  const blink = useMotionValue(1);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timers = new Set();
    const later = (fn, ms) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
      return id;
    };

    const lookAt = (clientX, clientY) => {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const dx = clientX - (box.left + box.width / 2);
      const dy = clientY - (box.top + box.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist / REACH, 1);
      lookX.set((dx / dist) * reach);
      lookY.set((dy / dist) * reach);
    };
    const lookAhead = () => {
      lookX.set(0);
      lookY.set(0);
    };

    // Blink every few seconds, sometimes twice.
    const scheduleBlink = () =>
      later(
        () => {
          const twice = Math.random() < 0.2;
          animate(blink, twice ? [1, 0.1, 1, 0.1, 1] : [1, 0.1, 1], {
            duration: twice ? 0.4 : 0.18,
          });
          scheduleBlink();
        },
        random(2800, 6000),
      );
    scheduleBlink();

    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const cleanups = [];

    if (hoverQuery.matches) {
      let frame = 0;
      let last = null;
      const onMove = (e) => {
        last = e;
        if (!frame)
          frame = requestAnimationFrame(() => {
            frame = 0;
            lookAt(last.clientX, last.clientY);
          });
      };
      // The pointer left the window: look back ahead.
      const onOut = (e) => {
        if (!e.relatedTarget) lookAhead();
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerout", onOut);
      cleanups.push(() => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerout", onOut);
      });
    } else {
      // Touch: glance somewhere every few seconds, and look toward taps.
      let idle;
      const scheduleGlance = (delay) => {
        clearTimeout(idle);
        timers.delete(idle);
        idle = later(() => {
          lookX.set(random(-1, 1));
          lookY.set(random(-0.6, 0.8));
          idle = later(
            () => {
              lookAhead();
              scheduleGlance(random(3500, 6500));
            },
            random(900, 1600),
          );
        }, delay);
      };
      const onTap = (e) => {
        lookAt(e.clientX, e.clientY);
        clearTimeout(idle);
        timers.delete(idle);
        idle = later(() => {
          lookAhead();
          scheduleGlance(random(3500, 6500));
        }, 1600);
      };
      scheduleGlance(2500);
      window.addEventListener("pointerdown", onTap, { passive: true });
      cleanups.push(() => window.removeEventListener("pointerdown", onTap));
    }

    return () => {
      timers.forEach(clearTimeout);
      cleanups.forEach((fn) => fn());
      lookAhead();
      blink.set(1);
    };
  }, [prefersReducedMotion, lookX, lookY, blink]);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 72 64"
      className="motion-safe:animate-hero-peek z-raised absolute bottom-[calc(100%-8px)] left-1/2 aspect-[9/8] w-20 -translate-x-1/2 overflow-visible [--hero-delay:900ms]"
    >
      <motion.g
        style={{
          x: headX,
          y: headY,
          rotate: headRotate,
          originX: 0.5,
          originY: 1,
        }}
      >
        {/* Antenna */}
        <line
          x1="36"
          y1="5"
          x2="36"
          y2="13"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-accent"
        />
        <circle
          cx="36"
          cy="4"
          r="3.5"
          className="fill-bot-eye [filter:drop-shadow(0_0_3px_var(--color-bot-eye))] motion-safe:animate-pulse"
        />

        {/* Ears */}
        <rect
          x="1"
          y="27"
          width="7"
          height="14"
          rx="3.5"
          className="fill-accent"
        />
        <rect
          x="64"
          y="27"
          width="7"
          height="14"
          rx="3.5"
          className="fill-accent"
        />

        {/* Head and screen */}
        <rect
          x="6"
          y="12"
          width="60"
          height="45"
          rx="15"
          className="fill-accent"
        />
        <rect
          x="12"
          y="15"
          width="22"
          height="3"
          rx="1.5"
          className="fill-white/25"
        />
        <rect
          x="13"
          y="20"
          width="46"
          height="30"
          rx="10"
          className="fill-bot-screen"
        />

        {/* Eyes: the pair follows the look, each blinks on its own centre */}
        <motion.g
          style={{ x: eyeX, y: eyeY }}
          className="fill-bot-eye [filter:drop-shadow(0_0_2.5px_var(--color-bot-eye))]"
        >
          <motion.rect
            x="24"
            y="28"
            width="6"
            height="9"
            rx="3"
            style={{ scaleY: blink, originY: 0.5 }}
          />
          <motion.rect
            x="42"
            y="28"
            width="6"
            height="9"
            rx="3"
            style={{ scaleY: blink, originY: 0.5 }}
          />
        </motion.g>

        {/* Mouth: level at rest, a smile while the card is hovered */}
        <g
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-bot-eye"
        >
          <path
            d="M32 43h8"
            className="transition-opacity duration-200 group-focus-within/bot:opacity-0 group-hover/bot:opacity-0"
          />
          <path
            d="M30.5 41.5q5.5 4.5 11 0"
            className="opacity-0 transition-opacity duration-200 group-focus-within/bot:opacity-100 group-hover/bot:opacity-100"
          />
        </g>
      </motion.g>

      {/* Paws on the card's edge — outside the head group, so they stay put */}
      <ellipse
        cx="17"
        cy="57"
        rx="6.5"
        ry="4"
        className="fill-accent stroke-surface-raised"
        strokeWidth="1.5"
      />
      <ellipse
        cx="55"
        cy="57"
        rx="6.5"
        ry="4"
        className="fill-accent stroke-surface-raised"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default HeroBot;
