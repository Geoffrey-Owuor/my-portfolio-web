import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Social preview card (1200x630, the size summary_large_image expects). Being a
// file convention, it also covers child routes whose own openGraph metadata
// sets no images. Colours mirror the dark theme tokens in styles/globals.css.
export const alt = "Jeff's Portfolio | Software Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public/web-app-manifest-512x512.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "#030712",
          color: "#f3f4f6",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
        <img src={logoSrc} width={240} height={240} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
            Geoffrey Owuor
          </div>
          <div style={{ fontSize: 40, color: "#9ca3af" }}>
            Full-stack developer · Nairobi, Kenya
          </div>
          <div style={{ fontSize: 30, color: "#60a5fa", marginTop: 12 }}>
            Projects · Stack · Blog
          </div>
        </div>
      </div>
    ),
    size,
  );
}
