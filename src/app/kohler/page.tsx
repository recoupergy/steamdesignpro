import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { KOHLER_GENERATOR_CATALOG, KOHLER_GENERATORS } from "@/lib/kohler/catalog";
import { formatUsd, getKohlerPrice, KOHLER_PRICING } from "@/lib/kohler/pricing";

export const metadata: Metadata = {
  title: "Current KOHLER Invigoration Steam Generators",
  description:
    "Source-cited current K-323xx KOHLER Invigoration generator volumes, power, electrical requirements, and single/tandem configurations.",
  alternates: { canonical: "/kohler" },
  openGraph: {
    title: "Current KOHLER Invigoration Steam Generators",
    description: "Source-cited current K-323xx volumes, power, electrical requirements, and single/tandem configurations.",
    url: "/kohler",
    type: "website",
  },
  twitter: {
    title: "Current KOHLER Invigoration Steam Generators",
    description: "Source-cited current K-323xx sizing and electrical planning data.",
    card: "summary_large_image",
  },
};

export default function KohlerCatalogPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Planner", item: "https://steamdesignpro.com/" },
      { "@type": "ListItem", position: 2, name: "KOHLER models", item: "https://steamdesignpro.com/kohler" },
    ],
  };
  return (
    <main className="content-page catalog-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>KOHLER models</span></nav>
      <header className="content-hero">
        <p className="eyebrow">Manufacturer catalog • pricing reviewed {KOHLER_PRICING.retrievedAt}</p>
        <h1>Current KOHLER Invigoration generator sequence</h1>
        <p className="content-lede">
          SteamDesignPro’s first release supports exactly one manufacturer system: the current KOHLER Invigoration K-323xx sequence. It does not mix retired K-17xx/K-55xx generator rules into these records.
        </p>
        <div className="content-actions">
          <Link href="/design?v=1&starter=compact" className="content-primary-link">Open the planner</Link>
          <a href={KOHLER_GENERATOR_CATALOG.catalogSource.sourceUrl} target="_blank" rel="noreferrer" className="content-secondary-link">
            Official selection guide <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="content-section" aria-labelledby="catalog-table-title">
        <h2 id="catalog-table-title">Published sizing and electrical data</h2>
        <div className="responsive-table-wrap">
          <table>
            <caption>KOHLER Invigoration K-323xx models in increasing published maximum volume order. Prices are US list-price references retrieved {KOHLER_PRICING.retrievedAt}.</caption>
            <thead><tr><th scope="col">Model</th><th scope="col">Power</th><th scope="col">Maximum volume</th><th scope="col">Configuration</th><th scope="col">Dedicated service</th><th scope="col">List price ref.</th></tr></thead>
            <tbody>
              {KOHLER_GENERATORS.map((generator) => (
                <tr key={generator.sku}>
                  <th scope="row"><Link href={`/kohler/${generator.slug}`}>{generator.sku}</Link></th>
                  <td>{generator.powerKw} kW</td>
                  <td>{generator.maxVolumeCuFt.toLocaleString("en-US")} ft³</td>
                  <td>{generator.configuration === "tandem" ? `Tandem (${generator.componentGeneratorCount} × ${generator.componentGeneratorSku})` : "Single"}</td>
                  <td>{generator.dedicatedCircuits} × 240 V / {generator.requiredCircuitAmps} A</td>
                  <td>{getKohlerPrice(generator.sku) ? formatUsd(getKohlerPrice(generator.sku)!.record.priceUsd) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-section content-callout" aria-labelledby="catalog-reading-title">
        <h2 id="catalog-reading-title">How to read this catalog</h2>
        <p>
          A model’s maximum volume is a ceiling, not a target. First calculate finished volume, then apply KOHLER’s ceiling-height size advancement. A room can fit a model’s published volume and still require the next model because its ceiling is above 8 feet. Spaces above 1,000 ft³ or beyond the documented ceiling range are routed to manufacturer review.
        </p>
        <Link href="/steam-generator-sizing">See the calculation and exact boundary behavior</Link>
      </section>

      <p className="catalog-price-note">Prices are displayed as KOHLER US list-price references for planning only. Verify the live product page before ordering; dealer pricing, availability, tax, freight, and installation are not included.</p>

      <aside className="planning-notice">
        <strong>Independent planning notice.</strong> SteamDesignPro is operated by SaunaShare, Inc. and is not affiliated with, endorsed, certified, or authorized by Kohler Co. Current KOHLER documents, local code, project professionals, and the authority having jurisdiction control final decisions.
      </aside>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </main>
  );
}
