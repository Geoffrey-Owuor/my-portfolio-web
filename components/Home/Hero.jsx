"use client";

import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import HeroClock from "./HeroClock";
import SphereBg from "../Modules/SphereBg";
import { RESUME_URL } from "@/utils/links";

const STACK = ["Next.js", "React", "Node.js", "PostgreSQL", "Tailwind CSS"];

// One orchestrated entrance on load: the column steps in line by line.
const columnVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const lineVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// Section links in the hero scroll smoothly rather than jumping, matching
// the navbar (there is deliberately no CSS scroll-smooth).
const scrollToSection = (e, id) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

/**
 * Editorial, text-led intro in the shared page measure: status line, who
 * (avatar + name), what (the display headline), a short bio, calls to
 * action, and a closing rule with the core stack. Content-height on every
 * screen — it never stretches to fill the viewport.
 *
 * From xl up, a half globe bleeds off the viewport's right edge beside the
 * copy, which is capped at max-w-4xl so the two never overlap.
 *
 * `status` is a streamed server slot (see app/page.js); may render nothing.
 */
const Hero = ({ status }) => {
  const prefersReducedMotion = useReducedMotion();

  // "⌘K" on Apple platforms, "Ctrl K" elsewhere — resolved after mount so
  // the server-rendered label never mismatches (same as the navbar).
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcutLabel("⌘K");
  }, []);

  return (
    <div className="relative overflow-hidden">
      <section id="home" className="container-page pb-section pt-10 md:pt-14">
        <motion.div
          variants={prefersReducedMotion ? undefined : columnVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={prefersReducedMotion ? undefined : lineVariants}
            className="flex flex-wrap items-center gap-x-4 gap-y-1.5"
          >
            {status}
            <HeroClock />
          </motion.div>

          <motion.div
            variants={prefersReducedMotion ? undefined : lineVariants}
            className="mt-8 flex items-center gap-4"
          >
            <Image
              src={assets.profile_photo}
              alt="Jeff's portrait"
              className="ring-border-subtle h-14 w-14 rounded-full object-cover object-[50%_25%] ring-1"
              priority
              width={112}
              height={112}
              sizes="56px"
            />
            <div>
              <p className="text-text-primary font-semibold">Jeff Owuor</p>
              <p className="text-text-muted text-sm">
                Full-stack engineer · Nairobi, Kenya
              </p>
            </div>
          </motion.div>

          <motion.h1
            variants={prefersReducedMotion ? undefined : lineVariants}
            className="text-text-primary text-display mt-6 max-w-4xl font-semibold text-balance"
          >
            I build production-ready web apps, from database schema to polished
            UI.
          </motion.h1>

          <motion.p
            variants={prefersReducedMotion ? undefined : lineVariants}
            className="text-text-muted mt-5 max-w-2xl text-base leading-relaxed md:text-lg"
          >
            I work across the whole stack — APIs, databases, interfaces and
            deploys — and ship complete products rather than fragments. A
            researcher, developer and builder at heart.
          </motion.p>

          <motion.div
            variants={prefersReducedMotion ? undefined : lineVariants}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="/#projects"
              onClick={(e) => scrollToSection(e, "projects")}
              className="bg-text-primary text-surface inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              See projects
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="/#contact"
              onClick={(e) => scrollToSection(e, "contact")}
              className="border-border-subtle text-text-primary hover:border-accent hover:text-accent inline-flex items-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors"
            >
              Get in touch
            </a>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent inline-flex items-center gap-1 px-2 py-2.5 text-sm font-medium transition-colors"
            >
              Résumé
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Closing rule: the core stack, and where to find everything else */}
          <motion.div
            variants={prefersReducedMotion ? undefined : lineVariants}
            className="border-border-subtle mt-12 flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t pt-5 font-mono text-xs"
          >
            <p className="text-text-muted">
              <span className="text-accent">stack:</span> {STACK.join(" · ")}
            </p>
            <p className="text-text-muted hidden lg:block">
              Press{" "}
              <kbd className="border-border-subtle text-text-primary rounded border px-1.5 py-0.5">
                {shortcutLabel}
              </kbd>{" "}
              to search projects, posts and more
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* After the section so it receives the pointer for its tilt; the copy
          column never reaches this far right. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute inset-y-0 right-0 hidden w-[min(26vw,380px)] xl:block"
      >
        <SphereBg className="h-full w-full" dotCount={700} anchor="right" />
      </motion.div>
    </div>
  );
};

export default Hero;
