import { GithubIcon, LinkedinIcon, Mail, TwitterIcon } from "lucide-react";

import { assets } from "@/assets/assets";

import Image from "next/image";

const Footer = ({ theme }) => {
  const getLogoImage = () => {
    if (theme === "light") return assets.logo_light;
    if (theme === "dark") return assets.logo_dark;

    // Handle "system" theme using matchMedia
    if (theme === "system") {
      if (typeof window !== "undefined") {
        const isDarkMode = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        return isDarkMode ? assets.logo_dark : assets.logo_light;
      }
    }

    // Default fallback
    return assets.logo_light;
  };
  return (
    <div className="font-roboto mt-5">
      <div>
        <div className="mx-auto flex w-max items-center">
          <Image src={getLogoImage()} alt="Logo" className="w-36" priority />
        </div>
        <div className="mx-auto flex w-max items-center gap-2">
          <Mail />
          geoffreyowuor22@gmail.com
        </div>
      </div>

      <div className="mx-[10%] mt-12 items-center justify-between border-t border-gray-400 py-4 text-center sm:flex">
        <p>&copy; 2025 Geoffrey. All rights reserved.</p>
        <ul className="mt-4 flex items-center justify-center gap-7 sm:mt-0">
          <li>
            <a target="_blank" href="https://github.com/Geoffrey-Owuor">
              {/* <Image src={assets.github_g} alt="github_logo" className="w-6" /> */}
              <GithubIcon />
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.linkedin.com/in/owuor-geoffrey22"
            >
              {/* <Image
                src={assets.linkedin_l}
                alt="linkedin_logo"
                className="w-6"
              /> */}
              <LinkedinIcon />
            </a>
          </li>
          <li>
            <a target="_blank" href="https://x.com/OwuorOkinyi22">
              {/* <Image
                src={assets.x_twitter}
                alt="twitter_logo"
                className="w-6"
              /> */}
              <TwitterIcon />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
