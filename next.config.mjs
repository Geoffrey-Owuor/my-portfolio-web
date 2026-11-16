// Content Security Policy, in report-only mode: violations show up in the
// browser console and nothing is blocked. Once a deploy shows no reports,
// rename the header to Content-Security-Policy to enforce it.
//
// 'unsafe-inline' scripts cover Next's inline bootstrap, the font-init
// script and JSON-LD (no per-request nonces, so pages stay static);
// 'unsafe-eval' is only needed by the dev server's hot reloading.
const isDev = process.env.NODE_ENV !== "production";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Blog posts embed images from anywhere on the web (e.g. Unsplash).
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
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
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
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
