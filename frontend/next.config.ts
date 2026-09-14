import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const scalaOrigin = process.env.SCALA_ORIGIN || "http://127.0.0.1:9000";
    const djangoOrigin = process.env.DJANGO_ORIGIN || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${scalaOrigin}/api/:path*`,
      },
      {
        source: "/django-api/:path*",
        destination: `${djangoOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
