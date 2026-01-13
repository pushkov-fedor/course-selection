import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Если репозиторий не в корне GitHub, раскомментируй и укажи путь:
  // basePath: "/course-selection",
  // assetPrefix: "/course-selection",
};

export default nextConfig;
