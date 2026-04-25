import type { MetadataRoute } from "next";
import { defaultSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    sitemap: `${defaultSiteUrl}/sitemap.xml`,
  };
}
