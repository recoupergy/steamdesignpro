import { describe, expect, it } from "vitest";
import { DEFAULT_PLANNER_STATE, type PlannerState } from "@/lib/planner-schema";
import { KOHLER_GENERATORS } from "./catalog";
import { ceilingAdjustmentForHeight, sizeKohlerGenerator } from "./sizing";

function stateForVolume(volumeCuFt: number, heightInches = 96): PlannerState {
  const wall = Math.sqrt((volumeCuFt * 1728) / heightInches);
  return {
    ...DEFAULT_PLANNER_STATE,
    widthInches: wall,
    depthInches: wall,
    heightInches,
    bench: { ...DEFAULT_PLANNER_STATE.bench, type: "none" },
  };
}

describe("KOHLER generator threshold sizing", () => {
  for (const [index, generator] of KOHLER_GENERATORS.entries()) {
    it(`selects ${generator.sku} at its exact ${generator.maxVolumeCuFt} ft³ boundary`, () => {
      const result = sizeKohlerGenerator(stateForVolume(generator.maxVolumeCuFt));
      expect(result.recommendedGenerator?.sku).toBe(generator.sku);
    });

    it(`advances immediately above ${generator.maxVolumeCuFt} ft³`, () => {
      const result = sizeKohlerGenerator(stateForVolume(generator.maxVolumeCuFt + 0.001));
      expect(result.recommendedGenerator?.sku ?? null).toBe(KOHLER_GENERATORS[index + 1]?.sku ?? null);
    });
  }

  it("routes volumes beyond 1,000 ft³ to manufacturer review", () => {
    const result = sizeKohlerGenerator(stateForVolume(1000.01));
    expect(result.recommendedGenerator).toBeNull();
    expect(result.needsManufacturerReview).toBe(true);
  });
});

describe("ceiling step policy", () => {
  it.each([
    [96, 0, false],
    [96.01, 1, true],
    [108, 1, false],
    [108.01, 2, true],
    [120, 2, false],
  ])("maps %s inches to %s step(s)", (height, expectedSteps, expectedFractional) => {
    const adjustment = ceilingAdjustmentForHeight(height);
    expect(adjustment.steps).toBe(expectedSteps);
    expect(adjustment.fractional).toBe(expectedFractional);
  });

  it("applies the ceiling step after base-volume selection", () => {
    const result = sizeKohlerGenerator(stateForVolume(80, 108));
    expect(result.baseGenerator?.sku).toBe("K-32324-NA");
    expect(result.recommendedGenerator?.sku).toBe("K-32325-NA");
  });

  it("requires review above the documented 10-foot ceiling", () => {
    const result = sizeKohlerGenerator(stateForVolume(80, 120.01));
    expect(result.recommendedGenerator).toBeNull();
    expect(result.needsManufacturerReview).toBe(true);
    expect(result.warnings.some((warning) => warning.id === "ceiling-range")).toBe(true);
  });
});

describe("placement and construction rules", () => {
  it("does not apply a finish/material multiplier", () => {
    const chrome = sizeKohlerGenerator({ ...stateForVolume(110), finish: "CP" });
    const bronze = sizeKohlerGenerator({ ...stateForVolume(110), finish: "DR" });
    expect(bronze.baseVolumeCuFt).toBeCloseTo(chrome.baseVolumeCuFt, 8);
    expect(bronze.recommendedGenerator?.sku).toBe(chrome.recommendedGenerator?.sku);
  });

  it("blocks a routed distance above 25 ft", () => {
    const result = sizeKohlerGenerator({ ...stateForVolume(110), generatorDistanceFt: 25.01 });
    expect(result.needsManufacturerReview).toBe(true);
    expect(result.warnings.some((warning) => warning.id === "generator-distance")).toBe(true);
  });
});
