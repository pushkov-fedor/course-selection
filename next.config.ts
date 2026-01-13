import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/course-selection",
  assetPrefix: "/course-selection",
};

export default nextConfig;
