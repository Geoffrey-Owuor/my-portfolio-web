import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BlogsData } from "@/cache/BlogsData";
import { formatDate } from "@/utils/Helpers";
import { SITE_NAME } from "@/utils/metadata";

// Each post's social preview: its title on the site's card, so a shared link
// says what it is about. Being in this segment, it takes precedence over the
// site-wide card. Colours mirror the dark theme tokens in styles/globals.css.
export const alt = `A blog post by ${SITE_NAME}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Long titles step down so they still fit in three lines.
const titleSize = (title) =>
  title.length > 90 ? 52 : title.length > 60 ? 60 : 68;

export default async function BlogImage({ params }) {
  const { slug } = await params;
  // The cached listing already holds every title, so no extra query.
  const post = (await BlogsData())?.find((blog) => blog.slug === slug);

  const logo = await readFile(
    join(process.cwd(), "public/web-app-manifest-192x192.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  const title = post?.blog_title ?? `${SITE_NAME} — Blog`;
  const meta = post
    ? [formatDate(post.blog_date), post.read_time].filter(Boolean).join(" · ")
    : "Software, security and emerging tech";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background: "#030712",
          color: "#f3f4f6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
          <img src={logoSrc} width={64} height={64} alt="" />
          <div style={{ fontSize: 30, color: "#60a5fa" }}>~/blog</div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: titleSize(title),
            fontWeight: 700,
            letterSpacing: -1.5,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 30,
            color: "#9ca3af",
          }}
        >
          <div>{SITE_NAME}</div>
          <div>{meta}</div>
        </div>
      </div>
    ),
    size,
  );
}
