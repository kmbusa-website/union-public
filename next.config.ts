import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/:locale(en|ta)/exams/pastpapers/:year", destination: "/:locale/pastpapers/:year", permanent: true },
      { source: "/:locale(en|ta)/exams/pastpapers", destination: "/:locale/pastpapers", permanent: true },
      { source: "/:locale(en|ta)/exams/schemes/:year", destination: "/:locale/pastpapers/schemes/:year", permanent: true },
      { source: "/:locale(en|ta)/exams/schemes", destination: "/:locale/pastpapers/schemes", permanent: true },
      { source: "/:locale(en|ta)/exams", destination: "/:locale/pastpapers", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
