import { socials } from "@/assets/assets";
import { Brain, Heart } from "lucide-react";
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
      className="custom-content:px-9 mx-auto w-full max-w-7xl px-4 py-6"
    >
      {/* Mail to me */}
      <div className="mx-auto flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="font-roboto-mono text-sm font-semibold text-gray-600 transition-colors hover:text-gray-500 dark:text-gray-400">
          <a
            href="mailto:geoffreyowuor22@gmail.com"
            className="hover:underline"
          >
            #letsCodeSomething
          </a>
        </div>

        {/* Copyright Notice */}
        <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
          <span>
            &copy; {currentYear} <span className="font-semibold">Jeff</span>
          </span>

          {/* Separator (Hidden on mobile, visible on desktop) */}
          <span className="hidden text-gray-400 sm:inline-block dark:text-gray-700">
            •
          </span>

          {/* Magic Text Section */}
          <span className="animate-magic bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-bold text-transparent">
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
    </footer>
  );
};

export default Footer;
