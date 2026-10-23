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
import { Microscope, Code2, Hammer } from "lucide-react";
import SphereBg from "../Modules/SphereBg";
import HeroTerminal from "./HeroTerminal";
import HeroClock from "./HeroClock";
import { useScrollContainer } from "../Layout/AppCanvas";

const titleTags = [
  { label: "Researcher", icon: Microscope },
  { label: "Developer", icon: Code2 },
  { label: "Builder", icon: Hammer },
];

// One orchestrated entrance on load: the drop cap settles first, then the
// paragraph follows line by line.
const columnVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
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
const capVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * The hero is set like the opening paragraph of an essay: the portrait (with
 * its sphere as a halo) is floated in as a drop cap, and the headline and
 * intro wrap around its circular edge via `shape-outside`. The float box is
 * sized to the halo, not the photo, so sphere dots never sit behind text.
 *
 * `status` is a streamed server slot (see app/page.js); may render nothing.
 */
const Hero = ({ status }) => {
  const heroRef = useRef(null);
  const canvasRef = useScrollContainer();
  const prefersReducedMotion = useReducedMotion();

  // Leaving the hero, the paragraph lifts away as one block while the drop
  // cap sinks back into it.
  const { scrollYProgress } = useScroll({
    container: canvasRef,
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const blockY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const blockOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const capScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="min-h-app relative mx-auto flex w-full max-w-4xl items-center px-4 py-16 md:px-6"
    >
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { y: blockY, opacity: blockOpacity }
        }
        className="w-full"
      >
        <motion.div
          variants={columnVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={lineVariants}
            className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {status}
            <HeroClock />
          </motion.div>

          {/* ── The paragraph: drop cap + wrapping copy ── */}
          <div className="flow-root">
            {/* Entrance scale lives on the float, the scroll-linked scale on
                the layer inside it, so the two never fight over `scale`. */}
            <motion.div
              variants={capVariants}
              className="relative float-left mr-4 mb-1 h-32 w-32 [shape-margin:0.5rem] [shape-outside:circle(50%)] sm:h-44 sm:w-44 md:mr-6 md:h-56 md:w-56"
            >
              <motion.div
                style={prefersReducedMotion ? undefined : { scale: capScale }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <SphereBg
                  className="absolute inset-0 h-full w-full"
                  dotCount={380}
                />
                {/* Buffer ring between photo and halo */}
                <div className="absolute h-[66%] w-[66%] rounded-full bg-linear-to-br from-gray-200/40 via-gray-300/30 to-gray-400/30 dark:from-gray-800/60 dark:via-gray-900/60 dark:to-gray-950/60" />
                <Image
                  src={assets.profile_photo}
                  alt="Jeff's portrait"
                  className="relative h-[62%] w-[62%] rounded-full object-cover object-[50%_25%]"
                  priority
                  width={160}
                  height={160}
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 110px, 140px"
                />
              </motion.div>
            </motion.div>

            <motion.h1
              variants={lineVariants}
              className="text-text-primary pt-2 font-mono text-3xl font-medium tracking-tighter sm:text-5xl md:pt-4 md:text-6xl"
            >
              {/* Never break at the hyphen beside the drop cap */}
              <span className="whitespace-nowrap">Full-Stack</span> Builder
            </motion.h1>

            <motion.p
              variants={lineVariants}
              className="text-text-muted mt-4 text-lg leading-relaxed md:text-xl"
            >
              I&apos;m Jeff, a full-stack engineer in Nairobi shipping complete,
              production-ready web apps.
            </motion.p>

            <motion.div
              variants={lineVariants}
              className="mt-5 flex flex-wrap items-center gap-2"
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
          </div>

          {/* Interactive, so it can't wrap — it closes the paragraph at full
              width instead, which keeps its commands on one row. */}
          <motion.div variants={lineVariants} className="mt-10">
            <HeroTerminal />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
