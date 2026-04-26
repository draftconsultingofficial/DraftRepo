// import type { NextConfig } from "next";

// function getR2Hostname() {
//   try {
//     const raw = process.env.R2_PUBLIC_URL;
//     if (!raw) return undefined;
//     const u = new URL(raw);
//     return u.hostname;
//   } catch (err) {
//     return undefined;
//   }
// }

// const r2Host = getR2Hostname();

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       ...(r2Host
//         ? [
//             {
//               protocol: "https",
//               hostname: r2Host,
//               pathname: "/**",
//             },
//           ]
//         : []),
//     ],
//   },
// };

// export default nextConfig;
import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function getR2Pattern(): RemotePattern | undefined {
  try {
    const raw = process.env.R2_PUBLIC_URL;
    if (!raw) return undefined;
    const u = new URL(raw);
    return {
      protocol: u.protocol.replace(":", "") as "http" | "https", // "https"
      hostname: u.hostname,
      port: u.port || undefined,
      pathname: "/**",
    };
  } catch {
    return undefined;
  }
}

const r2Pattern = getR2Pattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2Pattern ? [r2Pattern] : [],
  },
};

export default nextConfig;
