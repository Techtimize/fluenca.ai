import type { MetadataRoute } from "next";

const BASE_URL = "https://fluenca.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
      allow: ["/$", "/agents", "/blog", "/demo", "/plans", "/sales"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
