"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import { motion } from "framer-motion";
import { Microscope, Code2, Hammer } from "lucide-react";
import SphereBg from "../Modules/SphereBg";
import HeroTerminal from "./HeroTerminal";

const Hero = () => {
  const titleTags = [
    { label: "Researcher", icon: Microscope },
    { label: "Developer", icon: Code2 },
    { label: "Builder", icon: Hammer },
  ];

  return (
    <section
      id="home"
      className="min-h-app relative mx-1 flex max-w-6xl items-center justify-center overflow-hidden px-4 py-16 md:mx-auto"
    >
      {/* ── Main grid ── */}
      <div className="relative z-10 grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* --- Image (Left Side) --- */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            type: "spring",
            stiffness: 80,
          }}
          className="order-first flex justify-center"
        >
          <div className="relative flex items-center justify-center">
            <SphereBg />
            {/* White buffer ring - some bit of transparency */}
            <div className="absolute h-62 w-62 rounded-full bg-linear-to-br from-gray-200/40 via-gray-300/30 to-gray-400/30 md:h-82 md:w-82 dark:from-gray-800/60 dark:via-gray-900/60 dark:to-gray-950/60" />

            <div>
              <Image
                src={assets.profile_photo}
                alt="profile-image"
                className="relative h-60 w-60 rounded-full object-cover md:h-80 md:w-80"
                priority
                width={300}
                height={300}
                sizes="(max-width: 768px) 240px, (max-width: 1200px) 320px, 400px"
              />
            </div>
          </div>
        </motion.div>

        {/* --- Text Content (Right Side) --- */}
        <div className="flex flex-col justify-center text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            {titleTags.map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="font-mono bg-accent/10 text-accent flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-nowrap"
              >
                <Icon className="h-4 w-4" />
                {label}
              </span>
            ))}
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
            className="font-mono text-text-primary text-3xl font-medium tracking-tighter md:text-5xl"
          >
            Full-Stack Builder
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
            className="text-text-muted mt-6 text-lg leading-relaxed"
          >
            I'm Jeff, a full-stack engineer in Nairobi shipping complete,
            production-ready web apps.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
            className="mt-8 flex justify-center lg:justify-start"
          >
            <HeroTerminal />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
