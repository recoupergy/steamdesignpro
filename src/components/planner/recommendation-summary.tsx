import { AlertTriangle, CheckCircle2, CircleAlert, ExternalLink, Info } from "lucide-react";
import type { ManufacturerRecommendation } from "@/lib/manufacturer-adapter";
import type { PlannerState } from "@/lib/planner-schema";
import { FINISH_LABELS } from "@/lib/kohler/controls";
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

      <section className="specification-list" aria-labelledby="specification-title">
        <h3 id="specification-title">Current specification</h3>
        {accessory?.items.map((item) => (
          <div className="specification-row" key={`${item.sku}-${item.name}`}>
            <span className="specification-quantity">{item.quantity}×</span>
            <div>
              <strong>{item.sku}</strong>
              <span>{item.name}</span>
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
