import controlsData from "../../../data/kohler/controls.json";
import type { FinishCode, PlannerState } from "@/lib/planner-schema";
import type { Generator } from "./catalog";

interface PdpFinishSource { sourceUrl: string; retrievedAt: string; quote: string }
interface ControlRecord {
  sku: string; name: string; kind: "control-kit" | "controller" | "digital-adapter-kit" | "digital-adapter";
  showerSystems: PlannerState["showerType"][]; configurations: Generator["configuration"][];
  headStyles: PlannerState["steamHeadStyle"][]; includedHeadCount: number; compatibleHeadSkus: string[];
  specFinishCodes: FinishCode[]; pdpFinishCodes: FinishCode[]; pdpFinishSource: PdpFinishSource;
  specUrl: string; specRevision: string; provenance: string;
}
interface SteamHeadRecord {
  sku: string; name: string; style: "square" | "linear"; specFinishCodes: FinishCode[];
  pdpFinishCodes: FinishCode[]; pdpFinishSource: PdpFinishSource;
  dimensionsInches: { width: number; height: number; projection: number };
  specUrl: string; specRevision: string; provenance: string;
}
interface ControlsCatalog {
  manufacturer: "KOHLER"; series: string; retrievedAt: string;
  selectionSource: { title: string; sourceUrl: string; revision: string; sourceDate: string; page: number; quote: string };
  finishLabels: Record<FinishCode, string>; controls: ControlRecord[]; steamHeads: SteamHeadRecord[];
}

export const KOHLER_CONTROLS = controlsData as unknown as ControlsCatalog;
export const FINISH_LABELS: Record<FinishCode, string> = KOHLER_CONTROLS.finishLabels;

function findControl(state: PlannerState, generator: Generator) {
  return KOHLER_CONTROLS.controls.find(
    (control) =>
      control.showerSystems.includes(state.showerType) &&
      control.configurations.includes(generator.configuration) &&
      control.headStyles.includes(state.steamHeadStyle),
  );
}

export function resolveKohlerAccessoryPackage(state: PlannerState, generator: Generator) {
  const control = findControl(state, generator);
  if (!control) return null;

  const steamHead =
    state.steamHeadStyle === "linear"
      ? KOHLER_CONTROLS.steamHeads.find((head) => head.sku === "K-32309")
      : state.steamHeadStyle === "square"
        ? KOHLER_CONTROLS.steamHeads.find((head) => head.sku === "K-32310")
        : undefined;

  if (steamHead && !control.compatibleHeadSkus.includes(steamHead.sku)) return null;

  const availableFinishes = steamHead
    ? control.pdpFinishCodes.filter((finish) => steamHead.pdpFinishCodes.includes(finish))
    : [...control.pdpFinishCodes];
  const selectedFinish = availableFinishes.includes(state.finish) ? state.finish : "CP";
  const separateSteamHeads = steamHead ? generator.steamHeads : 0;

  return {
    control,
    steamHead: steamHead ?? null,
    includedSteamHeads: control.includedHeadCount,
    separateSteamHeads,
    availableFinishes,
    selectedFinish,
    requestedFinishAdjusted: selectedFinish !== state.finish,
  };
}

export function availableFinishesForState(state: PlannerState, generator: Generator | null) {
  if (!generator) return ["CP"] as FinishCode[];
  return resolveKohlerAccessoryPackage(state, generator)?.availableFinishes ?? (["CP"] as FinishCode[]);
}
