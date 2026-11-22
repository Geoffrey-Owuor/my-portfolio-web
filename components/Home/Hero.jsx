"use client";

import { useEffect, useRef, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { scrollToId } from "@/utils/motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import HeroEditor from "./HeroEditor";
import HeroBot from "./HeroBot";
import HeroClocks from "./HeroClocks";
import { RESUME_URL } from "@/utils/links";
import { ProgressLink } from "../Modules/RouteProgress";

const STACK = ["Next.js", "React", "Node.js", "PostgreSQL", "Tailwind CSS"];

// Section links in the hero scroll smoothly rather than jumping, matching
// the navbar (there is deliberately no CSS scroll-smooth).
const scrollToSection = (e, id) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  scrollToId(id);
};

/**
 * Editorial, text-led intro in the shared page measure, in two bands split
 * by a section rule: who (portrait, name, role and local times, see
 * HeroClocks), then what (the display headline), a short bio, calls to
 * action and the editor card, and a closing rule with the core stack.
 * Content-height on every screen — it never stretches to fill the viewport.
 *
 * From custom-content (1200px) up the copy takes up to a 42rem column and the
 * editor card fills the rest, never narrower than 26rem (the copy gives way
 * near the breakpoint), ending on the measure's right edge. Below that its
 * column would be too narrow to show the code, so the card stacks under the
 * calls to action instead, left-aligned and capped to the copy's 42rem.
 *
 * The entrance is CSS (the hero-* animations in globals.css), one motion per
 * element on a shared timeline, so it plays on first paint rather than
 * waiting for hydration.
 *
 * Leaving is tied to scroll, and reverses on the way back: once the hero
 * reaches the top of the viewport the copy drifts up and fades while the
 * card lags behind it. Two-column layout only — stacked, the hero is taller
 * than the screen and would fade content that is still being read.
 */
const Hero = () => {
  // "⌘K" on Apple platforms, "Ctrl K" elsewhere — resolved after mount so
  // the server-rendered label never mismatches (same as the navbar).
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcutLabel("⌘K");
  }, []);

  const prefersReducedMotion = usePrefersReducedMotion();
  const [isTwoColumn, setIsTwoColumn] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 75rem)"); // custom-content
    const update = () => setIsTwoColumn(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // 0 as the grid's top reaches the viewport's, 1 as its bottom leaves —
  // and held at 0 (everything at rest) whenever the effect is off. Gating the
  // progress rather than swapping the style props keeps the motion values
  // bound to the elements from the first render.
  const gridRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start start", "end start"],
  });
  const enabled = useMotionValue(0);
  useEffect(() => {
    enabled.set(isTwoColumn && !prefersReducedMotion ? 1 : 0);
  }, [enabled, isTwoColumn, prefersReducedMotion]);
  const progress = useTransform(() => enabled.get() * scrollYProgress.get());

  const copyY = useTransform(progress, [0, 1], [0, -48]);
  const copyOpacity = useTransform(progress, [0.35, 1], [1, 0.2]);
  const cardY = useTransform(progress, [0, 1], [0, 32]);
  const cardScale = useTransform(progress, [0, 1], [1, 0.95]);
  const cardOpacity = useTransform(progress, [0.35, 1], [1, 0.3]);

  return (
    <section id="home" className="container-page pb-section">
      {/* Who: portrait, name and role, with my local time (and the visitor's
          when it differs) beside them from lg, below them before. */}
      <div className="flex flex-col gap-6 pt-10 pb-8 md:pt-14 md:pb-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          <Image
            src={assets.profile_photo}
            alt="Portrait of Geoffrey Owuor"
            className="ring-border-subtle motion-safe:animate-hero-pop h-24 w-24 shrink-0 rounded-full object-cover ring-1 [--hero-delay:60ms] sm:h-32 sm:w-32"
            priority
            width={256}
            height={256}
            sizes="(min-width: 640px) 128px, 96px"
          />
          <div className="motion-safe:animate-hero-slide min-w-0 [--hero-delay:140ms]">
            <p className="text-text-primary text-xl font-semibold sm:text-2xl">
              Geoffrey Owuor
            </p>
            <p className="text-text-muted mt-0.5 text-sm sm:text-base">
              Full-stack developer
            </p>
          </div>
        </div>
        <HeroClocks />
      </div>

      {/* Same rule as the section titles: to the rails' outer borders, with
          their nodes, from lg; content width before. */}
      <div className="bg-border-rule bleed-rails motion-safe:animate-hero-draw h-px origin-left [--hero-delay:260ms]" />

      <div
        ref={gridRef}
        className="custom-content:grid custom-content:grid-cols-[minmax(0,42rem)_minmax(26rem,1fr)] custom-content:gap-10 pt-10 md:pt-14"
      >
        <motion.div style={{ y: copyY, opacity: copyOpacity }}>
          <h1 className="text-text-primary text-display motion-safe:animate-hero-wipe font-semibold text-balance [--hero-delay:320ms]">
            I build web apps that make everyday work a little easier.
          </h1>

          <p className="text-text-muted motion-safe:animate-hero-rise mt-5 max-w-2xl text-base leading-relaxed [--hero-delay:460ms] md:text-lg">
            I enjoy every part of the job, from designing the database and
            writing the code behind it to shaping what people see and getting it
            live. Most of what I build replaces paperwork and long email threads
            with something simpler. I&apos;m curious by nature and always
            learning.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/#projects"
              onClick={(e) => scrollToSection(e, "projects")}
              className="bg-text-primary text-surface rounded-control motion-safe:animate-hero-rise inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-opacity [--hero-delay:540ms] hover:opacity-90"
            >
              See projects
              <ArrowDown className="h-4 w-4" />
            </Link>
            <Link
              href="/#contact"
              onClick={(e) => scrollToSection(e, "contact")}
              className="border-border-subtle text-text-primary hover:border-accent hover:text-accent rounded-control motion-safe:animate-hero-rise inline-flex items-center border px-4 py-2.5 text-sm font-semibold transition-colors [--hero-delay:610ms]"
            >
              Get in touch
            </Link>
            <ProgressLink
              href={RESUME_URL}
              className="text-text-muted hover:text-accent motion-safe:animate-hero-rise inline-flex items-center gap-1 px-2 py-2.5 text-sm font-medium transition-colors [--hero-delay:680ms]"
            >
              Résumé
              <ArrowRight className="h-4 w-4" />
            </ProgressLink>
          </div>
        </motion.div>

        {/* Beside the copy from custom-content, stacked below it before.
            The scroll transform sits on this wrapper and the entrance on the
            div inside, so the two never fight over one element. */}
        <motion.div
          style={{ y: cardY, scale: cardScale, opacity: cardOpacity }}
          className="custom-content:mt-0 custom-content:max-w-none mt-10 max-w-2xl min-w-0 self-center"
        >
          <div className="motion-safe:animate-hero-card [--hero-delay:380ms]">
            <HeroEditor />
          </div>
        </motion.div>
      </div>

      {/* Closing band: a ruled strip the bot sits on, then the core stack
          and where to find everything else. The band is its own element so
          it can draw across. Below lg it bleeds to the screen's edges (the
          page's overflow-x-hidden wrapper clips the scrollbar gutter's
          overshoot); from lg it spans the page rails' outer borders, and its
          16px height matches their width. The top margin leaves the bot room
          under the card. */}
      <div className="relative mt-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-8.5 font-mono text-xs">
        <span
          aria-hidden="true"
          className="border-border-rule ruler-x rail-nodes-y motion-safe:animate-hero-draw absolute inset-x-[calc(50%-50vw)] top-0 h-4 origin-left border-y [--hero-delay:720ms] lg:inset-x-[calc(var(--rail-inset)*-1)]"
        />
        <HeroBot />
        <p className="text-text-muted motion-safe:animate-hero-fade [--hero-delay:900ms]">
          <span className="text-accent">stack:</span> {STACK.join(" · ")}
        </p>
        <p className="text-text-muted motion-safe:animate-hero-fade hidden [--hero-delay:1000ms] lg:block">
          Press{" "}
          <kbd className="border-border-subtle text-text-primary rounded-chip border px-1.5 py-0.5">
            {shortcutLabel}
          </kbd>{" "}
          to search projects, posts and more
        </p>
      </div>
    </section>
  );
};

export default Hero;
