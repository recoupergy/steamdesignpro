import { AlertTriangle, CheckCircle2, CircleAlert, ExternalLink, Info } from "lucide-react";
import type { ManufacturerRecommendation } from "@/lib/manufacturer-adapter";
import type { PlannerState } from "@/lib/planner-schema";
import { FINISH_LABELS } from "@/lib/kohler/controls";
import { KOHLER_RULES } from "@/lib/kohler/catalog";
import { formatUsd } from "@/lib/kohler/pricing";
import { GeneratorDiagram } from "./generator-diagram";

function WarningIcon({ severity }: { severity: "information" | "caution" | "stop" }) {
  if (severity === "stop") return <CircleAlert aria-hidden="true" />;
  if (severity === "caution") return <AlertTriangle aria-hidden="true" />;
  return <Info aria-hidden="true" />;
}

export function RecommendationSummary({
  state,
  recommendation,
}: {
  state: PlannerState;
  recommendation: ManufacturerRecommendation;
}) {
  const generator = recommendation.generator;
  const accessory = recommendation.accessoryPackage;
  return (
    <div className="recommendation-summary" aria-live="polite">
      <div className="result-status">
        {recommendation.needsManufacturerReview ? (
          <CircleAlert aria-hidden="true" className="status-review" />
        ) : (
          <CheckCircle2 aria-hidden="true" className="status-ready" />
        )}
        <div>
          <p className="eyebrow">Preliminary recommendation</p>
          <h2>{generator ? generator.sku : "Manufacturer review"}</h2>
          <p>{generator ? `${generator.powerKw} kW ${generator.configuration} system` : "No current catalog model is selected."}</p>
        </div>
      </div>

      <dl className="result-metrics">
        <div>
          <dt>Room volume</dt>
          <dd>
            {state.units === "metric"
              ? `${recommendation.baseVolumeCubicMeters.toFixed(2)} m³`
              : `${recommendation.baseVolumeCuFt.toFixed(1)} ft³`}
          </dd>
        </div>
        <div>
          <dt>Ceiling adjustment</dt>
          <dd>{recommendation.ceilingAdjustmentSteps ? `+${recommendation.ceilingAdjustmentSteps} catalog size${recommendation.ceilingAdjustmentSteps > 1 ? "s" : ""}` : "None"}</dd>
        </div>
        <div>
          <dt>Electrical</dt>
          <dd>{generator ? `${generator.dedicatedCircuits} × 240 V / ${generator.requiredCircuitAmps} A` : "Review required"}</dd>
        </div>
        <div>
          <dt>Finish</dt>
          <dd>{accessory ? FINISH_LABELS[accessory.selectedFinish as keyof typeof FINISH_LABELS] ?? accessory.selectedFinish : "—"}</dd>
        </div>
      </dl>

      <section className="price-summary" aria-labelledby="price-summary-title">
        <div className="price-summary-header">
          <div>
            <p className="eyebrow">Equipment budget</p>
            <h3 id="price-summary-title">KOHLER list-price reference</h3>
          </div>
          <strong>{recommendation.pricing.subtotalUsd === null ? "—" : formatUsd(recommendation.pricing.subtotalUsd)}</strong>
        </div>
        <p className="price-summary-lede">
          {recommendation.pricing.complete ? "Priced steam-system components for this configuration." : "Some components do not have a current price reference."} Retrieved {recommendation.pricing.retrievedAt}.
        </p>
        <p className="price-summary-note">
          {recommendation.pricing.basis} {accessory?.items.some((item) => item.priceIsReference) ? "Accessory pricing uses the Polished Chrome (CP) reference because finish-specific prices vary." : ""}
        </p>
        <a className="price-summary-source" href={recommendation.pricing.sourceUrl} target="_blank" rel="noreferrer">
          Verify current prices on KOHLER <ExternalLink aria-hidden="true" />
        </a>
      </section>

      {generator ? (
        <section className="product-facts" aria-labelledby="product-facts-title">
          <div className="section-heading-row">
            <h3 id="product-facts-title">Selected system facts</h3>
            <span>{generator.configuration === "tandem" ? "Tandem" : "Single"}</span>
          </div>
          <dl className="product-facts-grid">
            <div><dt>Published capacity</dt><dd>Up to {generator.maxVolumeCuFt.toLocaleString("en-US")} ft³</dd></div>
            <div><dt>Generator assembly</dt><dd>{generator.componentGeneratorCount} × {generator.componentGeneratorSku}</dd></div>
            <div><dt>Steam heads</dt><dd>{generator.steamHeads} required</dd></div>
            <div><dt>Service access</dt><dd>24 × 15 in minimum panel</dd></div>
          </dl>
          <p className="product-facts-note">
            Plan at least {KOHLER_RULES.generatorClearanceInches} in around the generator on three sides and keep the routed steam line within {KOHLER_RULES.maxGeneratorToSteamHeadFt} ft. Confirm the exact installation sheet and local requirements before rough-in.
          </p>
        </section>
      ) : null}

      <section className="specification-list" aria-labelledby="specification-title">
        <h3 id="specification-title">Current specification</h3>
        {accessory?.items.map((item) => (
          <div className="specification-row" key={`${item.sku}-${item.name}`}>
            <span className="specification-quantity">{item.quantity}×</span>
            <div>
              <strong>{item.sku}</strong>
              <span>{item.name}</span>
              <span className="specification-price">
                {item.extendedPriceUsd === null
                  ? "Price unavailable"
                  : `${formatUsd(item.extendedPriceUsd)}${item.quantity > 1 ? ` (${formatUsd(item.unitPriceUsd ?? 0)} each)` : ""}`}
              </span>
              <a className="specification-source" href={item.productUrl ?? item.sourceUrl} target="_blank" rel="noreferrer">
                KOHLER product page <ExternalLink aria-hidden="true" />
              </a>
            </div>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Open official source for ${item.sku}`}>
              <ExternalLink aria-hidden="true" />
            </a>
          </div>
        )) ?? <p>No valid accessory package is available for the current inputs.</p>}
      </section>

      <GeneratorDiagram state={state} recommendation={recommendation} />

      <section className="warning-list" aria-labelledby="coordination-title">
        <div className="section-heading-row">
          <h3 id="coordination-title">Coordination checks</h3>
          <span>{recommendation.warnings.length}</span>
        </div>
        <ol>
          {recommendation.warnings.map((warning) => (
            <li key={warning.id} data-severity={warning.severity}>
              <WarningIcon severity={warning.severity} />
              <div>
                <strong>{warning.title}</strong>
                <p>{warning.detail}</p>
                {warning.sourceUrl ? (
                  <a href={warning.sourceUrl} target="_blank" rel="noreferrer">
                    Official source <ExternalLink aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
