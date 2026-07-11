import { z } from "zod";
import { finishSchema } from "@/lib/planner-validation";

const pdpFinishSourceSchema = z.object({ sourceUrl: z.url(), retrievedAt: z.string(), quote: z.string() });
const controlSchema = z.object({
  sku: z.string(), name: z.string(), kind: z.enum(["control-kit", "controller", "digital-adapter-kit", "digital-adapter"]),
  showerSystems: z.array(z.enum(["mechanical", "anthem-plus", "dtv-plus"])), configurations: z.array(z.enum(["single", "tandem"])),
  headStyles: z.array(z.enum(["round", "square", "linear"])), includedHeadCount: z.number().int().min(0).max(2),
  compatibleHeadSkus: z.array(z.string()), specFinishCodes: z.array(finishSchema), pdpFinishCodes: z.array(finishSchema),
  pdpFinishSource: pdpFinishSourceSchema, specUrl: z.url(), specRevision: z.string(), provenance: z.string(),
});
const steamHeadSchema = z.object({
  sku: z.string(), name: z.string(), style: z.enum(["square", "linear"]), specFinishCodes: z.array(finishSchema),
  pdpFinishCodes: z.array(finishSchema), pdpFinishSource: pdpFinishSourceSchema,
  dimensionsInches: z.object({ width: z.number(), height: z.number(), projection: z.number() }),
  specUrl: z.url(), specRevision: z.string(), provenance: z.string(),
});
export const controlsCatalogSchema = z.object({
  manufacturer: z.literal("KOHLER"), series: z.string(), retrievedAt: z.string(),
  selectionSource: z.object({ title: z.string(), sourceUrl: z.url(), revision: z.string(), sourceDate: z.string(), page: z.number(), quote: z.string() }),
  finishLabels: z.record(finishSchema, z.string()), controls: z.array(controlSchema), steamHeads: z.array(steamHeadSchema),
});
