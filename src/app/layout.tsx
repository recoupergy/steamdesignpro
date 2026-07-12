import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://steamdesignpro.com"),
  title: {
    default: "SteamDesignPro — Steam Shower Planner",
    template: "%s | SteamDesignPro",
  },
  description:
    "Plan steam-shower dimensions, fixture placement, and current KOHLER Invigoration generator sizing with a live 3D and 2D browser tool.",
  applicationName: "SteamDesignPro",
  authors: [{ name: "SaunaShare, Inc." }],
  creator: "SaunaShare, Inc.",
  publisher: "SaunaShare, Inc.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "SteamDesignPro",
    url: "https://steamdesignpro.com",
    title: "SteamDesignPro — Steam Shower Planner",
    description: "A live 3D and 2D planning tool for current KOHLER Invigoration steam-shower systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SteamDesignPro — Steam Shower Planner",
    description: "Plan a steam enclosure and current KOHLER Invigoration equipment in your browser.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <SiteHeader />
        <div className="site-content" id="main-content" tabIndex={-1}>{children}</div>
        <SiteFooter />
        {process.env.VERCEL ? <Analytics /> : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "SaunaShare, Inc.",
                url: "https://steamdesignpro.com/about",
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "SteamDesignPro",
                url: "https://steamdesignpro.com",
                publisher: { "@type": "Organization", name: "SaunaShare, Inc." },
              },
            ]),
          }}
        />
      </body>
    </html>
  );
}
