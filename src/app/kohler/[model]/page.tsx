import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { DEFAULT_PLANNER_STATE } from "@/lib/planner-schema";
import { sharePathForState } from "@/lib/planner-share";
import { getGeneratorBySlug, KOHLER_GENERATORS } from "@/lib/kohler/catalog";
import { formatUsd, getKohlerPrice, KOHLER_PRICING } from "@/lib/kohler/pricing";

type ModelPageProps = { params: Promise<{ model: string }> };

export function generateStaticParams() {
  return KOHLER_GENERATORS.map((generator) => ({ model: generator.slug }));
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { model } = await params;
  const generator = getGeneratorBySlug(model);
  if (!generator) return { title: "KOHLER model not found" };
  const title = `${generator.sku} ${generator.powerKw} kW Steam Generator Planning Data`;
  const description = `${generator.sku}: current KOHLER Invigoration ${generator.powerKw} kW ${generator.configuration} generator, ${generator.maxVolumeCuFt} ft³ maximum, and ${generator.dedicatedCircuits} dedicated ${generator.requiredCircuitAmps} A circuit requirement.`;
  const url = `/kohler/${generator.slug}`;
  return {
    title,
    description,
    alternates: { canonical: `/kohler/${generator.slug}` },
    openGraph: { title, description, url, type: "website" },
    twitter: { title, description, card: "summary_large_image" },
  };
}

function plannerPathForModel(index: number, maxVolumeCuFt: number) {
  const previousMaximum = index > 0 ? KOHLER_GENERATORS[index - 1]?.maxVolumeCuFt ?? 0 : 0;
  const targetVolume = previousMaximum + (maxVolumeCuFt - previousMaximum) * 0.65;
  const sideInches = Math.max(36, Math.sqrt((targetVolume * 1728) / 96));
  return sharePathForState({
    ...DEFAULT_PLANNER_STATE,
    widthInches: sideInches,
    depthInches: sideInches,
    heightInches: 96,
    bench: { ...DEFAULT_PLANNER_STATE.bench, type: "none" },
  });
}

export default async function KohlerModelPage({ params }: ModelPageProps) {
  const { model } = await params;
  const generator = getGeneratorBySlug(model);
  if (!generator) notFound();
  const index = KOHLER_GENERATORS.findIndex((candidate) => candidate.sku === generator.sku);
  const priceReference = getKohlerPrice(generator.sku);
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `KOHLER Invigoration ${generator.name}`,
    model: generator.sku,
    sku: generator.sku,
    brand: { "@type": "Brand", name: "KOHLER" },
    description: `${generator.powerKw} kW ${generator.configuration} steam generator with a published ${generator.maxVolumeCuFt} cubic-foot maximum volume rating.`,
    additionalProperty: [
      { "@type": "PropertyValue", name: "Power", value: `${generator.powerKw} kW` },
      { "@type": "PropertyValue", name: "Published maximum volume", value: `${generator.maxVolumeCuFt} ft³` },
      { "@type": "PropertyValue", name: "Dedicated circuits", value: String(generator.dedicatedCircuits) },
      { "@type": "PropertyValue", name: "Required service per circuit", value: `240 V, ${generator.requiredCircuitAmps} A, ${generator.frequencyHz} Hz` },
    ],
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Planner", item: "https://steamdesignpro.com/" },
      { "@type": "ListItem", position: 2, name: "KOHLER models", item: "https://steamdesignpro.com/kohler" },
      { "@type": "ListItem", position: 3, name: generator.sku, item: `https://steamdesignpro.com/kohler/${generator.slug}` },
    ],
  };

  return (
    <main className="content-page model-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/kohler">KOHLER models</Link><span>/</span><span>{generator.sku}</span></nav>
      <header className="content-hero model-hero">
        <div>
          <p className="eyebrow">Current model record • pricing reviewed {KOHLER_PRICING.retrievedAt}</p>
          <h1>{generator.sku}</h1>
          <p className="model-subtitle">KOHLER Invigoration {generator.name}</p>
          <p className="content-lede">
            Published for steam rooms up to {generator.maxVolumeCuFt.toLocaleString("en-US")} ft³, subject to ceiling adjustment and every current installation requirement. This record uses the required service rating—not the lower electrical component draw.
          </p>
          <div className="content-actions">
            <Link href={plannerPathForModel(index, generator.maxVolumeCuFt)} className="content-primary-link">Open a room in this model’s range</Link>
            <a href={generator.specUrl} target="_blank" rel="noreferrer" className="content-secondary-link">Current specification <ExternalLink aria-hidden="true" /></a>
            {priceReference ? <a href={priceReference.record.productUrl} target="_blank" rel="noreferrer" className="content-secondary-link">KOHLER product page <ExternalLink aria-hidden="true" /></a> : null}
          </div>
        </div>
        <dl className="model-key-facts">
          <div><dt>Power</dt><dd>{generator.powerKw} kW</dd></div>
          <div><dt>Published maximum</dt><dd>{generator.maxVolumeCuFt.toLocaleString("en-US")} ft³</dd></div>
          <div><dt>Configuration</dt><dd>{generator.configuration}</dd></div>
          <div><dt>Required service</dt><dd>{generator.dedicatedCircuits} × 240 V / {generator.requiredCircuitAmps} A</dd></div>
          <div><dt>List price reference</dt><dd>{priceReference ? formatUsd(priceReference.record.priceUsd) : "—"}</dd></div>
        </dl>
      </header>

      <section className="content-section model-details" aria-labelledby="model-system-title">
        <div>
          <h2 id="model-system-title">System requirements shown by this planner</h2>
          <dl className="definition-list">
            <div><dt>Generator assembly</dt><dd>{generator.componentGeneratorCount} × {generator.componentGeneratorSku}</dd></div>
            <div><dt>Dedicated circuits</dt><dd>{generator.dedicatedCircuits} × 240 V, {generator.requiredCircuitAmps} A, {generator.frequencyHz} Hz</dd></div>
            <div><dt>Steam heads</dt><dd>{generator.steamHeads}</dd></div>
            <div><dt>Drain pans</dt><dd>{generator.drainPans} × {generator.drainPanSku} ({generator.drainPanStatus})</dd></div>
            <div><dt>Price reference</dt><dd>{priceReference ? `${formatUsd(priceReference.record.priceUsd)} • ${KOHLER_PRICING.retrievedAt}` : "Unavailable"}</dd></div>
          </dl>
        </div>
        <div>
          <h2>Field provenance</h2>
          <ul className="provenance-list">
            <li><strong>Volume:</strong> “{generator.provenance.maxVolumeCuFt}”</li>
            <li><strong>Electrical:</strong> “{generator.provenance.electrical}”</li>
            <li><strong>Drain pan:</strong> “{generator.provenance.drainPan}”</li>
          </ul>
          <p>Specification revision: {generator.specRevision}.</p>
        </div>
      </section>

      <section className="content-section content-callout">
        <h2>The maximum volume does not replace the ceiling rule</h2>
        <p>
          KOHLER recommends an 8-foot-or-lower ceiling and directs an upgrade to the next generator size for each foot above 8 feet. SteamDesignPro conservatively treats a started partial foot as an upward step and flags it for review because the current documents do not publish a fractional-foot policy.
        </p>
        <Link href="/steam-generator-sizing">Review the exact calculation</Link>
      </section>

      <aside className="planning-notice">
        <strong>Not a selection approval.</strong> This is an independent source summary, not a statement of availability, suitability, affiliation, or manufacturer approval. The displayed amount is a KOHLER US list-price reference, not installed pricing. Confirm the current product, manual, local code, and full design with KOHLER and licensed professionals.
      </aside>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([product, breadcrumb]) }} />
    </main>
  );
}
