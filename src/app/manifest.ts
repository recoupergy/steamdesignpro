import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SteamDesignPro",
    short_name: "SteamDesignPro",
    description: "Browser-based steam-shower planning workspace by SaunaShare, Inc.",
    start_url: "/design",
    display: "standalone",
    background_color: "#f4f8f8",
    theme_color: "#10383a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
