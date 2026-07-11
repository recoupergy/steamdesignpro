import { describe, expect, it } from "vitest";
import {
  INCHES_PER_SCENE_UNIT,
  PROCEDURAL_ASSET_DIMENSIONS_INCHES,
  inchesToSceneUnits,
} from "./procedural-assets";

describe("procedural fixture dimensions", () => {
  it("uses a stable 12-inches-per-scene-unit scale", () => {
    expect(INCHES_PER_SCENE_UNIT).toBe(12);
    expect(inchesToSceneUnits(12)).toBe(1);
  });

  it("pins the published visible face envelopes used by the scene", () => {
    expect(PROCEDURAL_ASSET_DIMENSIONS_INCHES.k32309LinearHead).toEqual({
      width: 13.75,
      height: 2.0625,
      projection: 0.375,
    });
    expect(PROCEDURAL_ASSET_DIMENSIONS_INCHES.k32310SquareHead).toEqual({
      width: 3,
      height: 3,
      projection: 0.75,
    });
    expect(PROCEDURAL_ASSET_DIMENSIONS_INCHES.k32312ControlEnvelope).toEqual({
      width: 3.25,
      height: 4,
      projection: 1,
    });
  });
});
