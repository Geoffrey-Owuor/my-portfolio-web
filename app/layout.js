import { DM_Sans, Roboto, Roboto_Mono } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/components/Theme/Providers";
import NetworkStatus from "@/components/Modules/NetworkStatus";
import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://jeff-portfolio-web.vercel.app",
  ),

  title: {
    default: "Jeff's Portfolio | Software Engineer",
    template: "%s | Jeff's Portfolio",
  },

  description:
    "Welcome to my portfolio showcasing projects, technical skills, tech blogs, experience, and much more",

  applicationName: "Jeff's Portfolio",

  openGraph: {
    type: "website",
    siteName: "Jeff's Portfolio",
    title: "Jeff's Portfolio | Software Engineer",
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
    title: "Jeff's Portfolio | Software Engineer",
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
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Portfolio" />
      </head>
      <body
        className={`${roboto.variable} ${robotoMono.variable} ${dmsans.variable} font-dmsans app-background antialiased`}
      >
        <Providers>
          <NetworkStatus />
          <NavBar />
          <div className="fixed top-16 right-0 bottom-0 left-0 overflow-y-auto scroll-smooth rounded-2xl">
            <div className="flex h-full flex-col">
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
