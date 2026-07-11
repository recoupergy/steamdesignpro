export type Wall = "north" | "east" | "south" | "west";
export type FinishCode = "CP" | "SN" | "AF" | "BN" | "BV" | "BL" | "2MB" | "TT" | "BGP" | "DR";

export interface PlannerState {
  version: 1;
  units: "us" | "metric";
  widthInches: number;
  depthInches: number;
  heightInches: number;
  doorWall: Wall;
  doorSwing: "in-left" | "in-right" | "out-left" | "out-right";
  doorWidthInches: number;
  glassWalls: Wall[];
  bench: {
    type: "none" | "floating" | "built-in" | "corner";
    wall: Wall;
    widthInches: number;
    depthInches: number;
    heightInches: number;
  };
  showerType: "mechanical" | "anthem-plus" | "dtv-plus";
  surfaceMaterial: "porcelain-ceramic-tile" | "natural-stone" | "glass-tile" | "solid-surface" | "other";
  steamHeadStyle: "round" | "square" | "linear";
  steamHeadWall: Wall;
  steamHeadPosition: number;
  secondarySteamHeadWall: Wall;
  secondarySteamHeadPosition: number;
  controllerWall: Wall;
  controllerPosition: number;
  fixtureWall: Wall;
  fixturePosition: number;
  ceilingSlopeDirection: "none" | Wall;
  ceilingSlopeDropInches: number;
  generatorLocation: "adjacent-closet" | "vanity" | "basement" | "attic" | "mechanical-room" | "other";
  generatorDistanceFt: number;
  finish: FinishCode;
  exteriorWallNotes: string;
  windowNotes: string;
}

export const DEFAULT_PLANNER_STATE: PlannerState = {
  version: 1,
  units: "us",
  widthInches: 60,
  depthInches: 48,
  heightInches: 96,
  doorWall: "south",
  doorSwing: "out-left",
  doorWidthInches: 28,
  glassWalls: ["south", "east"],
  bench: {
    type: "floating",
    wall: "north",
    widthInches: 36,
    depthInches: 18,
    heightInches: 18,
  },
  showerType: "mechanical",
  surfaceMaterial: "porcelain-ceramic-tile",
  steamHeadStyle: "round",
  steamHeadWall: "west",
  steamHeadPosition: 0.28,
  secondarySteamHeadWall: "east",
  secondarySteamHeadPosition: 0.3,
  controllerWall: "east",
  controllerPosition: 0.64,
  fixtureWall: "north",
  fixturePosition: 0.72,
  ceilingSlopeDirection: "none",
  ceilingSlopeDropInches: 0,
  generatorLocation: "adjacent-closet",
  generatorDistanceFt: 12,
  finish: "CP",
  exteriorWallNotes: "",
  windowNotes: "",
};

export const STARTER_CONFIGURATIONS = {
  compact: {
    ...DEFAULT_PLANNER_STATE,
    widthInches: 48,
    depthInches: 42,
    bench: { ...DEFAULT_PLANNER_STATE.bench, type: "none" },
    glassWalls: ["south"],
    generatorDistanceFt: 10,
  },
  "glass-corner": {
    ...DEFAULT_PLANNER_STATE,
    widthInches: 60,
    depthInches: 48,
    glassWalls: ["south", "east"],
    steamHeadStyle: "square",
  },
  "anthem-spa": {
    ...DEFAULT_PLANNER_STATE,
    widthInches: 72,
    depthInches: 60,
    showerType: "anthem-plus",
    steamHeadStyle: "linear",
    bench: { ...DEFAULT_PLANNER_STATE.bench, widthInches: 48 },
    generatorLocation: "mechanical-room",
    generatorDistanceFt: 20,
  },
} satisfies Record<string, PlannerState>;

function oppositeWall(wall: Wall): Wall {
  return { north: "south", east: "west", south: "north", west: "east" }[wall] as Wall;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function constrainPlannerState(candidate: PlannerState): PlannerState {
  const benchWall =
    candidate.bench.type !== "none" && candidate.bench.wall === candidate.doorWall
      ? oppositeWall(candidate.doorWall)
      : candidate.bench.wall;
  const benchWallLength =
    benchWall === "north" || benchWall === "south"
      ? candidate.widthInches
      : candidate.depthInches;
  const benchPerpendicularLength =
    benchWall === "north" || benchWall === "south"
      ? candidate.depthInches
      : candidate.widthInches;
  const doorWallLength =
    candidate.doorWall === "north" || candidate.doorWall === "south"
      ? candidate.widthInches
      : candidate.depthInches;

  const glassWalls = [...new Set(candidate.glassWalls)].filter(
    (wall) => wall !== benchWall || candidate.bench.type === "none",
  );

  return {
    ...candidate,
    widthInches: clamp(candidate.widthInches, 36, 240),
    depthInches: clamp(candidate.depthInches, 36, 240),
    heightInches: clamp(candidate.heightInches, 72, 144),
    doorWidthInches: clamp(
      candidate.doorWidthInches,
      24,
      Math.min(48, Math.max(24, doorWallLength - 12)),
    ),
    glassWalls,
    bench: {
      ...candidate.bench,
      wall: benchWall,
      widthInches: clamp(candidate.bench.widthInches, 18, Math.max(18, benchWallLength - 12)),
      depthInches: clamp(candidate.bench.depthInches, 12, Math.max(12, benchPerpendicularLength / 2 - 3)),
      heightInches: clamp(candidate.bench.heightInches, 15, 24),
    },
    ceilingSlopeDropInches:
      candidate.ceilingSlopeDirection === "none"
        ? 0
        : clamp(candidate.ceilingSlopeDropInches, 0, Math.min(24, candidate.heightInches - 72)),
    generatorDistanceFt: clamp(candidate.generatorDistanceFt, 0, 100),
  };
}

export function displayLength(inches: number, units: PlannerState["units"], precision = 1) {
  if (units === "metric") {
    return `${(inches * 2.54).toFixed(precision)} cm`;
  }
  const feet = Math.floor(inches / 12);
  const remaining = Math.round((inches - feet * 12) * 10) / 10;
  return `${feet}′ ${remaining.toFixed(remaining % 1 === 0 ? 0 : precision)}″`;
}

export function inputLengthToInches(value: number, units: PlannerState["units"]) {
  return units === "metric" ? value / 2.54 : value;
}

export function inchesToInputLength(value: number, units: PlannerState["units"]) {
  return units === "metric" ? value * 2.54 : value;
}

export function feetToInputDistance(value: number, units: PlannerState["units"]) {
  return units === "metric" ? value * 0.3048 : value;
}

export function inputDistanceToFeet(value: number, units: PlannerState["units"]) {
  return units === "metric" ? value / 0.3048 : value;
}
