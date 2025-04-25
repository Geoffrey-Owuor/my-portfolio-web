import { GithubIcon, LinkedinIcon, Mail, TwitterIcon } from "lucide-react";

import React from "react";

const Footer = () => {
  return (
    <div className="font-roboto mt-5">
      <div className="text-center">
        <h1 className="font-righteous mb-3 text-3xl font-extrabold">
          <span className="text-pink-400 dark:text-purple-700">Geo</span>
          <span>ffrey</span>
        </h1>
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
            <a target="_blank" href="https://github.com/Geoffrey-Owuor">
              {/* <Image
                src={assets.linkedin_l}
                alt="linkedin_logo"
                className="w-6"
              /> */}
              <LinkedinIcon />
            </a>
          </li>
          <li>
            <a target="_blank" href="https://github.com/Geoffrey-Owuor">
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
