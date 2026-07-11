import { describe, expect, it } from "vitest";
import { DEFAULT_PLANNER_STATE, type PlannerState } from "@/lib/planner-schema";
import { getGeneratorBySku } from "./catalog";
import { resolveKohlerAccessoryPackage } from "./controls";

function packageFor(
  generatorSku: string,
  showerType: PlannerState["showerType"],
  steamHeadStyle: PlannerState["steamHeadStyle"],
  finish: PlannerState["finish"] = "CP",
) {
  const generator = getGeneratorBySku(generatorSku);
  if (!generator) throw new Error(`Missing test generator ${generatorSku}`);
  return resolveKohlerAccessoryPackage(
    { ...DEFAULT_PLANNER_STATE, showerType, steamHeadStyle, finish },
    generator,
  );
}

describe("current controller and steam-head compatibility", () => {
  it.each([
    ["K-32324-NA", "mechanical", "round", "K-5557", null, 1],
    ["K-32332-NA", "mechanical", "round", "K-5558", null, 2],
    ["K-32324-NA", "mechanical", "square", "K-32312", "K-32310", 1],
    ["K-32332-NA", "mechanical", "linear", "K-32312", "K-32309", 2],
    ["K-32324-NA", "anthem-plus", "round", "K-5548-K1", null, 1],
    ["K-32332-NA", "dtv-plus", "round", "K-5549-K1", null, 2],
    ["K-32324-NA", "dtv-plus", "square", "K-32311", "K-32310", 1],
    ["K-32332-NA", "anthem-plus", "linear", "K-32311", "K-32309", 2],
  ] as const)(
    "%s + %s + %s resolves only the compatible package",
    (generator, system, style, controlSku, headSku, totalHeads) => {
      const resolved = packageFor(generator, system, style);
      expect(resolved?.control.sku).toBe(controlSku);
      expect(resolved?.steamHead?.sku ?? null).toBe(headSku);
      expect((resolved?.includedSteamHeads ?? 0) + (resolved?.separateSteamHeads ?? 0)).toBe(totalHeads);
    },
  );

  it("prevents an unavailable finish in the final single mechanical round package", () => {
    const resolved = packageFor("K-32324-NA", "mechanical", "round", "AF");
    expect(resolved?.availableFinishes).not.toContain("AF");
    expect(resolved?.selectedFinish).toBe("CP");
    expect(resolved?.requestedFinishAdjusted).toBe(true);
  });
});
