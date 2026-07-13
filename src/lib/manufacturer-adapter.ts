import type { PlannerState } from "@/lib/planner-schema";

export type WarningSeverity = "information" | "caution" | "stop";

export interface PlanningWarning {
  id: string;
  severity: WarningSeverity;
  title: string;
  detail: string;
  sourceUrl?: string;
}

/** Manufacturer-neutral system fields consumed by the planner UI and exports. */
export interface ManufacturerSystem {
  sku: string;
  name: string;
  configuration: "single" | "tandem";
  componentGeneratorSku: string;
  componentGeneratorCount: number;
  powerKw: number;
  maxVolumeCuFt: number;
  voltage: number;
  frequencyHz: string;
  dedicatedCircuits: number;
  requiredCircuitAmps: number;
  steamHeads: number;
  drainPanSku: string;
  drainPans: number;
  drainPanStatus: "recommended" | "required";
  specUrl: string;
  specRevision: string;
}

export interface SpecificationItem {
  sku: string;
  name: string;
  quantity: number;
  sourceUrl: string;
  productUrl?: string | undefined;
  unitPriceUsd: number | null;
  extendedPriceUsd: number | null;
  priceSourceUrl?: string | undefined;
  priceIsReference?: boolean | undefined;
}

export interface PricingSummary {
  currency: "USD";
  subtotalUsd: number | null;
  complete: boolean;
  retrievedAt: string;
  basis: string;
  sourceUrl: string;
}

export interface AccessoryPackage {
  controlSku: string;
  steamHeadSku: string | null;
  includedSteamHeads: number;
  separateSteamHeads: number;
  availableFinishes: string[];
  selectedFinish: string;
  requestedFinishAdjusted: boolean;
  items: SpecificationItem[];
}

export interface ManufacturerRecommendation {
  manufacturerId: string;
  generator: ManufacturerSystem | null;
  baseGenerator: ManufacturerSystem | null;
  baseVolumeCuFt: number;
  baseVolumeCubicMeters: number;
  ceilingAdjustmentSteps: number;
  fractionalCeilingReview: boolean;
  needsManufacturerReview: boolean;
  accessoryPackage: AccessoryPackage | null;
  pricing: PricingSummary;
  warnings: PlanningWarning[];
}

export interface ManufacturerAdapter {
  readonly id: string;
  readonly displayName: string;
  recommend(state: PlannerState): ManufacturerRecommendation;
}
