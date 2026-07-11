import { describe, expect, it } from "vitest";
import {
  DEFAULT_PLANNER_STATE,
  constrainPlannerState,
  feetToInputDistance,
  inchesToInputLength,
  inputDistanceToFeet,
  inputLengthToInches,
} from "./planner-schema";
import { decodePlannerState, encodePlannerState, stateFromSearchParams } from "./planner-url";

describe("unit conversion", () => {
  it.each([0, 1, 42, 96, 143.75])("round-trips %s inches through metric", (inches) => {
    const centimeters = inchesToInputLength(inches, "metric");
    expect(inputLengthToInches(centimeters, "metric")).toBeCloseTo(inches, 10);
  });

  it.each([0, 12, 25, 100])("round-trips %s routed feet through metric", (feet) => {
    const meters = feetToInputDistance(feet, "metric");
    expect(inputDistanceToFeet(meters, "metric")).toBeCloseTo(feet, 10);
  });
});

describe("versioned URL state", () => {
  it("round-trips Unicode notes and all planner fields", () => {
    const state = { ...DEFAULT_PLANNER_STATE, windowNotes: "Low-e window — verify vapor return." };
    expect(decodePlannerState(encodePlannerState(state))).toEqual(state);
  });

  it("rejects unknown versions safely", () => {
    expect(stateFromSearchParams(new URLSearchParams("v=99&s=bad"))).toEqual(DEFAULT_PLANNER_STATE);
  });

  it("loads a stable starter state", () => {
    const state = stateFromSearchParams(new URLSearchParams("v=1&starter=compact"));
    expect(state.widthInches).toBe(48);
    expect(state.bench.type).toBe("none");
  });
});

describe("geometry constraints", () => {
  it("constrains benches to the room and removes glass from the occupied bench wall", () => {
    const state = constrainPlannerState({
      ...DEFAULT_PLANNER_STATE,
      widthInches: 48,
      depthInches: 42,
      glassWalls: ["north", "south", "north"],
      bench: { ...DEFAULT_PLANNER_STATE.bench, wall: "north", widthInches: 120, depthInches: 30 },
    });
    expect(state.bench.widthInches).toBeLessThanOrEqual(36);
    expect(state.glassWalls).toEqual(["south"]);
  });

  it("clamps the door against its own wall and moves a bench off the door wall", () => {
    const state = constrainPlannerState({
      ...DEFAULT_PLANNER_STATE,
      widthInches: 120,
      depthInches: 42,
      doorWall: "east",
      doorWidthInches: 48,
      bench: { ...DEFAULT_PLANNER_STATE.bench, wall: "east" },
    });
    expect(state.doorWidthInches).toBe(30);
    expect(state.bench.wall).toBe("west");
  });
});
