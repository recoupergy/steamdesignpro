import type { MetadataRoute } from "next";
import { KOHLER_GENERATORS } from "@/lib/kohler/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://steamdesignpro.com";
  const lastModified = new Date("2026-07-11T00:00:00.000Z");
  const routes = [
    "",
    "/guide",
    "/kohler",
    "/steam-generator-sizing",
    "/steam-shower-checklist",
    "/sources",
    "/about",
    "/privacy",
    "/terms",
  ];
  return [
    ...routes.map((route) => ({
      url: `${base}${route}`,
      lastModified,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route === "/kohler" || route === "/steam-generator-sizing" ? 0.8 : 0.6,
    })),
    ...KOHLER_GENERATORS.map((generator) => ({
      url: `${base}/kohler/${generator.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
