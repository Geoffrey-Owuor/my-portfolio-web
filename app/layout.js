import { Esteban, Righteous, Roboto } from "next/font/google";
import "../styles/globals.css";

const esteban = Esteban({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-esteban",
  display: "swap",
});

const righteous = Righteous({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-righteous",
  display: "swap",
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata = {
  title: "Portfolio - Jeff",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="scroll-smooth transition-colors duration-300 ease-in-out"
    >
      <body
        className={` ${esteban.variable} ${righteous.variable} ${roboto.variable} font-esteban dark:bg-darkTheme overflow-x-hidden leading-6 antialiased dark:text-white`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const theme = localStorage.getItem("theme");
                  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  if (theme === "dark") {
                    document.documentElement.classList.add("dark");
                  } else if (theme === "light") {
                    document.documentElement.classList.remove("dark");
                  } else {
                    // System preference
                    if (prefersDark) {
                      document.documentElement.classList.add("dark");
                    } else {
                      document.documentElement.classList.remove("dark");
                    }
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
