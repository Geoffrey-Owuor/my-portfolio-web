"use client";

import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
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
const globeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, delay: 0.2 } },
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
 * From lg up the copy takes a 42rem column and the globe fills the rest of
 * the measure. The globe's size is set by the hero's height, so on a narrow
 * desktop the container edge crops it and wider screens reveal more, until
 * it is whole and centred in its column. It never leaves the page measure.
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
    <section id="home" className="container-page pb-section pt-10 md:pt-14">
      <motion.div
        variants={prefersReducedMotion ? undefined : columnVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="lg:grid lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] lg:gap-10">
          <motion.div
            variants={prefersReducedMotion ? undefined : columnVariants}
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
                <p className="text-text-primary font-semibold">
                  Geoffrey Owuor
                </p>
                <p className="text-text-muted text-sm">
                  Full-stack developer · Nairobi, Kenya
                </p>
              </div>
            </motion.div>

            <motion.h1
              variants={prefersReducedMotion ? undefined : lineVariants}
              className="text-text-primary text-display mt-6 font-semibold text-balance"
            >
              I build production-ready web apps, from database schema to
              polished UI.
            </motion.h1>

            <motion.p
              variants={prefersReducedMotion ? undefined : lineVariants}
              className="text-text-muted mt-5 max-w-2xl text-base leading-relaxed md:text-lg"
            >
              I work across the whole stack - APIs, databases, interfaces and
              deploys, shipping complete products rather than fragments. A
              researcher, developer and builder at heart.
            </motion.p>

            <motion.div
              variants={prefersReducedMotion ? undefined : lineVariants}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/#projects"
                onClick={(e) => scrollToSection(e, "projects")}
                className="bg-text-primary text-surface rounded-control inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                See projects
                <ArrowDown className="h-4 w-4" />
              </Link>
              <Link
                href="/#contact"
                onClick={(e) => scrollToSection(e, "contact")}
                className="border-border-subtle text-text-primary hover:border-accent hover:text-accent rounded-control inline-flex items-center border px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                Get in touch
              </Link>
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
          </motion.div>

          {/* Stretches to the copy's height; overflow-hidden is the crop. */}
          <motion.div
            aria-hidden="true"
            variants={prefersReducedMotion ? undefined : globeVariants}
            className="relative hidden overflow-hidden lg:block"
          >
            <SphereBg
              className="absolute inset-0 h-full w-full"
              dotCount={700}
              anchor="start"
            />
          </motion.div>
        </div>

        {/* Closing rule: the core stack, and where to find everything else */}
        <motion.div
          variants={prefersReducedMotion ? undefined : lineVariants}
          className="border-border-subtle mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t pt-5 font-mono text-xs"
        >
          <p className="text-text-muted">
            <span className="text-accent">stack:</span> {STACK.join(" · ")}
          </p>
          <p className="text-text-muted hidden lg:block">
            Press{" "}
            <kbd className="border-border-subtle text-text-primary rounded-chip border px-1.5 py-0.5">
              {shortcutLabel}
            </kbd>{" "}
            to search projects, posts and more
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
