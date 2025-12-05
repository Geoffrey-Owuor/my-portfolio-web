"use client";

import { assets } from "@/assets/assets";
import { ArrowRight, DownloadIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const Hero = () => {
  // Button hover animations
  const buttonVariants = {
    rest: {
      scale: 1,
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  // Icon animation on button hover
  const iconVariants = {
    rest: {
      x: 0,
      rotate: 0,
    },
    hover: {
      x: 5,
      rotate: -15,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Download icon bounce
  const downloadIconVariants = {
    rest: {
      y: 0,
    },
    hover: {
      y: [0, -5, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
      },
    },
  };

  return (
    <section
      id="home"
      className="containerizing mx-1 flex min-h-screen items-center justify-center px-4 pt-24 pb-12 md:mx-auto lg:px-8"
    >
      <div className="custom:grid-cols-2 custom:gap-20 grid grid-cols-1 gap-12">
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
          <div className="relative">
            {/* Outer spinning gradient ring with blur */}
            <div className="absolute inset-0 -m-1 animate-spin rounded-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5 blur-sm" />

            {/* Main spinning gradient ring */}
            <div
              className="absolute inset-0 -m-1 animate-spin rounded-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5"
              style={{ animationDuration: "3s" }}
            />

            {/* Inner white/dark circle to create ring effect */}
            <div className="relative rounded-full bg-white p-2 dark:bg-gray-950">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <Image
                  src={assets.profile_photo}
                  alt="profile-image"
                  className="h-60 w-60 rounded-full object-cover shadow-xl md:h-80 md:w-80 dark:shadow-gray-800/40"
                  priority
                  width={300}
                  height={300}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* --- Text Content (Right Side) --- */}
        <div className="custom:text-left flex flex-col justify-center text-center">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
            className="text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl dark:text-white"
          >
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundImage:
                  "linear-gradient(90deg, currentColor 0%, #3b82f6 25%, #8b5cf6 50%, #ec4899 75%, currentColor 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              Software Engineer
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
            className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300"
          >
            I am a software engineer based in Nairobi with 3 years of experience
            in software development. I specialize in building (and occasionally
            designing) exceptional digital experiences.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
            className="custom:flex-row custom:justify-center mt-8 flex flex-col items-center gap-4 lg:justify-start"
          >
            {/* Contact Me Button */}
            <motion.a
              href="#contact"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-gray-900 px-6 py-3 text-base font-semibold text-gray-900 shadow-md transition-colors hover:bg-gray-100 sm:w-auto dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
            >
              {/* Shimmer effect on hover */}
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
              href="https://drive.google.com/uc?export=download&id=1NiWKktR8oxt-bWLuLs17Wsk62UAGAvYR"
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gray-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-700 sm:w-auto dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              {/* Shimmer effect on hover */}
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
