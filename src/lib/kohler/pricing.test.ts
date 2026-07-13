import { describe, expect, it } from "vitest";
import { DEFAULT_PLANNER_STATE } from "@/lib/planner-schema";
import { KOHLER_ADAPTER } from "./adapter";
import { getKohlerPrice } from "./pricing";

describe("KOHLER pricing references", () => {
  it("contains the current 9 kW generator list-price reference", () => {
    expect(getKohlerPrice("K-32326-NA")?.record.priceUsd).toBe(3225);
    expect(getKohlerPrice("K-32326-NA")?.isReference).toBe(false);
  });

  it("uses transparent CP pricing as a reference for an unpriced finish variant", () => {
    expect(getKohlerPrice("K-5557-BL")?.record.sku).toBe("K-5557-CP");
    expect(getKohlerPrice("K-5557-BL")?.isReference).toBe(true);
  });

  it("calculates the complete default single-system equipment subtotal", () => {
    const recommendation = KOHLER_ADAPTER.recommend(DEFAULT_PLANNER_STATE);
    expect(recommendation.pricing.complete).toBe(true);
    expect(recommendation.pricing.subtotalUsd).toBeCloseTo(4197.41, 2);
    expect(recommendation.accessoryPackage?.items.map((item) => item.sku)).toEqual([
      "K-32326-NA",
      "K-5559-NA",
      "K-5557-CP",
    ]);
  });
});
