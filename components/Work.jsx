import { workData } from "@/assets/assets";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const Work = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      id="work"
      className="w-full scroll-mt-20 px-[12%] py-10"
    >
      <motion.h4
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="font-roboto mb-2 text-center text-lg text-gray-700 dark:text-gray-400"
      >
        My Portfolio
      </motion.h4>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center text-5xl"
      >
        Recent Projects
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mx-auto mt-5 mb-12 max-w-2xl text-center"
      >
        Here are some of the recent projects I’ve been working on—each one a
        reflection of my commitment to clean code, thoughtful design, and
        practical problem-solving. From dynamic web applications to intuitive
        user interfaces, these projects showcase my ability to turn ideas into
        impactful digital solutions.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="grid-cols-auto font-roboto my-10 grid gap-5"
      >
        {workData.map(
          ({ bgImage, title, href, description, icon: Icon }, index) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              key={index}
              className="group relative aspect-square cursor-pointer"
            >
              {/* Background darkening effect */}
              <div
                className="absolute inset-0 z-[-1] rounded-xl bg-cover bg-center bg-no-repeat brightness-100 dark:brightness-50"
                style={{
                  backgroundImage: `url(${bgImage})`,
                }}
              ></div>
              <Link href={href}>
                <div className="dark:bg-menuTheme absolute bottom-5 left-1/2 flex w-10/12 -translate-x-1/2 items-center justify-between rounded-lg border border-black bg-purple-100 px-5 py-3 duration-500 group-hover:bottom-7 dark:border-transparent">
                  <div>
                    <h2 className="text-sm font-semibold">{title}</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {description}
                    </p>
                  </div>
                  <div className="flex aspect-square items-center justify-center rounded-full border border-black p-1 shadow-[2px_2px_0_#000] transition group-hover:bg-gray-200 dark:border-white dark:shadow-[2px_2px_0_#fff] dark:group-hover:bg-transparent">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ),
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        <Link
          href=""
          className="font-roboto hover:bg-lightHover mx-auto my-20 flex w-max items-center justify-center gap-2 rounded-full border-2 border-gray-400 px-10 py-3 text-gray-700 duration-500 dark:text-gray-300 dark:hover:bg-transparent dark:hover:text-gray-400"
        >
          Show More <ArrowRight />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Work;
