import { assets, infoList, toolsData } from "@/assets/assets";
import Image from "next/image";
import { motion } from "motion/react";

const About = () => {
  return (
    <motion.div
      id="about"
      className="w-full scroll-mt-20 px-[12%] py-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h4
        className="font-roboto mb-2 text-center text-lg text-gray-700 dark:text-gray-400"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Introduction
      </motion.h4>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center text-5xl"
      >
        About Me
      </motion.h2>

      <motion.div
        className="my-20 flex w-full flex-col items-center gap-20 lg:flex-row"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="w-64 max-w-none rounded-3xl sm:w-80"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={assets.about_photo}
            alt="user"
            className="w-full rounded-3xl"
            priority
          />
        </motion.div>
        <motion.div
          className="flex-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="mb-10 max-w-2xl">
            I am an experienced software engineer with over 3 years of
            professional expertise in the field. Throughout my career, I have
            had the privilege of collaborating with prestigious organizations,
            contributing to their success and growth.
          </p>
          <motion.ul
            className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {infoList.map(({ icon: Icon, title, description }, index) => (
              <motion.li
                whileHover={{ scale: 1.05 }}
                className="hover:bg-lightHover font-roboto hover:shadow-customblack dark:hover:shadow-customwhite dark:hover:bg-menuTheme cursor-pointer rounded-xl border-2 border-gray-500 p-6 duration-500 hover:-translate-y-1 dark:border-white/50"
                key={index}
              >
                <Icon className="mt-3 h-12 w-12" />
                <h3 className="my-4 font-semibold text-gray-700 dark:text-gray-300">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              </motion.li>
            ))}
          </motion.ul>
          <motion.h4
            className="font-roboto my-6 font-semibold text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            Tools I use:
          </motion.h4>
          <motion.ul
            className="flex items-center gap-3 sm:gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            {toolsData.map((tool, index) => (
              <motion.li
                whileHover={{ scale: 1.1 }}
                className="flex aspect-square w-12 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-500 duration-500 hover:-translate-y-1 sm:w-14"
                key={index}
              >
                <Image src={tool} alt="Tool" className="w-5 sm:w-7" />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default About;
