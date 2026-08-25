import { socials } from "@/assets/assets";
import { Terminal } from "lucide-react";
import Image from "next/image";
import FontSwitcher from "@/components/Modules/FontSwitcher";

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
      className="mx-auto w-full max-w-7xl px-4 py-6"
    >
      {/* Border div */}
      <div className="mb-6 h-px bg-linear-to-br from-gray-200 via-gray-400 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

      {/* Mail to me */}
      <div className="mx-auto flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-text-muted hover:text-text-primary font-mono text-sm font-medium transition-colors">
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
            &copy; <span className="font-mono">{currentYear}</span>{" "}
            <span className="font-mono">Jeff</span>
          </span>

          {/* Dot Separator */}
          <span>•</span>

          {/* Status line */}
          <span className="text-accent inline-flex items-center gap-1.5 font-mono font-medium">
            <Terminal className="h-4 w-4" />
            status: shipping
          </span>
        </div>

        {/* Social Icons + accessibility font switcher */}
        <div className="flex items-center gap-2">
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

          <span
            className="bg-border-subtle h-6 w-px shrink-0"
            aria-hidden="true"
          />

          <FontSwitcher />
        </div>
      </div>
      {/* Large display name */}
      <div className="mt-6 overflow-hidden">
        <p
          className="text-center font-mono text-6xl leading-none font-black tracking-wide text-gray-200 select-none md:text-9xl dark:text-gray-900"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, transparent 90%)",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 90%)",
          }}
        >
          Owuor
        </p>
      </div>
    </footer>
  );
};

export default Footer;
