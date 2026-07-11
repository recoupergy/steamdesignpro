import type { Metadata } from "next";

const SITE_URL = "https://steamdesignpro.com";

type ContentMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}`;
};

export function contentMetadata({
  title,
  description,
  path,
}: ContentMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      siteName: "SteamDesignPro",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
