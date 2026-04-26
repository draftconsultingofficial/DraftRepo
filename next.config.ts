import type { NextConfig } from "next";

function getR2Hostname() {
  try {
    const raw = process.env.R2_PUBLIC_URL;
    if (!raw) return undefined;
    const u = new URL(raw);
    return u.hostname;
  } catch (err) {
    return undefined;
  }
}

const r2Host = getR2Hostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(r2Host
        ? [
            {
              protocol: "https",
              hostname: r2Host,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
