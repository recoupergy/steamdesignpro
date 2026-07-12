import type { Metadata } from "next";
import { PlannerShell } from "@/components/planner/planner-shell";

export const metadata: Metadata = {
  title: "3D Steam Shower Designer",
  description:
    "Enter finished steam-shower dimensions, see a live 3D and measured 2D enclosure, and receive a source-linked preliminary KOHLER Invigoration equipment match.",
  alternates: { canonical: "/design" },
  openGraph: {
    type: "website",
    siteName: "SteamDesignPro",
    url: "https://steamdesignpro.com/design",
    title: "3D Steam Shower Designer | SteamDesignPro",
    description:
      "Design the enclosure, place critical components, size current KOHLER Invigoration equipment, and export a planning record.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "SteamDesignPro steam-shower designer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Steam Shower Designer | SteamDesignPro",
    description:
      "Design the enclosure, place critical components, size current KOHLER Invigoration equipment, and export a planning record.",
    images: ["/opengraph-image"],
  },
};

export default function DesignPage() {
  return <PlannerShell />;
}
