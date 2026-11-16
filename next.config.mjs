// Content Security Policy, in report-only mode: violations show up in the
// browser console and nothing is blocked. Once a deploy shows no reports,
// rename the header to Content-Security-Policy to enforce it.
//
// 'unsafe-inline' scripts cover Next's inline bootstrap, the font-init
// script and JSON-LD (no per-request nonces, so pages stay static);
// 'unsafe-eval' is only needed by the dev server's hot reloading.
const isDev = process.env.NODE_ENV !== "production";

// Vercel adds its toolbar (comments, feedback) to preview deployments only,
// so its sources are allowed there and nowhere else. The list is Vercel's own:
// https://vercel.com/docs/vercel-toolbar/managing-toolbar#using-a-content-security-policy
const isPreview = process.env.VERCEL_ENV === "preview";
const toolbar = (sources) => (isPreview ? ` ${sources}` : "");

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${toolbar("https://vercel.live")}`,
  `style-src 'self' 'unsafe-inline'${toolbar("https://vercel.live")}`,
  // Blog posts embed images from anywhere on the web (e.g. Unsplash), which
  // also covers the toolbar's images.
  "img-src 'self' data: blob: https:",
  `font-src 'self' data:${toolbar("https://vercel.live https://assets.vercel.com")}`,
  `connect-src 'self'${toolbar("https://vercel.live wss://ws-us3.pusher.com")}`,
  `frame-src 'self'${toolbar("https://vercel.live")}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // browsing-topics is gone: Chrome dropped the Topics API and now warns
  // about it as an unrecognised feature.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // AVIF first (smallest), WebP as the fallback for browsers without AVIF
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
