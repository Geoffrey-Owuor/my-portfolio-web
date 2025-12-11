import { DM_Sans, Roboto, Roboto_Mono } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/components/Theme/Providers";
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
        className={`${roboto.variable} ${robotoMono.variable} ${dmsans.variable} font-dmsans app-background flex min-h-screen flex-col antialiased`}
      >
        <Providers>
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
