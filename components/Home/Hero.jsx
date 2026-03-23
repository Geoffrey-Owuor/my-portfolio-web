"use client";

import { assets } from "@/assets/assets";
import { ArrowRight, DownloadIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import SphereBg from "../Modules/SphereBg";

const Hero = () => {
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeOut" } },
    tap: { scale: 0.95 },
  };

  const iconVariants = {
    rest: { x: 0 },
    hover: { x: 5, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const downloadIconVariants = {
    rest: { y: 0 },
    hover: { y: [0, -5, 0], transition: { duration: 0.6, repeat: Infinity } },
  };

  const titleTags = ["#Engineer", "#Developer", "#Singer😅"];

  return (
    <section
      id="home"
      className="relative mx-1 flex min-h-screen max-w-7xl items-center justify-center overflow-hidden px-4 py-28 md:mx-auto lg:px-8"
    >
      {/* ── Main grid ── */}
      <div className="relative z-10 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
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
            {/* ── Sphere background ── */}
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
            {titleTags.map((tag, index) => (
              <span
                key={index}
                className="font-dm-mono rounded-full bg-blue-100 px-3 py-1.5 text-sm text-nowrap text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
            className="text-3xl font-medium tracking-tight text-gray-900 md:text-5xl dark:text-white"
          >
            Code, Design, & Everything In-Between
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
            className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300"
          >
            I'm Jeff, a Nairobi-based developer with over three years of
            experience in building and occasionally designing exceptional
            digital experiences.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            {/* Contact Me Button */}
            <motion.a
              href="#contact"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="font-dm-mono relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-gray-900 px-6 py-3 text-base font-medium text-gray-900 shadow-md transition-colors hover:bg-gray-100 sm:w-auto dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
            >
              <motion.div
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent"
                whileHover={{
                  translateX: "200%",
                  transition: { duration: 0.6 },
                }}
              />
              <span className="relative">Contact Me</span>
              <motion.div variants={iconVariants} className="relative">
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </motion.a>

            {/* Resume Button */}
            <motion.a
              href="https://drive.google.com/uc?export=download&id=1RNr5qJmUh4JW8W_6LqVmjMiTweHP6Ne8"
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="font-dm-mono relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gray-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-gray-700 sm:w-auto dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              <motion.div
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent"
                whileHover={{
                  translateX: "200%",
                  transition: { duration: 0.6 },
                }}
              />
              <span className="relative">My Resume</span>
              <motion.div variants={downloadIconVariants} className="relative">
                <DownloadIcon className="h-5 w-5" />
              </motion.div>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
