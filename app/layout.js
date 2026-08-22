import { DM_Sans, DM_Mono } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/components/Theme/Providers";
import NetworkStatus from "@/components/Modules/NetworkStatus";
import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";
import AppCanvas, {
  ScrollContainerProvider,
} from "@/components/Layout/AppCanvas";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const dmsans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://jeff-portfolio-web.vercel.app",
  ),

  title: {
    default: "Jeff's Portfolio | Software Developer",
    template: "%s | Jeff's Portfolio",
  },

  description:
    "Welcome to my portfolio showcasing projects, technical skills, tech blogs, experience, and much more",

  applicationName: "Jeff's Portfolio",

  openGraph: {
    type: "website",
    siteName: "Jeff's Portfolio",
    title: "Jeff's Portfolio | Software Developer",
    description:
      "Welcome to my portfolio showcasing projects, technical skills, tech blogs, experience, and much more",
    url: "/",
    images: [
      {
        url: "/web-app-manifest-512x512.png", // resolved via metadataBase
        width: 512,
        height: 512,
        alt: "Jeff's Portfolio Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Jeff's Portfolio | Software Developer",
    description:
      "Welcome to my portfolio showcasing projects, technical skills, tech blogs, experience, and much more",
    images: ["/web-app-manifest-512x512.png"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  authors: [{ name: "Geoffrey Owuor" }],

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta name="apple-mobile-web-app-title" content="Portfolio" />
      </head>
      <body
        className={` ${dmMono.variable} ${dmsans.variable} font-dmsans app-background antialiased`}
      >
        <Providers>
          <NetworkStatus />

          {/* Header and mobile drawer stay outside the canvas; everything
              that scrolls lives inside it. The provider wraps both so the
              header can still read the canvas's scroll state. */}
          <ScrollContainerProvider>
            <NavBar />

            <AppCanvas>
              <main>{children}</main>
              <Footer />
            </AppCanvas>
          </ScrollContainerProvider>
        </Providers>
      </body>
    </html>
  );
}
