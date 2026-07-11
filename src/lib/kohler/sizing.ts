import type { PlannerState } from "@/lib/planner-schema";
import type { PlanningWarning } from "@/lib/manufacturer-adapter";
import { KOHLER_GENERATORS, KOHLER_RULES, type Generator } from "./catalog";

export type PlannerWarning = PlanningWarning;

export interface SizingResult {
  baseVolumeCuFt: number;
  baseVolumeCubicMeters: number;
  baseGenerator: Generator | null;
  recommendedGenerator: Generator | null;
  ceilingAdjustmentSteps: number;
  fractionalCeilingReview: boolean;
  needsManufacturerReview: boolean;
  warnings: PlannerWarning[];
}

const installationGuide = "https://techcomm.kohler.com/techcomm/pdf/1601844-2.pdf";
const selectionGuide =
  "https://www.studiokohler.com/content/dam/kohler-kds/PDP-PDF-22-3187-0824-select-your-controller-and-steam-head.pdf";

export function calculateBaseVolumeCuFt(state: Pick<PlannerState, "widthInches" | "depthInches" | "heightInches">) {
  return (state.widthInches * state.depthInches * state.heightInches) / 1728;
}

export function ceilingAdjustmentForHeight(heightInches: number) {
  const heightFt = heightInches / 12;
  const aboveRecommended = Math.max(0, heightFt - KOHLER_RULES.recommendedCeilingMaxFt);
  const steps = aboveRecommended <= Number.EPSILON ? 0 : Math.ceil(aboveRecommended - Number.EPSILON);
  const fractional = aboveRecommended > 0 && Math.abs(aboveRecommended - Math.round(aboveRecommended)) > 1e-9;
  return { steps, fractional, heightFt };
}

export function sizeKohlerGenerator(state: PlannerState): SizingResult {
  const baseVolumeCuFt = calculateBaseVolumeCuFt(state);
  const baseGeneratorIndex = KOHLER_GENERATORS.findIndex(
    (generator) => baseVolumeCuFt <= generator.maxVolumeCuFt + Number.EPSILON,
  );
  const baseGenerator = baseGeneratorIndex >= 0 ? KOHLER_GENERATORS[baseGeneratorIndex] ?? null : null;
  const ceiling = ceilingAdjustmentForHeight(state.heightInches);
  const adjustedIndex = baseGeneratorIndex >= 0 ? baseGeneratorIndex + ceiling.steps : -1;
  const catalogRecommendation =
    adjustedIndex >= 0 && adjustedIndex < KOHLER_GENERATORS.length
      ? KOHLER_GENERATORS[adjustedIndex] ?? null
      : null;
  const withinDocumentedCeilingRange = ceiling.heightFt <= KOHLER_RULES.documentedCeilingMaxFt;
  const recommendedGenerator = withinDocumentedCeilingRange ? catalogRecommendation : null;
  const warnings: PlannerWarning[] = [];
  const samePlacementZone = (
    firstWall: PlannerState["steamHeadWall"],
    firstPosition: number,
    secondWall: PlannerState["steamHeadWall"],
    secondPosition: number,
  ) => firstWall === secondWall && Math.abs(firstPosition - secondPosition) < 0.12;

  if (ceiling.steps > 0) {
    warnings.push({
      id: "ceiling-adjustment",
      severity: ceiling.fractional ? "caution" : "information",
      title: `${ceiling.steps}-size ceiling adjustment`,
      detail: ceiling.fractional
        ? "KOHLER says to advance one size for each foot above 8 ft but does not publish a fractional-foot rule. This planner conservatively rounds the started foot upward; confirm the result with KOHLER."
        : "The recommendation advances one catalog size for each full foot above KOHLER’s recommended 8 ft ceiling.",
      sourceUrl: selectionGuide,
    });
  }

  if (ceiling.heightFt > KOHLER_RULES.documentedCeilingMaxFt) {
    warnings.push({
      id: "ceiling-range",
      severity: "stop",
      title: "Ceiling is outside the documented range",
      detail: "Current KOHLER installation instructions list a 10 ft maximum ceiling. Manufacturer review is required.",
      sourceUrl: installationGuide,
    });
  }

  if (!baseGenerator || !catalogRecommendation || baseVolumeCuFt > KOHLER_RULES.maxSupportedVolumeCuFt) {
    warnings.push({
      id: "catalog-range",
      severity: "stop",
      title: "No catalog recommendation",
      detail:
        "The calculated volume and ceiling adjustment extend beyond the current K-323xx catalog. Do not extrapolate; ask KOHLER to review the room.",
      sourceUrl: selectionGuide,
    });
  }

  if (state.generatorDistanceFt > KOHLER_RULES.maxGeneratorToSteamHeadFt) {
    const limit = state.units === "metric" ? "7.62 m (25 ft)" : "25 ft";
    warnings.push({
      id: "generator-distance",
      severity: "stop",
      title: `Generator is more than ${limit} from the steam head`,
      detail: "Relocate the generator or obtain manufacturer direction before specifying equipment.",
      sourceUrl: installationGuide,
    });
  } else if (state.generatorDistanceFt > 20) {
    const enteredDistance = state.units === "metric" ? `${(state.generatorDistanceFt * 0.3048).toFixed(2)} m` : `${state.generatorDistanceFt.toFixed(1)} ft`;
    warnings.push({
      id: "generator-distance-near-limit",
      severity: "caution",
      title: "Generator distance is near the published limit",
      detail: `The entered route is ${enteredDistance}. Confirm routed steam-line length, not only straight-line distance; KOHLER limits the run to ${state.units === "metric" ? "7.62 m (25 ft)" : "25 ft"}.`,
      sourceUrl: installationGuide,
    });
  }

  if (
    state.controllerWall === state.steamHeadWall ||
    (recommendedGenerator?.configuration === "tandem" && state.controllerWall === state.secondarySteamHeadWall)
  ) {
    warnings.push({
      id: "control-placement",
      severity: "caution",
      title: "Move the control away from the steam head",
      detail:
        recommendedGenerator?.configuration === "tandem"
          ? "For a dual-head installation, KOHLER directs the control to a different wall and as far from both heads as practical."
          : "For a single-head installation, KOHLER directs the control to the wall opposite the steam head.",
      sourceUrl: installationGuide,
    });
  }

  if (
    samePlacementZone(
      state.fixtureWall,
      state.fixturePosition,
      state.controllerWall,
      state.controllerPosition,
    ) ||
    samePlacementZone(
      state.fixtureWall,
      state.fixturePosition,
      state.steamHeadWall,
      state.steamHeadPosition,
    ) ||
    (recommendedGenerator?.configuration === "tandem" &&
      samePlacementZone(
        state.fixtureWall,
        state.fixturePosition,
        state.secondarySteamHeadWall,
        state.secondarySteamHeadPosition,
      ))
  ) {
    warnings.push({
      id: "fixture-zone-overlap",
      severity: "stop",
      title: "Fixture placement zones overlap",
      detail:
        "The schematic wall positions place fixtures in the same planning zone. Separate them and confirm actual product dimensions, required clearances, blocking, piping, and the current installation instructions.",
      sourceUrl: installationGuide,
    });
  }

  if (
    recommendedGenerator?.configuration === "tandem" &&
    samePlacementZone(
      state.steamHeadWall,
      state.steamHeadPosition,
      state.secondarySteamHeadWall,
      state.secondarySteamHeadPosition,
    )
  ) {
    warnings.push({
      id: "steam-head-zone-overlap",
      severity: "stop",
      title: "The two steam-head zones overlap",
      detail:
        "Tandem systems require two steam heads. Select distinct locations and have KOHLER or the installer confirm the final outlet arrangement.",
      sourceUrl: installationGuide,
    });
  }

  const doorWallLength =
    state.doorWall === "north" || state.doorWall === "south"
      ? state.widthInches
      : state.depthInches;
  const doorHalfZone = state.doorWidthInches / doorWallLength / 2 + 0.08;
  const conflictsWithDoor = (wall: PlannerState["steamHeadWall"], position: number) =>
    wall === state.doorWall && Math.abs(position - 0.5) < doorHalfZone;
  if (
    conflictsWithDoor(state.fixtureWall, state.fixturePosition) ||
    conflictsWithDoor(state.controllerWall, state.controllerPosition) ||
    conflictsWithDoor(state.steamHeadWall, state.steamHeadPosition) ||
    (recommendedGenerator?.configuration === "tandem" &&
      conflictsWithDoor(state.secondarySteamHeadWall, state.secondarySteamHeadPosition))
  ) {
    warnings.push({
      id: "door-zone-overlap",
      severity: "stop",
      title: "A fixture overlaps the door zone",
      detail:
        "Move the door or wall-mounted fixture outside the schematic door opening and swing zone, then verify the built layout and required clearances.",
      sourceUrl: installationGuide,
    });
  }

  if (
    state.bench.type !== "none" &&
    ((state.bench.wall === state.steamHeadWall && Math.abs(state.steamHeadPosition - 0.5) < 0.36) ||
      (recommendedGenerator?.configuration === "tandem" &&
        state.bench.wall === state.secondarySteamHeadWall &&
        Math.abs(state.secondarySteamHeadPosition - 0.5) < 0.36))
  ) {
    warnings.push({
      id: "steam-head-bench",
      severity: "stop",
      title: "Steam head conflicts with the bench zone",
      detail: "KOHLER directs that the steam head not be blocked and not be located near a seat or bench. Choose another wall position.",
      sourceUrl: installationGuide,
    });
  }

  if (state.exteriorWallNotes.trim() || state.windowNotes.trim()) {
    warnings.push({
      id: "envelope-review",
      severity: "caution",
      title: "Building-envelope review needed",
      detail:
        "Exterior assemblies and windows require project-specific waterproofing, vapor, thermal, and condensation detailing. They do not change KOHLER sizing in this planner.",
    });
  }

  warnings.push({
    id: "generator-service-clearance",
    severity: "information",
    title: "Reserve generator service clearance",
    detail: `KOHLER requires at least ${KOHLER_RULES.generatorClearanceInches} inches of air gap around the generator on at least three sides. Coordinate a dry, accessible service location.`,
    sourceUrl: installationGuide,
  });

  warnings.push({
    id: "electrical-code",
    severity: "caution",
    title: "Reconcile KOHLER’s no-GFCI instruction with local code",
    detail:
      "KOHLER depicts a dedicated two-pole circuit without GFCI and separately requires local-code compliance. A licensed electrician and the authority having jurisdiction must determine the final protection and wiring.",
    sourceUrl: installationGuide,
  });

  return {
    baseVolumeCuFt,
    baseVolumeCubicMeters: baseVolumeCuFt * 0.028316846592,
    baseGenerator,
    recommendedGenerator,
    ceilingAdjustmentSteps: ceiling.steps,
    fractionalCeilingReview: ceiling.fractional,
    needsManufacturerReview:
      !recommendedGenerator ||
      ceiling.heightFt > KOHLER_RULES.documentedCeilingMaxFt ||
      state.generatorDistanceFt > KOHLER_RULES.maxGeneratorToSteamHeadFt ||
      warnings.some((warning) => warning.severity === "stop"),
    warnings,
  };
}
