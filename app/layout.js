import {
  DM_Sans,
  DM_Mono,
  Inter,
  Lora,
  Geist,
  Geist_Mono,
  Merriweather,
  JetBrains_Mono,
  Courier_Prime,
} from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/components/Theme/Providers";
import NetworkStatus from "@/components/Modules/NetworkStatus";
import NavBar from "@/components/Home/NavBar";
import Footer from "@/components/Home/Footer";
import AppCanvas, {
  ScrollContainerProvider,
} from "@/components/Layout/AppCanvas";
import { FONT_STORAGE_KEY, FONT_STORAGE_VERSION } from "@/store/useFontStore";

const geistSans = Geist({
  variable: "--font-geistsans",
  subsets: ["latin"],
});

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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Mono counterparts for the fonts above (see the `--font-mono-active`
// indirection in globals.css) — swapped alongside the reading font so
// `font-mono` always matches whichever family is selected. Geist and DM Sans
// have official mono siblings; Inter, Lora, and Merriweather don't, so they're
// paired with a stylistically-matching mono font instead.
const geistMono = Geist_Mono({
  variable: "--font-geistmono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrainsmono",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courierprime",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Applies the user's saved font preference before hydration to avoid a flash of the wrong font.
// Preferences from an older storage version are ignored (the store migrates them
// to the current default), so the CSS default applies instead.
const fontInitScript = `(function(){try{var raw=localStorage.getItem(${JSON.stringify(
  FONT_STORAGE_KEY,
)});var saved=raw&&JSON.parse(raw);var font=saved&&saved.version===${FONT_STORAGE_VERSION}&&saved.state&&saved.state.font;if(font)document.documentElement.setAttribute("data-font",font);}catch(e){}})();`;

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

// Lets the browser paint its pre-CSS blank canvas in the OS theme instead of
// always white, and pairs with the inline background in <head> below.
export const viewport = {
  colorScheme: "light dark",
};

// Paints the page background before the external stylesheet arrives, so a slow
// (cold-cache) CSS fetch can't flash white in dark mode. Colours mirror
// `.app-background` in globals.css; data-theme (set by next-themes) wins once
// its script runs, the media query covers the moment before.
const criticalBackgroundCss = `html{background:#fff}@media (prefers-color-scheme:dark){html{background:#030712}}html[data-theme=light]{background:#fff}html[data-theme=dark]{background:#030712}`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={` ${geistSans.variable} ${dmMono.variable} ${dmsans.variable} ${inter.variable} ${lora.variable} ${merriweather.variable} ${geistMono.variable} ${jetbrainsMono.variable} ${courierPrime.variable} antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalBackgroundCss }} />
        <meta name="apple-mobile-web-app-title" content="Portfolio" />
        <script dangerouslySetInnerHTML={{ __html: fontInitScript }} />
      </head>
      <body className="app-background">
        <Providers>
          <NetworkStatus />

          {/* Header and mobile drawer stay outside the canvas; everything
              that scrolls lives inside it. The provider wraps both so the
              header can still read the canvas's scroll state. */}
          <ScrollContainerProvider>
            <NavBar />

            <AppCanvas>
              <main className="flex flex-1 flex-col">{children}</main>
              <Footer />
            </AppCanvas>
          </ScrollContainerProvider>
        </Providers>
      </body>
    </html>
  );
}
