import { assets } from "@/assets/assets";
import { ArrowRight, DownloadIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";

const Header = () => {
  return (
    <div className="mx-auto flex h-screen w-11/12 max-w-3xl flex-col items-center justify-center gap-4 pt-11 text-center">
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        <Image
          src={assets.profile_photo}
          alt="profile-image"
          className="w-35 rounded-full"
          priority
        />
      </motion.div>
      <motion.h3
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-3 flex items-end gap-2 text-xl md:text-2xl"
      >
        Hi! I'm Geoffrey Owuor{" "}
        <Image
          src={assets.wave_icon}
          alt="wave icon"
          className="mb-0.5 w-6"
          priority
        />
      </motion.h3>
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-3xl sm:text-6xl lg:text-[60px]"
      >
        Software Engineer based in Nairobi, Kenya
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mx-auto max-w-2xl"
      >
        I am a software engineer from Nairobi with 3 years of experience in web
        development
      </motion.p>
      <div className="font-roboto mt-4 flex flex-col items-center gap-4 sm:flex-row">
        <motion.a
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          href="#contact"
          className="hover:bg-lightHover flex items-center gap-2 rounded-full border-2 border-gray-500 px-10 py-3 duration-500 dark:border-white/50 dark:bg-transparent dark:hover:bg-transparent dark:hover:text-gray-300"
        >
          Contact Me <ArrowRight />
        </motion.a>
        <motion.a
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          href="../sample_resume.pdf"
          download
          className="flex items-center gap-2 rounded-full border-2 border-black/50 bg-black px-10 py-3 text-white duration-500 hover:bg-gray-800 dark:border-white/50 dark:bg-white dark:text-black dark:hover:bg-gray-300"
        >
          My Resume <DownloadIcon />
        </motion.a>
      </div>
    </div>
  );
};

export default Header;
