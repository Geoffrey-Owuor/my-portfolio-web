import { serviceData } from "@/assets/assets";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

const Services = () => {
  return (
    <motion.div
      id="services"
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
        What I Offer
      </motion.h4>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center text-5xl"
      >
        My Services
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mx-auto mt-5 mb-2 max-w-2xl text-center"
      >
        I help businesses and individuals build smart, reliable, and
        user-friendly digital solutions. With a strong background in full-stack
        development, IT support, and system optimization, I focus on creating
        tools that work seamlessly and solve real problems. Whether you need a
        website, a custom application, or tech support for your systems, I’m
        here to deliver quality work that’s tailored to your goals.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        className="grid-cols-auto my-10 grid gap-6"
      >
        {serviceData.map(({ icon: Icon, title, description, link }, index) => (
          <motion.div
            whileHover={{ scale: 1.05 }}
            key={index}
            className="font-roboto hover:bg-lightHover hover:shadow-customblack dark:hover:shadow-customwhite dark:hover:bg-menuTheme cursor-pointer rounded-xl border-2 border-gray-400 px-8 py-12 duration-500 hover:-translate-y-1"
          >
            <Icon className="h-9 w-9" />
            <h3 className="my-4 text-lg text-gray-700 dark:text-gray-300">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm leading-5 text-gray-600 dark:text-gray-400">
              {description}
            </p>
            <Link
              href={link}
              className="mt-5 flex items-center gap-2 text-sm hover:text-blue-700 dark:hover:text-gray-300"
            >
              Read more <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Services;
