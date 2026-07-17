import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-5d88690ab45b4187800a2f33589c6c13.r2.dev",
        pathname: "/examples/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
