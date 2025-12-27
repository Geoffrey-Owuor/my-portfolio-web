import { DM_Sans, Roboto, Roboto_Mono } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/components/Theme/Providers";
import NetworkStatus from "@/components/Modules/NetworkStatus";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const dmsans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Jeff's Portfolio | Software Engineer",
  description:
    "Welcome to my portfolio showcasing projects, technical skills, tech blogs, experience, and much more",

  openGraph: {
    title: "Jeff's Portfolio | Software Engineer",
    description:
      "Welcome to my portfolio showcasing projects, technical skills, tech blogs, experience, and much more",
    type: "website",
    authors: ["Geoffrey Owuor"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Portfolio" />
      </head>
      <body
        className={`${roboto.variable} ${robotoMono.variable} ${dmsans.variable} font-dmsans app-background antialiased`}
      >
        <Providers>
          {children}
          <NetworkStatus />
        </Providers>
      </body>
    </html>
  );
}
