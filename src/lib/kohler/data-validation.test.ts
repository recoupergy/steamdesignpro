import generatorData from "../../../data/kohler/generators.json";
import ruleData from "../../../data/kohler/rules.json";
import controlsData from "../../../data/kohler/controls.json";
import pricingData from "../../../data/kohler/pricing.json";
import { describe, expect, it } from "vitest";
import { DEFAULT_PLANNER_STATE } from "@/lib/planner-schema";
import { plannerStateSchema } from "@/lib/planner-validation";
import { generatorCatalogSchema, ruleSchema } from "./catalog-validation";
import { controlsCatalogSchema } from "./controls-validation";
import { pricingCatalogSchema } from "./pricing-validation";

describe("checked-in Zod source schemas", () => {
  it("validates the planner defaults and KOHLER source records", () => {
    expect(plannerStateSchema.parse(DEFAULT_PLANNER_STATE)).toEqual(DEFAULT_PLANNER_STATE);
    expect(generatorCatalogSchema.parse(generatorData).generators).toHaveLength(10);
    expect(ruleSchema.parse(ruleData).maxSupportedVolumeCuFt).toBe(1000);
    expect(controlsCatalogSchema.parse(controlsData).controls).toHaveLength(6);
    expect(pricingCatalogSchema.parse(pricingData).products).toHaveLength(20);
  });
});
