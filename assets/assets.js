import logo2 from "./logo2.png";
import logo3 from "./logo3.png";
import header_bg_color from "./header_bg_color.png";
import profile_photo from "./profile_photo.png";
import wave_icon from "./wave_icon.png";
import about_photo from "./about_photo.png";
import avatar_photo from "./avatar_photo.jpg";
import vscode from "./vscode.png";
import git from "./git.png";
import github from "./github.png";
import mongodb from "./mongodb.png";
import prisma from "./prisma.png";
import figma from "./figma.png";
import linkedin from "./linkedin.png";
import twitter from "./twitter.png";
import github_logo from "./github_logo.png";
import logo3_white from "./logo3_white.png";
import x_twitter from "./x_twitter.svg";
import linkedin_l from "./linkedin_l.svg";
import github_g from "./github_g.svg";
import {
  AppWindow,
  BotMessageSquare,
  Briefcase,
  CodeXmlIcon,
  Component,
  FolderCode,
  GraduationCap,
  PaintbrushVertical,
  ScrollText,
  TabletSmartphone,
  Trash2,
} from "lucide-react";

export const assets = {
  logo2,
  avatar_photo,
  header_bg_color,
  logo3,
  logo3_white,
  profile_photo,
  wave_icon,
  about_photo,
  git,
  github,
  vscode,
  mongodb,
  prisma,
  figma,
  linkedin,
  twitter,
  github_logo,
  linkedin_l,
  x_twitter,
  github_g,
};

export const workData = [
  {
    title: "Saas Inventory",
    description: "web app",
    bgImage: "work3.png",
    icon: FolderCode,
    href: "",
  },
  {
    title: "EnvNeat Garbage",
    description: "web app",
    bgImage: "../work1.png",
    icon: Trash2,
    href: "",
  },

  {
    title: "Form Automation",
    description: "google script",
    bgImage: "../work2.png",
    icon: ScrollText,
    href: "",
  },
  {
    title: "Prompt World",
    description: "web app",
    bgImage: "../work4.png",
    icon: BotMessageSquare,
    href: "",
  },
];

export const serviceData = [
  {
    icon: Component,
    title: "Web Development",
    description:
      "Crafting modern, responsive, and scalable websites using the latest technologies to ensure seamless user experiences and strong performance across all devices.",
    link: "",
  },
  {
    icon: AppWindow,
    title: "UI/UX Design",
    description:
      "Designing intuitive and engaging user interfaces that prioritize usability, accessibility, and visual appeal—ensuring every user interaction feels smooth and purposeful.",
    link: "",
  },
  {
    icon: PaintbrushVertical,
    title: "Graphics Design",
    description:
      "Creating visually striking graphics that communicate ideas clearly and align with your brand’s identity—perfect for digital platforms, print, and marketing campaigns.",
    link: "",
  },
  {
    icon: TabletSmartphone,
    title: "QA Testing",
    description:
      "Conducting thorough testing to identify bugs, improve performance, and ensure your software meets the highest standards of reliability, functionality, and user satisfaction.",
    link: "",
  },
];

export const infoList = [
  {
    icon: CodeXmlIcon,
    title: "Languages",
    description: "HTML, CSS, Javascript, Python",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Bsc. in Computer Science",
  },
  {
    icon: Briefcase,
    title: "Projects",
    description: "Built more than 4 projects",
  },
];

export const toolsData = [
  assets.vscode,
  assets.github,
  assets.git,
  assets.figma,
  assets.mongodb,
  assets.prisma,
];
