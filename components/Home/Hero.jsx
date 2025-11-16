"use client";

import { assets } from "@/assets/assets";
import { ArrowRight, DownloadIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";

const Hero = () => {
  return (
    <section
      id="home" // ID for the navbar link
      className="flex min-h-screen containerizing w-full items-center justify-center bg-white px-4 pt-24 pb-12 md:px-8 dark:bg-gray-950"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
        {/* --- Image (Left Side) --- */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            type: "spring",
            stiffness: 100,
          }}
          // 'order-first' keeps it on top on mobile
          // On desktop (md:), it's the first child, so it's on the left
          className="order-first flex justify-center"
        >
          <Image
            src={assets.profile_photo}
            alt="profile-image"
            className="h-60 w-60 rounded-full object-cover shadow-xl md:h-80 md:w-80 dark:shadow-gray-800/40"
            priority
            width={300} // Provide explicit width/height
            height={300}
          />
        </motion.div>

        {/* --- Text Content (Right Side) --- */}
        <div className="flex flex-col justify-center text-center md:text-left">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
            className="text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl dark:text-white"
          >
            Software Engineer
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
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
            transition={{ duration: 0.5, delay: 0.6, ease: "easeInOut" }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start"
          >
            {/* Contact Me Button */}
            <a
              href="#contact"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-900 px-6 py-3 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-100 sm:w-auto dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
            >
              Contact Me <ArrowRight className="h-5 w-5" />
            </a>

            {/* Resume Button */}
            <a
              href="https://drive.google.com/uc?export=download&id=1NiWKktR8oxt-bWLuLs17Wsk62UAGAvYR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-700 sm:w-auto dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              My Resume <DownloadIcon className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
