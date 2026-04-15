import { socials } from "@/assets/assets";
import { Sparkles } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  // Get the current year for the copyright
  const currentYear = new Date().getFullYear();

  // Convert the socials object into an array to map over it
  // e.g., [['twitterLogo', { link: '...', icon: '...' }], ...]
  const socialEntries = Object.entries(socials);

  return (
    <footer
      id="footer"
      // Use a subtle top border to separate it from the content above
      className="mx-auto w-full max-w-6xl border-t border-gray-200 px-4 py-6 lg:px-8 2xl:max-w-7xl dark:border-gray-900"
    >
      {/* Mail to me */}
      <div className="mx-auto flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="font-dm-mono text-sm font-medium text-gray-600 transition-colors hover:text-gray-500 dark:text-gray-400">
          <a
            href="mailto:geoffreyowuor22@gmail.com"
            className="hover:underline"
          >
            #letsCodeSomething
          </a>
        </div>

        {/* Copyright Notice */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>
            &copy; <span className="font-dm-mono">{currentYear}</span>{" "}
            <span className="font-dm-mono">Jeff</span>
          </span>

          {/* Dot Separator */}
          <span className="text-gray-400 dark:text-gray-700">•</span>

          {/* Magic Text Section */}
          <span className="animate-magic font-dm-mono inline-flex items-center gap-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-medium text-transparent">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Make Magic Happen.
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          {socialEntries.map(([key, social]) => (
            <a
              key={key}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow me on ${key.replace("Logo", "")}`} // for accessibility
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <Image
                src={social.icon}
                // Use the key as a fallback alt tag
                alt={`${key} logo`}
                width={24}
                height={24}
                className="h-6 w-6 dark:invert"
              />
            </a>
          ))}
        </div>
      </div>
      {/* Large display name */}
      <div className="mt-6 overflow-hidden">
        <p className="font-dm-mono text-center text-6xl leading-none font-black tracking-wide text-gray-200 select-none md:text-9xl dark:text-gray-900">
          OWUOR
        </p>
      </div>
    </footer>
  );
};

export default Footer;
