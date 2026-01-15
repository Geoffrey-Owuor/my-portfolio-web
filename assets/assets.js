import profile_photo from "../public/profile_photo.png";
import aws from "../public/aws.svg";
import azure from "../public/azure.svg";
import docker from "../public/docker.svg";
import figma from "../public/figma.svg";
import git from "../public/git.svg";
import github from "../public/github.svg";
import github1 from "../public/github1.svg";
import javascript from "../public/javascript.svg";
import mongodb from "../public/mongodb.svg";
import mysql from "../public/mysql.svg";
import nextjs from "../public/nextjs.svg";
import postgresql from "../public/postgresql.svg";
import typescript from "../public/typescript.svg";
import python from "../public/python.svg";
import react from "../public/react.svg";
import vercel from "../public/vercel.svg";
import twitter from "../public/twitter.svg";
import instagram from "../public/instagram.svg";
import linkedin from "../public/linkedin.svg";
import facebook from "../public/facebook.svg";
import whatsapp from "../public/whatsapp.svg";
import app_script_image from "../public/project_images/app_script_image.png";
import garbage_collection_image from "../public/project_images/garbage_collection_image.png";
import google_sheet_image from "../public/project_images/google_sheet_image.png";
import staffproductpurchase_image from "../public/project_images/staffproductpurchase_image.png";

export const assets = {
  profile_photo,
};

export const project_images = [
  { id: 4, image: app_script_image },
  { id: 1, image: garbage_collection_image },
  { id: 3, image: staffproductpurchase_image },
  { id: 5, image: google_sheet_image },
];

export const tools = {
  awsLogo: aws,
  azureLogo: azure,
  dockerLogo: docker,
  figmaLogo: figma,
  gitLogo: git,
  githubLogo: github,
  javascriptLogo: javascript,
  mongodbLogo: mongodb,
  mysqlLogo: mysql,
  nextjsLogo: nextjs,
  postgresqlLogo: postgresql,
  typescriptLogo: typescript,
  pythonLogo: python,
  reactLogo: react,
  vercelLogo: vercel,
};

export const shareIcons = {
  twitterLink: {
    link: "twitter link",
    logo: twitter,
  },
  linkedinLink: {
    link: "linkedin link",
    logo: linkedin,
  },
  facebookLink: {
    link: "facebook link",
    logo: facebook,
  },
  whatsappLink: {
    link: "whatsapp link",
    logo: whatsapp,
  },
};

export const socials = {
  twitterLogo: {
    link: "https://x.com/OwuorOkinyi22?t=MJ00GFR3LOn0aZi1zCO6wQ&s=08",
    icon: twitter,
  },
  instagramLogo: {
    link: "https://www.instagram.com/geoffreyowuor22?igsh=MWF4MTF4Y2FubDR1dg==",
    icon: instagram,
  },
  githubLogo: {
    link: "https://github.com/Geoffrey-Owuor",
    icon: github1,
  },
  linkedinLogo: {
    link: "https://www.linkedin.com/in/owuor-geoffrey22",
    icon: linkedin,
  },
};
