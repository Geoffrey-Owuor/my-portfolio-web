"use client";

import { useEffect, useRef, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import HeroEditor from "./HeroEditor";
import HeroBot from "./HeroBot";
import { RESUME_URL } from "@/utils/links";
import { ProgressLink } from "../Modules/RouteProgress";

const STACK = ["Next.js", "React", "Node.js", "PostgreSQL", "Tailwind CSS"];

// Section links in the hero scroll smoothly rather than jumping, matching
// the navbar (there is deliberately no CSS scroll-smooth).
const scrollToSection = (e, id) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

/**
 * Editorial, text-led intro in the shared page measure: who (avatar +
 * name), what (the display headline), a short bio, calls to
 * action, and a closing rule with the core stack. Content-height on every
 * screen — it never stretches to fill the viewport.
 *
 * From custom-content (1100px) up the copy takes a 42rem column and the
 * editor card fills the rest, ending on the measure's right edge. Below
 * that its column would be too narrow to show the code, so the card stacks
 * under the calls to action instead, left-aligned and capped to the copy's
 * 42rem.
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

  const prefersReducedMotion = useReducedMotion();
  const [isTwoColumn, setIsTwoColumn] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1100px)"); // custom-content
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
    <section id="home" className="container-page pb-section pt-10 md:pt-14">
      <div
        ref={gridRef}
        className="custom-content:grid custom-content:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] custom-content:gap-10"
      >
        <motion.div style={{ y: copyY, opacity: copyOpacity }}>
          <div className="flex items-center gap-4">
            <Image
              src={assets.profile_photo}
              alt="Portrait of Geoffrey Owuor"
              className="ring-border-subtle motion-safe:animate-hero-pop h-20 w-20 rounded-full object-cover object-[50%_25%] ring-1 [--hero-delay:60ms] sm:h-24 sm:w-24"
              priority
              width={192}
              height={192}
              sizes="(min-width: 640px) 96px, 80px"
            />
            <div className="motion-safe:animate-hero-slide [--hero-delay:140ms]">
              <p className="text-text-primary text-lg font-semibold">
                Geoffrey Owuor
              </p>
              <p className="text-text-muted text-sm">
                Full-stack developer · Nairobi, Kenya
              </p>
            </div>
          </div>

          <h1 className="text-text-primary text-display motion-safe:animate-hero-wipe mt-6 font-semibold text-balance [--hero-delay:160ms]">
            I build production-ready web apps, from database schema to polished
            UI.
          </h1>

          <p className="text-text-muted motion-safe:animate-hero-rise mt-5 max-w-2xl text-base leading-relaxed [--hero-delay:340ms] md:text-lg">
            I work across the whole stack - APIs, databases, interfaces and
            deploys, shipping complete products rather than fragments. A
            researcher, developer and builder at heart.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/#projects"
              onClick={(e) => scrollToSection(e, "projects")}
              className="bg-text-primary text-surface rounded-control motion-safe:animate-hero-rise inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-opacity [--hero-delay:440ms] hover:opacity-90"
            >
              See projects
              <ArrowDown className="h-4 w-4" />
            </Link>
            <Link
              href="/#contact"
              onClick={(e) => scrollToSection(e, "contact")}
              className="border-border-subtle text-text-primary hover:border-accent hover:text-accent rounded-control motion-safe:animate-hero-rise inline-flex items-center border px-4 py-2.5 text-sm font-semibold transition-colors [--hero-delay:510ms]"
            >
              Get in touch
            </Link>
            <ProgressLink
              href={RESUME_URL}
              className="text-text-muted hover:text-accent motion-safe:animate-hero-rise inline-flex items-center gap-1 px-2 py-2.5 text-sm font-medium transition-colors [--hero-delay:580ms]"
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
          <div className="motion-safe:animate-hero-card [--hero-delay:260ms]">
            <HeroEditor />
          </div>
        </motion.div>
      </div>

      {/* Closing band: a hatched strip the bot sits on, then the core stack
          and where to find everything else. The band is its own element so
          it can draw across; the top margin leaves the bot room under the
          card. */}
      <div className="relative mt-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-7 font-mono text-xs">
        <span
          aria-hidden="true"
          className="border-border-subtle hatch-lines motion-safe:animate-hero-draw absolute inset-x-0 top-0 h-2.5 origin-left border-y [--hero-delay:620ms]"
        />
        <HeroBot />
        <p className="text-text-muted motion-safe:animate-hero-fade [--hero-delay:800ms]">
          <span className="text-accent">stack:</span> {STACK.join(" · ")}
        </p>
        <p className="text-text-muted motion-safe:animate-hero-fade hidden [--hero-delay:900ms] lg:block">
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
