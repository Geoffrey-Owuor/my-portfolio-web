import { socials } from "@/assets/assets";
import { Terminal } from "lucide-react";
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
      className="border-border-subtle mx-auto w-full max-w-6xl border-t px-4 py-6 lg:px-8 2xl:max-w-7xl"
    >
      {/* Mail to me */}
      <div className="mx-auto flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="font-dm-mono text-text-muted hover:text-text-primary text-sm font-medium transition-colors">
          <a
            href="mailto:geoffreyowuor22@gmail.com"
            className="hover:underline"
          >
            #letsCodeSomething
          </a>
        </div>

        {/* Copyright Notice */}
        <div className="text-text-muted flex items-center justify-center space-x-2 text-sm">
          <span>
            &copy; <span className="font-dm-mono">{currentYear}</span>{" "}
            <span className="font-dm-mono">Jeff</span>
          </span>

          {/* Dot Separator */}
          <span>•</span>

          {/* Status line */}
          <span className="font-dm-mono text-accent inline-flex items-center gap-1.5 font-medium">
            <Terminal className="h-4 w-4" />
            status: shipping
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
              className="text-text-muted hover:bg-surface-raised hover:text-text-primary rounded-full p-2 transition-colors"
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
        <p
          className="font-dm-mono text-center text-6xl leading-none font-black tracking-wide text-gray-200 select-none md:text-9xl dark:text-gray-900"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, transparent 90%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, transparent 90%)",
          }}
        >
          OWUOR
        </p>
      </div>
    </footer>
  );
};

export default Footer;
