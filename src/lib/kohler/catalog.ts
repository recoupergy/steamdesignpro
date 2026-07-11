import generatorData from "../../../data/kohler/generators.json";
import ruleData from "../../../data/kohler/rules.json";

export interface Generator {
  sku: string;
  slug: string;
  name: string;
  configuration: "single" | "tandem";
  componentGeneratorSku: string;
  componentGeneratorCount: number;
  powerKw: number;
  maxVolumeCuFt: number;
  maxVolumeCubicMeters: number;
  voltage: 240;
  frequencyHz: string;
  dedicatedCircuits: number;
  requiredCircuitAmps: number;
  steamHeads: number;
  drainPanSku: string;
  drainPans: number;
  drainPanStatus: "recommended" | "required";
  specUrl: string;
  specRevision: string;
  provenance: { maxVolumeCuFt: string; electrical: string; drainPan: string };
}

interface KohlerGeneratorCatalog {
  manufacturer: "KOHLER";
  series: string;
  retrievedAt: string;
  catalogSource: { title: string; sourceUrl: string; revision: string; sourceDate: string; page: number };
  generators: Generator[];
}

interface KohlerRules {
  manufacturer: "KOHLER";
  series: string;
  retrievedAt: string;
  recommendedCeilingMaxFt: 8;
  documentedCeilingMaxFt: 10;
  maxSupportedVolumeCuFt: 1000;
  maxGeneratorToSteamHeadFt: 25;
  steamHeadHeightInches: 6;
  controllerHeightInches: 60;
  generatorClearanceInches: 6;
  surfaceMaterialMultiplier: null;
  fractionalFootPolicy: "conservative-ceil-with-review";
  manufacturerGfciInstruction: string;
  sources: Array<{ field: string; sourceUrl: string; title: string; revision: string; sourceDate: string | null; page: number; quote: string }>;
  assumptions: string[];
}

export const KOHLER_GENERATOR_CATALOG = generatorData as KohlerGeneratorCatalog;
export const KOHLER_GENERATORS = KOHLER_GENERATOR_CATALOG.generators;
export const KOHLER_RULES = ruleData as KohlerRules;

export function getGeneratorBySlug(slug: string) {
  return KOHLER_GENERATORS.find((generator) => generator.slug === slug);
}

export function getGeneratorBySku(sku: string) {
  return KOHLER_GENERATORS.find((generator) => generator.sku === sku);
}
