import { z } from "zod";

export const wallSchema = z.enum(["north", "east", "south", "west"]);
export const finishSchema = z.enum(["CP", "SN", "AF", "BN", "BV", "BL", "2MB", "TT", "BGP", "DR"]);

export const plannerStateSchema = z.object({
  version: z.literal(1),
  units: z.enum(["us", "metric"]),
  widthInches: z.number().finite().min(36).max(240),
  depthInches: z.number().finite().min(36).max(240),
  heightInches: z.number().finite().min(72).max(144),
  doorWall: wallSchema,
  doorSwing: z.enum(["in-left", "in-right", "out-left", "out-right"]),
  doorWidthInches: z.number().finite().min(24).max(48),
  glassWalls: z.array(wallSchema).max(4),
  bench: z.object({
    type: z.enum(["none", "floating", "built-in", "corner"]),
    wall: wallSchema,
    widthInches: z.number().finite().min(18).max(120),
    depthInches: z.number().finite().min(12).max(30),
    heightInches: z.number().finite().min(15).max(24),
  }),
  showerType: z.enum(["mechanical", "anthem-plus", "dtv-plus"]),
  surfaceMaterial: z.enum(["porcelain-ceramic-tile", "natural-stone", "glass-tile", "solid-surface", "other"]).default("porcelain-ceramic-tile"),
  steamHeadStyle: z.enum(["round", "square", "linear"]),
  steamHeadWall: wallSchema,
  steamHeadPosition: z.number().finite().min(0.12).max(0.88),
  secondarySteamHeadWall: wallSchema.default("east"),
  secondarySteamHeadPosition: z.number().finite().min(0.12).max(0.88).default(0.3),
  controllerWall: wallSchema,
  controllerPosition: z.number().finite().min(0.12).max(0.88),
  fixtureWall: wallSchema,
  fixturePosition: z.number().finite().min(0.12).max(0.88),
  ceilingSlopeDirection: z.enum(["none", "north", "east", "south", "west"]),
  ceilingSlopeDropInches: z.number().finite().min(0).max(24),
  generatorLocation: z.enum(["adjacent-closet", "vanity", "basement", "attic", "mechanical-room", "other"]),
  generatorDistanceFt: z.number().finite().min(0).max(100),
  finish: finishSchema,
  exteriorWallNotes: z.string().max(500),
  windowNotes: z.string().max(500),
}).strict();
