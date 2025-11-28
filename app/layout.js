import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/components/Theme/Providers";
import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Jeff's Portfolio Website",
  description: "My personal portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Portfolio" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white flex flex-col antialiased min-h-screen dark:bg-gray-950`}
      >
        <Providers>
          <NavBar />
          <main className="grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
