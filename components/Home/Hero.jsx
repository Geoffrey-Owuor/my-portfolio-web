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

// One orchestrated entrance on load: the portrait settles first, then the
// copy column follows line by line.
const columnVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
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

/** `status` is a streamed server slot (see app/page.js); may render nothing. */
const Hero = ({ status }) => {
  const heroRef = useRef(null);
  const canvasRef = useScrollContainer();
  const prefersReducedMotion = useReducedMotion();

  // Leaving the hero, the two halves part: the portrait sinks back and the
  // copy lifts away, so the page visibly hands over to the next section.
  const { scrollYProgress } = useScroll({
    container: canvasRef,
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const exitOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const portraitExit = prefersReducedMotion
    ? undefined
    : { scale: portraitScale, y: portraitY, opacity: exitOpacity };
  const copyExit = prefersReducedMotion
    ? undefined
    : { y: copyY, opacity: exitOpacity };

  return (
    <section
      ref={heroRef}
      id="home"
      className="min-h-app relative mx-1 flex max-w-6xl items-center justify-center overflow-hidden px-4 py-16 md:mx-auto"
    >
      {/* ── Main grid ── */}
      <div className="relative z-10 grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* --- Image (Left Side) --- */}
        <motion.div style={portraitExit} className="order-first">
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <div className="relative flex items-center justify-center">
              <SphereBg />
              {/* White buffer ring - some bit of transparency */}
              <div className="absolute h-62 w-62 rounded-full bg-linear-to-br from-gray-200/40 via-gray-300/30 to-gray-400/30 md:h-82 md:w-82 dark:from-gray-800/60 dark:via-gray-900/60 dark:to-gray-950/60" />

              <div>
                <Image
                  src={assets.profile_photo}
                  alt="profile-image"
                  className="relative h-60 w-60 rounded-full object-cover object-[50%_25%] md:h-80 md:w-80"
                  priority
                  width={300}
                  height={300}
                  sizes="(max-width: 768px) 240px, (max-width: 1200px) 320px, 400px"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* --- Text Content (Right Side) --- */}
        <motion.div style={copyExit}>
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center text-center lg:text-left"
          >
            <motion.div
              variants={lineVariants}
              className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
            >
              {status}
              <HeroClock />
            </motion.div>

            <motion.div
              variants={lineVariants}
              className="mb-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
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

            <motion.h1
              variants={lineVariants}
              className="text-text-primary font-mono text-4xl font-medium tracking-tighter md:text-6xl"
            >
              Full-Stack Builder
            </motion.h1>

            <motion.p
              variants={lineVariants}
              className="text-text-muted mt-6 text-lg leading-relaxed"
            >
              I'm Jeff, a full-stack engineer in Nairobi shipping complete,
              production-ready web apps.
            </motion.p>

            <motion.div
              variants={lineVariants}
              className="mt-8 flex justify-center lg:justify-start"
            >
              <HeroTerminal />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
