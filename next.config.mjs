/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF first (smallest), WebP as the fallback for browsers without AVIF
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
