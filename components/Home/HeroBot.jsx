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

// Within this distance of the cursor (or a tap) it smiles.
const NEAR = 120;
const LOOK_SPRING = { stiffness: 140, damping: 16, mass: 0.6 };

const random = (min, max) => min + Math.random() * (max - min);
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/**
 * The hero's mascot: a small code-bot sitting at the middle of the hatched
 * band that closes the hero (it must be placed inside that band's `relative`
 * row). It stays put; its head turns and tilts and its eyes follow the
 * cursor, it blinks now and then, and it smiles when the cursor comes close.
 * The gaze is scaled to the viewport, so it keeps turning until the cursor
 * reaches the screen's edge.
 *
 * With no hovering pointer (touch) it glances around every few seconds and
 * looks toward taps. Reduced motion: drawn at rest, nothing moves.
 *
 * Everything runs on motion values, so tracking never re-renders React.
 */
const HeroBot = () => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);

  // Where it's looking, -1…1 on each axis, smoothed by a spring.
  const lookX = useMotionValue(0);
  const lookY = useMotionValue(0);
  const x = useSpring(lookX, LOOK_SPRING);
  const y = useSpring(lookY, LOOK_SPRING);

  const near = useMotionValue(0);
  const smile = useSpring(near, { stiffness: 300, damping: 30 });
  const level = useTransform(smile, (v) => 1 - v);

  const eyeX = useTransform(x, (v) => v * 4);
  const eyeY = useTransform(y, (v) => v * 3);
  const headX = useTransform(x, (v) => v * 3);
  const headY = useTransform(y, (v) => v * 1.5);
  // Tilts after its gaze.
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
    const cancel = (id) => {
      clearTimeout(id);
      timers.delete(id);
    };

    const lookAt = (clientX, clientY) => {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      // Each side's reach is the room from the bot to that edge of the
      // viewport, so the cursor at an edge is "all the way" that way. The
      // floor keeps it from snapping when the bot is near an edge itself.
      const reachX = Math.max(dx < 0 ? cx : window.innerWidth - cx, NEAR);
      const reachY = Math.max(dy < 0 ? cy : window.innerHeight - cy, NEAR);
      lookX.set(clamp(dx / reachX, -1, 1));
      lookY.set(clamp(dy / reachY, -1, 1));
      near.set(Math.hypot(dx, dy) < NEAR ? 1 : 0);
    };
    const lookAhead = () => {
      lookX.set(0);
      lookY.set(0);
      near.set(0);
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
      const update = () => {
        frame = 0;
        if (!last) return;
        lookAt(last.clientX, last.clientY);
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      const onMove = (e) => {
        last = e;
        schedule();
      };
      // The page scrolled under a still cursor: the bot moved, so re-aim.
      const onScroll = () => last && schedule();
      // The pointer left the window: look back ahead.
      const onOut = (e) => {
        if (!e.relatedTarget) {
          last = null;
          lookAhead();
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("pointerout", onOut);
      cleanups.push(() => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("pointerout", onOut);
      });
    } else {
      // Touch: every few seconds glance around; taps pull its gaze.
      let idle;
      const scheduleWander = (delay) => {
        cancel(idle);
        idle = later(() => {
          lookX.set(random(-1, 1));
          lookY.set(random(-0.6, 0.8));
          idle = later(
            () => {
              lookAhead();
              scheduleWander(random(4000, 7000));
            },
            random(1200, 2000),
          );
        }, delay);
      };
      const onTap = (e) => {
        lookAt(e.clientX, e.clientY);
        cancel(idle);
        idle = later(() => {
          lookAhead();
          scheduleWander(random(4000, 7000));
        }, 1800);
      };
      scheduleWander(2500);
      window.addEventListener("pointerdown", onTap, { passive: true });
      cleanups.push(() => window.removeEventListener("pointerdown", onTap));
    }

    return () => {
      timers.forEach(clearTimeout);
      cleanups.forEach((fn) => fn());
      lookAhead();
      blink.set(1);
    };
  }, [prefersReducedMotion, lookX, lookY, near, blink]);

  // Centred on the band, paws straddling its top half.
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="z-raised pointer-events-none absolute bottom-[calc(100%-13px)] left-1/2 -ml-10 w-20"
    >
      <svg
        viewBox="0 0 72 64"
        className="motion-safe:animate-hero-peek block aspect-[9/8] w-full overflow-visible [--hero-delay:900ms]"
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

          {/* Mouth: level at rest, a smile when the cursor comes close */}
          <g
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            className="stroke-bot-eye"
          >
            <motion.path d="M32 43h8" style={{ opacity: level }} />
            <motion.path
              d="M30.5 41.5q5.5 4.5 11 0"
              style={{ opacity: smile }}
            />
          </g>
        </motion.g>

        {/* Paws on the band — outside the head group, so they stay put */}
        <ellipse
          cx="17"
          cy="57"
          rx="6.5"
          ry="4"
          className="fill-accent stroke-surface"
          strokeWidth="1.5"
        />
        <ellipse
          cx="55"
          cy="57"
          rx="6.5"
          ry="4"
          className="fill-accent stroke-surface"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

export default HeroBot;
