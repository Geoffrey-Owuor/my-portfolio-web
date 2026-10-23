"use client";

import { useRef } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Microscope, Code2, Hammer, ArrowDown } from "lucide-react";
import SphereBg from "../Modules/SphereBg";
import HeroTerminal from "./HeroTerminal";
import HeroClock from "./HeroClock";
import { useScrollContainer } from "../Layout/AppCanvas";

const titleTags = [
  { label: "Researcher", icon: Microscope },
  { label: "Developer", icon: Code2 },
  { label: "Builder", icon: Hammer },
];

// One orchestrated entrance on load: the copy column steps in line by line
// while the portrait settles alongside it.
const columnVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const lineVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Section links in the hero scroll the canvas rather than jumping, matching
// the navbar (AppCanvas deliberately has no CSS scroll-smooth).
const scrollToSection = (e, id) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const Availability = ({ status }) => (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
    {status}
    <HeroClock />
  </div>
);

const Portrait = ({ className, dotCount, sizes }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <SphereBg className="absolute inset-0 h-full w-full" dotCount={dotCount} />
    {/* Buffer ring between photo and halo */}
    <div className="absolute h-[66%] w-[66%] rounded-full bg-linear-to-br from-gray-200/40 via-gray-300/30 to-gray-400/30 dark:from-gray-800/60 dark:via-gray-900/60 dark:to-gray-950/60" />
    <Image
      src={assets.profile_photo}
      alt="Jeff's portrait"
      className="relative h-[62%] w-[62%] rounded-full object-cover object-[50%_25%]"
      priority
      width={300}
      height={300}
      sizes={sizes}
    />
  </div>
);

/**
 * Two-column hero in the same max-w-7xl measure as every section: copy leads
 * (7/12) with explicit calls to action, the portrait and its sphere sit in
 * the remaining 5/12, and the terminal closes the hero at full width.
 *
 * Only desktop fills the canvas height. On mobile the hero is content-height
 * — forcing a full screen around a short stack is what left a dead band at
 * the top — and the portrait shrinks to an avatar beside the status line.
 *
 * `status` is a streamed server slot (see app/page.js); may render nothing.
 */
const Hero = ({ status }) => {
  const heroRef = useRef(null);
  const canvasRef = useScrollContainer();
  const prefersReducedMotion = useReducedMotion();

  // Leaving the hero, the columns part: the copy lifts away while the
  // portrait sinks back, so the page visibly hands over to the next section.
  const { scrollYProgress } = useScroll({
    container: canvasRef,
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.84]);
  const exitOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Scroll-linked values go on outer layers and entrance animations on the
  // inner ones, so the two never write the same property.
  const exit = (values) => (prefersReducedMotion ? undefined : values);

  return (
    <section
      ref={heroRef}
      id="home"
      className="lg:min-h-app mx-auto flex w-full max-w-7xl flex-col justify-center px-5 pt-10 pb-12 md:pt-14 lg:px-4 lg:py-16"
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* --- Copy --- */}
        <motion.div
          style={exit({ y: copyY, opacity: exitOpacity })}
          className="lg:col-span-7"
        >
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Mobile: avatar + availability on one line */}
            <motion.div
              variants={lineVariants}
              className="mb-7 flex items-center gap-4 lg:hidden"
            >
              <Portrait
                className="h-24 w-24 shrink-0"
                dotCount={220}
                sizes="64px"
              />
              <Availability status={status} />
            </motion.div>

            <motion.h1
              variants={lineVariants}
              className="text-text-primary font-mono text-4xl font-medium tracking-tighter sm:text-5xl xl:text-6xl"
            >
              Full-Stack Builder
            </motion.h1>

            <motion.p
              variants={lineVariants}
              className="text-text-muted mt-5 max-w-xl text-lg leading-relaxed md:text-xl"
            >
              I&apos;m Jeff, a full-stack engineer in Nairobi shipping complete,
              production-ready web apps.
            </motion.p>

            <motion.div
              variants={lineVariants}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="/#projects"
                onClick={(e) => scrollToSection(e, "projects")}
                className="bg-text-primary text-surface inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                See projects
                <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href="/#contact"
                onClick={(e) => scrollToSection(e, "contact")}
                className="border-border-subtle text-text-primary hover:border-accent hover:text-accent inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Get in touch
              </a>
            </motion.div>

            <motion.div
              variants={lineVariants}
              className="mt-8 flex flex-wrap items-center gap-2"
            >
              {titleTags.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="bg-accent/10 text-accent flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-sm text-nowrap"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Desktop: availability closes the copy column */}
            <motion.div
              variants={lineVariants}
              className="mt-8 hidden lg:block"
            >
              <Availability status={status} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* --- Portrait (desktop) --- */}
        <motion.div
          style={exit({
            y: portraitY,
            scale: portraitScale,
            opacity: exitOpacity,
          })}
          className="hidden justify-center lg:col-span-5 lg:flex"
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Portrait
              className="h-88 w-88 xl:h-104 xl:w-104"
              dotCount={650}
              sizes="(max-width: 1280px) 220px, 260px"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Interactive commands close the hero at full width, so they fit on a
          single row on desktop. */}
      <motion.div style={exit({ opacity: exitOpacity })} className="mt-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroTerminal />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
