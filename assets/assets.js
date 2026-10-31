import profile_photo from "../public/profile2.webp";
import github_avatar from "../public/profile1.webp";
import google_sheet_image from "../public/project_images/google_sheet_image.webp";
import staffproductpurchase_image from "../public/project_images/staffproductpurchase_image.webp";
import helpdesk_image from "../public/project_images/helpdesk_image.webp";
import apps_hub_image from "../public/project_images/apps_hub_image.webp";
import {
  AwsIcon,
  AzureIcon,
  DockerIcon,
  FacebookIcon,
  FigmaIcon,
  GitHubIcon,
  GitIcon,
  InstagramIcon,
  JavaScriptIcon,
  LinkedInIcon,
  MongoDBIcon,
  MySQLIcon,
  NextjsIcon,
  PostgreSQLIcon,
  PythonIcon,
  ReactIcon,
  TypeScriptIcon,
  VercelIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/Icons/BrandIcons";

export const assets = {
  profile_photo,
  github_avatar,
};

export const project_images = [
  { id: 3, image: staffproductpurchase_image },
  { id: 5, image: google_sheet_image },
  { id: 7, image: helpdesk_image },
  { id: 8, image: apps_hub_image },
];

export const tools = {
  awsLogo: AwsIcon,
  azureLogo: AzureIcon,
  dockerLogo: DockerIcon,
  figmaLogo: FigmaIcon,
  gitLogo: GitIcon,
  githubLogo: GitHubIcon,
  javascriptLogo: JavaScriptIcon,
  mongodbLogo: MongoDBIcon,
  mysqlLogo: MySQLIcon,
  nextjsLogo: NextjsIcon,
  postgresqlLogo: PostgreSQLIcon,
  typescriptLogo: TypeScriptIcon,
  pythonLogo: PythonIcon,
  reactLogo: ReactIcon,
  vercelLogo: VercelIcon,
};

export const shareIcons = {
  twitterLink: XIcon,
  linkedinLink: LinkedInIcon,
  facebookLink: FacebookIcon,
  whatsappLink: WhatsAppIcon,
};

export const socials = {
  twitterLogo: {
    link: "https://x.com/OwuorOkinyi22?t=MJ00GFR3LOn0aZi1zCO6wQ&s=08",
    icon: XIcon,
  },
  instagramLogo: {
    link: "https://www.instagram.com/geoffreyowuor22?igsh=MWF4MTF4Y2FubDR1dg==",
    icon: InstagramIcon,
  },
  githubLogo: {
    link: "https://github.com/Geoffrey-Owuor",
    icon: GitHubIcon,
  },
  linkedinLogo: {
    link: "https://www.linkedin.com/in/owuor-geoffrey22",
    icon: LinkedInIcon,
  },
};
