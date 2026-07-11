import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "GPTBot"],
        allow: "/",
      },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: "https://steamdesignpro.com/sitemap.xml",
    host: "https://steamdesignpro.com",
  };
}
