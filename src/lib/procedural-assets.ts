export const INCHES_PER_SCENE_UNIT = 12;

export const PROCEDURAL_ASSET_DIMENSIONS_INCHES = {
  k32309LinearHead: { width: 13.75, height: 2.0625, projection: 0.375 },
  k32310SquareHead: { width: 3, height: 3, projection: 0.75 },
  k32312ControlEnvelope: { width: 3.25, height: 4, projection: 1 },
} as const;

export function inchesToSceneUnits(inches: number) {
  return inches / INCHES_PER_SCENE_UNIT;
}
