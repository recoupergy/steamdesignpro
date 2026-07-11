import { feetToInputDistance, type PlannerState } from "@/lib/planner-schema";
import type { ManufacturerRecommendation } from "@/lib/manufacturer-adapter";

export function GeneratorDiagram({
  state,
  recommendation,
}: {
  state: PlannerState;
  recommendation: ManufacturerRecommendation;
}) {
  const generatorCount = recommendation.generator?.componentGeneratorCount ?? 1;
  const withinLimit = state.generatorDistanceFt <= 25;
  const routedDistance = feetToInputDistance(state.generatorDistanceFt, state.units);
  const routedDistanceText = `${routedDistance.toFixed(1)} ${state.units === "metric" ? "m" : "ft"}`;
  const maximumDistanceText = state.units === "metric" ? "7.62 m (25 ft)" : "25 ft";
  return (
    <figure className="generator-diagram" aria-labelledby="generator-diagram-title">
      <figcaption id="generator-diagram-title">
        Generator route — {state.generatorLocation.replaceAll("-", " ")}
      </figcaption>
      <svg viewBox="0 0 420 118" role="img" aria-label={`${generatorCount} generator unit${generatorCount > 1 ? "s" : ""}, ${routedDistanceText} routed distance to the steam shower`}>
        <rect x="10" y="23" width="82" height="70" rx="5" className="diagram-room" />
        <path d="M20 78h62M26 36h50" className="diagram-tile" />
        <circle cx="32" cy="82" r="5" className="diagram-head" />
        <text x="51" y="109" textAnchor="middle">shower</text>
        <path d="M97 58 C160 12 252 104 324 58" className={withinLimit ? "diagram-route" : "diagram-route diagram-route-warning"} />
        <text x="208" y="25" textAnchor="middle">{routedDistanceText} routed</text>
        <g transform="translate(328 24)">
          <rect width="74" height="66" rx="4" className="diagram-generator" />
          <path d="M8 14h58M12 25h25" className="diagram-generator-detail" />
          {generatorCount > 1 ? <rect x="8" y="33" width="58" height="25" rx="2" className="diagram-generator-second" /> : null}
        </g>
        <text x="365" y="109" textAnchor="middle">{generatorCount > 1 ? "2 generators" : "generator"}</text>
      </svg>
      <p className={withinLimit ? "diagram-note" : "diagram-note diagram-note-warning"}>
        KOHLER maximum: {maximumDistanceText} from generator to steam head. Confirm the actual routed pipe length.
      </p>
    </figure>
  );
}
