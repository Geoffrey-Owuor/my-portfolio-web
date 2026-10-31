import {
  DM_Sans,
  DM_Mono,
  Inter,
  Lora,
  Geist,
  Geist_Mono,
  JetBrains_Mono,
  Courier_Prime,
  Source_Serif_4,
  Source_Code_Pro,
} from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/components/Theme/Providers";
import NetworkStatus from "@/components/Modules/NetworkStatus";
import { ToastProvider } from "@/components/Modules/Toaster";
import NavBar from "@/components/Home/NavBar";
import { RouteProgressProvider } from "@/components/Modules/RouteProgress";
import Footer from "@/components/Home/Footer";
import {
  FONT_ORDER,
  FONT_STORAGE_KEY,
  FONT_STORAGE_VERSION,
  RENAMED_FONTS,
} from "@/store/useFontStore";

// Each family is exposed as an `--nf-*` variable, which globals.css wraps in
// the matching `--font-*` theme token (with a generic fallback stack). Weights
// are only listed for static fonts; the variable ones cover their full range
// in a single file.
//
// Only the default pairing (Inter + JetBrains Mono) is preloaded. The
// alternates stay declared, so the browser fetches one only once it's in use
// (a saved preference, or the font switcher's previews), instead of every
// page preloading all of them.
const geistSans = Geist({
  variable: "--nf-geistsans",
  subsets: ["latin"],
  preload: false,
});

const dmMono = DM_Mono({
  variable: "--nf-dm-mono",
  subsets: ["latin"],
  preload: false,
  weight: ["400", "500"],
});

const dmsans = DM_Sans({
  variable: "--nf-dmsans",
  subsets: ["latin"],
  preload: false,
});

const inter = Inter({
  variable: "--nf-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--nf-lora",
  subsets: ["latin"],
  preload: false,
});

const sourceSerif = Source_Serif_4({
  variable: "--nf-sourceserif",
  subsets: ["latin"],
  preload: false,
});

// Mono counterparts for the fonts above (see the `--font-mono-active`
// indirection in globals.css) — swapped alongside the reading font so
// `font-mono` always matches whichever family is selected. Geist, DM Sans and
// Source Serif have official mono siblings; Inter and Lora don't, so they're
// paired with a stylistically-matching mono font instead.
const geistMono = Geist_Mono({
  variable: "--nf-geistmono",
  subsets: ["latin"],
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--nf-jetbrainsmono",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--nf-sourcecodepro",
  subsets: ["latin"],
  preload: false,
});

const courierPrime = Courier_Prime({
  variable: "--nf-courierprime",
  subsets: ["latin"],
  preload: false,
  weight: ["400", "700"],
});

// Applies the user's saved font preference before hydration to avoid a flash of the wrong font.
// Mirrors the store's migration: v0 preferences are ignored (the store resets
// them to the current default, so the CSS default applies instead), renamed
// fonts map to their replacement, and anything unknown is left to the default.
const fontInitScript = `(function(){try{var raw=localStorage.getItem(${JSON.stringify(
  FONT_STORAGE_KEY,
)});var saved=raw&&JSON.parse(raw);if(!saved||!(saved.version>=1&&saved.version<=${FONT_STORAGE_VERSION})||!saved.state)return;var font=saved.state.font;var renamed=${JSON.stringify(
  RENAMED_FONTS,
)};if(renamed.hasOwnProperty(font))font=renamed[font];if(${JSON.stringify(
  FONT_ORDER,
)}.indexOf(font)!==-1)document.documentElement.setAttribute("data-font",font);}catch(e){}})();`;

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
    // Preview images come from app/opengraph-image.jsx and app/twitter-image.jsx
  },

  twitter: {
    card: "summary_large_image",
    title: "Jeff's Portfolio | Software Developer",
    description:
      "Welcome to my portfolio showcasing projects, technical skills, tech blogs, experience, and much more",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  manifest: "/manifest.json",

  authors: [{ name: "Geoffrey Owuor" }],

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={` ${geistSans.variable} ${dmMono.variable} ${dmsans.variable} ${inter.variable} ${lora.variable} ${sourceSerif.variable} ${geistMono.variable} ${jetbrainsMono.variable} ${sourceCodePro.variable} ${courierPrime.variable} bg-surface antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Portfolio" />
        <script dangerouslySetInnerHTML={{ __html: fontInitScript }} />
      </head>
      {/* The column layout pins the footer: a `flex-1` <main> soaks up any
          leftover height on short pages, while tall pages scroll the
          document as normal beneath the sticky header. */}
      <body className="flex min-h-dvh flex-col">
        <Providers>
          {/* The app's single notification system (see Modules/Toaster). */}
          <ToastProvider>
            <NetworkStatus />

            {/* Owns the app-wide progress line; client navigations go through
              its `useProgressRouter()`/`ProgressLink` so the line tracks them. */}
            <RouteProgressProvider>
              <NavBar />
              <main className="flex flex-1 flex-col">{children}</main>
              <Footer />
            </RouteProgressProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
