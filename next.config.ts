import type { NextConfig } from "next";

// Static export: `next build` writes plain HTML/CSS/JS to `out/`, ready for Cloudflare Pages.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
