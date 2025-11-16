import { socials } from "@/assets/assets";
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
      className="w-full border-t border-gray-200 px-4 py-6 md:px-6 dark:border-gray-800"
    >
      <div className="mx-auto flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* Copyright Notice */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {currentYear} Jeff. All rights reserved.
        </div>

        <div className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          <a
            href="mailto:geoffreyowuor22@gmail.com"
            className="hover:underline"
          >
            geoffreyowuor22@gmail.com
          </a>
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
