import { z } from "zod";

const provenanceSchema = z.object({ maxVolumeCuFt: z.string(), electrical: z.string(), drainPan: z.string() });
export const generatorSchema = z.object({
  sku: z.string(), slug: z.string(), name: z.string(), configuration: z.enum(["single", "tandem"]),
  componentGeneratorSku: z.string(), componentGeneratorCount: z.number().int().min(1).max(2),
  powerKw: z.number().positive(), maxVolumeCuFt: z.number().positive(), maxVolumeCubicMeters: z.number().positive(),
  voltage: z.literal(240), frequencyHz: z.string(), dedicatedCircuits: z.number().int().min(1).max(2),
  requiredCircuitAmps: z.number().int().positive(), steamHeads: z.number().int().min(1).max(2),
  drainPanSku: z.string(), drainPans: z.number().int().min(1).max(2), drainPanStatus: z.enum(["recommended", "required"]),
  specUrl: z.url(), specRevision: z.string(), provenance: provenanceSchema,
});
export const generatorCatalogSchema = z.object({
  manufacturer: z.literal("KOHLER"), series: z.string(), retrievedAt: z.string(),
  catalogSource: z.object({ title: z.string(), sourceUrl: z.url(), revision: z.string(), sourceDate: z.string(), page: z.number().int() }),
  generators: z.array(generatorSchema).length(10),
});
export const ruleSchema = z.object({
  manufacturer: z.literal("KOHLER"), series: z.string(), retrievedAt: z.string(),
  recommendedCeilingMaxFt: z.literal(8), documentedCeilingMaxFt: z.literal(10), maxSupportedVolumeCuFt: z.literal(1000),
  maxGeneratorToSteamHeadFt: z.literal(25), steamHeadHeightInches: z.literal(6), controllerHeightInches: z.literal(60),
  generatorClearanceInches: z.literal(6), surfaceMaterialMultiplier: z.null(),
  fractionalFootPolicy: z.literal("conservative-ceil-with-review"), manufacturerGfciInstruction: z.string(),
  sources: z.array(z.object({ field: z.string(), sourceUrl: z.url(), title: z.string(), revision: z.string(), sourceDate: z.string().nullable(), page: z.number().int(), quote: z.string() })),
  assumptions: z.array(z.string()),
});
