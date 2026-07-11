"use client";

import { displayLength, type PlannerState, type Wall } from "@/lib/planner-schema";
import { KOHLER_ADAPTER } from "@/lib/kohler/adapter";
import { usePlannerStore } from "@/store/planner-store";
import { useId } from "react";

type DrawingVariant = "plan" | "elevation";
type Point = readonly [number, number];

interface PlanViewProps {
  className?: string;
  elevationWall?: Wall;
  state?: PlannerState;
  variant?: DrawingVariant;
}

interface WallBasis {
  along: Point;
  center: Point;
  inward: Point;
  length: number;
}

const WALL_LABELS: Record<Wall, string> = {
  north: "North",
  east: "East",
  south: "South",
  west: "West",
};

function add(left: Point, right: Point): Point {
  return [left[0] + right[0], left[1] + right[1]];
}

function scale(point: Point, amount: number): Point {
  return [point[0] * amount, point[1] * amount];
}

function wallBasis(wall: Wall, width: number, depth: number): WallBasis {
  switch (wall) {
    case "north":
      return { center: [width / 2, 0], along: [1, 0], inward: [0, 1], length: width };
    case "south":
      return { center: [width / 2, depth], along: [-1, 0], inward: [0, -1], length: width };
    case "west":
      return { center: [0, depth / 2], along: [0, -1], inward: [1, 0], length: depth };
    case "east":
      return { center: [width, depth / 2], along: [0, 1], inward: [-1, 0], length: depth };
  }
}

function pointOnWall(
  wall: Wall,
  position: number,
  width: number,
  depth: number,
  inset = 0,
): Point {
  const basis = wallBasis(wall, width, depth);
  return add(
    add(basis.center, scale(basis.along, (position - 0.5) * basis.length)),
    scale(basis.inward, inset),
  );
}

function pointsAttribute(points: readonly Point[]) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

function ceilingHeightAt(
  x: number,
  z: number,
  state: PlannerState,
): number {
  const { ceilingSlopeDirection: direction, ceilingSlopeDropInches: drop } = state;
  if (direction === "none" || drop === 0) return state.heightInches;

  let slopeFraction = 0;
  switch (direction) {
    case "north":
      slopeFraction = 1 - z / state.depthInches;
      break;
    case "south":
      slopeFraction = z / state.depthInches;
      break;
    case "west":
      slopeFraction = 1 - x / state.widthInches;
      break;
    case "east":
      slopeFraction = x / state.widthInches;
      break;
  }
  return state.heightInches - drop * slopeFraction;
}

function wallEndpoints(wall: Wall, width: number, depth: number): readonly [Point, Point] {
  switch (wall) {
    case "north":
      return [[0, 0], [width, 0]];
    case "south":
      return [[width, depth], [0, depth]];
    case "west":
      return [[0, depth], [0, 0]];
    case "east":
      return [[width, 0], [width, depth]];
  }
}

function PlanDrawing({ state, markerId }: { state: PlannerState; markerId: string }) {
  const width = state.widthInches;
  const depth = state.depthInches;
  const maximumDimension = Math.max(width, depth);
  const margin = Math.max(18, maximumDimension * 0.2);
  const labelSize = Math.max(4.5, maximumDimension * 0.034);
  const wallStroke = Math.max(1.5, maximumDimension * 0.012);
  const fixtureRadius = Math.max(2.2, maximumDimension * 0.018);
  const viewWidth = width + margin * 2;
  const viewHeight = depth + margin * 2;
  const glassWalls = new Set(state.glassWalls);
  const doorBasis = wallBasis(state.doorWall, width, depth);
  const doorWidth = Math.min(state.doorWidthInches, doorBasis.length - 2);
  const hingeIsLeft = state.doorSwing.endsWith("left");
  const opensIn = state.doorSwing.startsWith("in");
  const hingeOffset = hingeIsLeft ? -doorWidth / 2 : doorWidth / 2;
  const hinge = add(doorBasis.center, scale(doorBasis.along, hingeOffset));
  const closedDirection = hingeIsLeft ? doorBasis.along : scale(doorBasis.along, -1);
  const openDirection = add(
    scale(closedDirection, Math.cos(Math.PI * 0.34)),
    scale(doorBasis.inward, (opensIn ? 1 : -1) * Math.sin(Math.PI * 0.34)),
  );
  const closedEnd = add(hinge, scale(closedDirection, doorWidth));
  const openEnd = add(hinge, scale(openDirection, doorWidth));
  const arcControl = add(
    hinge,
    scale(add(closedDirection, openDirection), doorWidth * 0.74),
  );
  const benchBasis = wallBasis(state.bench.wall, width, depth);
  const benchHalfWidth = state.bench.widthInches / 2;
  const benchDepth = state.bench.depthInches;
  const benchPoints: readonly Point[] = [
    add(benchBasis.center, scale(benchBasis.along, -benchHalfWidth)),
    add(benchBasis.center, scale(benchBasis.along, benchHalfWidth)),
    add(
      add(benchBasis.center, scale(benchBasis.along, benchHalfWidth)),
      scale(benchBasis.inward, benchDepth),
    ),
    add(
      add(benchBasis.center, scale(benchBasis.along, -benchHalfWidth)),
      scale(benchBasis.inward, benchDepth),
    ),
  ];
  const fixturePoint = pointOnWall(
    state.fixtureWall,
    state.fixturePosition,
    width,
    depth,
    fixtureRadius * 1.5,
  );
  const controlPoint = pointOnWall(
    state.controllerWall,
    state.controllerPosition,
    width,
    depth,
    fixtureRadius * 1.5,
  );
  const steamHeadPoint = pointOnWall(
    state.steamHeadWall,
    state.steamHeadPosition,
    width,
    depth,
    fixtureRadius * 1.5,
  );
  const tandem = KOHLER_ADAPTER.recommend(state).generator?.configuration === "tandem";
  const steamHeadPoints = tandem
    ? [
        steamHeadPoint,
        pointOnWall(
          state.secondarySteamHeadWall,
          state.secondarySteamHeadPosition,
          width,
          depth,
          fixtureRadius * 1.5,
        ),
      ]
    : [steamHeadPoint];

  return (
    <svg
      className="plan-view__svg"
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      role="img"
      aria-labelledby={`${markerId}-title ${markerId}-description`}
    >
      <title id={`${markerId}-title`}>Measured steam room floor plan</title>
      <desc id={`${markerId}-description`}>
        {`${displayLength(width, state.units)} wide by ${displayLength(depth, state.units)} deep, with the door, bench, shower fixture, steam control, and steam head shown.`}
      </desc>
      <defs>
        <marker
          id={markerId}
          markerWidth="5"
          markerHeight="5"
          refX="2.5"
          refY="2.5"
          orient="auto-start-reverse"
          markerUnits="strokeWidth"
        >
          <path d="M 5 0 L 0 2.5 L 5 5" fill="none" stroke="context-stroke" />
        </marker>
      </defs>

      <rect width={viewWidth} height={viewHeight} fill="#f8faf9" rx={margin * 0.08} />
      <g transform={`translate(${margin} ${margin})`}>
        <rect width={width} height={depth} fill="#ffffff" />

        {(["north", "east", "south", "west"] as const).map((wall) => {
          const basis = wallBasis(wall, width, depth);
          const start = add(basis.center, scale(basis.along, -basis.length / 2));
          const end = add(basis.center, scale(basis.along, basis.length / 2));
          return (
            <line
              key={wall}
              x1={start[0]}
              y1={start[1]}
              x2={end[0]}
              y2={end[1]}
              stroke={glassWalls.has(wall) ? "#63a9aa" : "#344142"}
              strokeWidth={glassWalls.has(wall) ? wallStroke * 0.75 : wallStroke}
              strokeDasharray={glassWalls.has(wall) ? `${wallStroke * 2} ${wallStroke}` : undefined}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        <line
          x1={add(doorBasis.center, scale(doorBasis.along, -doorWidth / 2))[0]}
          y1={add(doorBasis.center, scale(doorBasis.along, -doorWidth / 2))[1]}
          x2={add(doorBasis.center, scale(doorBasis.along, doorWidth / 2))[0]}
          y2={add(doorBasis.center, scale(doorBasis.along, doorWidth / 2))[1]}
          stroke="#ffffff"
          strokeWidth={wallStroke * 2.1}
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1={hinge[0]}
          y1={hinge[1]}
          x2={openEnd[0]}
          y2={openEnd[1]}
          stroke="#536061"
          strokeWidth={wallStroke * 0.7}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M ${closedEnd[0]} ${closedEnd[1]} Q ${arcControl[0]} ${arcControl[1]} ${openEnd[0]} ${openEnd[1]}`}
          fill="none"
          stroke="#98a5a5"
          strokeWidth={wallStroke * 0.45}
          strokeDasharray={`${wallStroke * 1.5} ${wallStroke}`}
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={hinge[0]} cy={hinge[1]} r={wallStroke} fill="#536061" />

        {state.bench.type !== "none" ? (
          <polygon
            points={pointsAttribute(benchPoints)}
            fill={state.bench.type === "built-in" ? "#e4e9e7" : "#dce5e1"}
            stroke="#788584"
            strokeWidth={wallStroke * 0.55}
            vectorEffect="non-scaling-stroke"
          />
        ) : null}

        <g className="plan-view__marker plan-view__marker--fixture">
          <circle
            cx={fixturePoint[0]}
            cy={fixturePoint[1]}
            r={fixtureRadius}
            fill="#f7f9f8"
            stroke="#334041"
            strokeWidth={wallStroke * 0.5}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M ${fixturePoint[0] - fixtureRadius * 0.6} ${fixturePoint[1]} h ${fixtureRadius * 1.2}`}
            stroke="#334041"
            strokeWidth={wallStroke * 0.45}
            vectorEffect="non-scaling-stroke"
          />
        </g>
        <rect
          x={controlPoint[0] - fixtureRadius * 0.7}
          y={controlPoint[1] - fixtureRadius * 0.7}
          width={fixtureRadius * 1.4}
          height={fixtureRadius * 1.4}
          rx={fixtureRadius * 0.25}
          fill="#167579"
          stroke="#ffffff"
          strokeWidth={wallStroke * 0.35}
          vectorEffect="non-scaling-stroke"
        />
        {steamHeadPoints.map((point, index) =>
          state.steamHeadStyle === "round" ? (
            <circle key={`steam-head-${index}`} cx={point[0]} cy={point[1]} r={fixtureRadius * 0.8} fill="#596667" />
          ) : (
            <rect
              key={`steam-head-${index}`}
              x={point[0] - fixtureRadius * (state.steamHeadStyle === "linear" ? 1.3 : 0.8)}
              y={point[1] - fixtureRadius * 0.55}
              width={fixtureRadius * (state.steamHeadStyle === "linear" ? 2.6 : 1.6)}
              height={fixtureRadius * 1.1}
              rx={state.steamHeadStyle === "linear" ? fixtureRadius * 0.3 : 0}
              fill="#596667"
            />
          ),
        )}

        <line
          x1={0}
          y1={-margin * 0.48}
          x2={width}
          y2={-margin * 0.48}
          stroke="#526061"
          strokeWidth={wallStroke * 0.45}
          markerStart={`url(#${markerId})`}
          markerEnd={`url(#${markerId})`}
          vectorEffect="non-scaling-stroke"
        />
        <text
          x={width / 2}
          y={-margin * 0.61}
          textAnchor="middle"
          fontSize={labelSize}
          fill="#273435"
        >
          {displayLength(width, state.units)}
        </text>
        <line
          x1={-margin * 0.48}
          y1={0}
          x2={-margin * 0.48}
          y2={depth}
          stroke="#526061"
          strokeWidth={wallStroke * 0.45}
          markerStart={`url(#${markerId})`}
          markerEnd={`url(#${markerId})`}
          vectorEffect="non-scaling-stroke"
        />
        <text
          x={-margin * 0.63}
          y={depth / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(-90 ${-margin * 0.63} ${depth / 2})`}
          fontSize={labelSize}
          fill="#273435"
        >
          {displayLength(depth, state.units)}
        </text>

        <text x={width / 2} y={labelSize * 1.5} textAnchor="middle" fontSize={labelSize * 0.78} fill="#657172">
          N
        </text>
      </g>
    </svg>
  );
}

function ElevationDrawing({
  state,
  wall,
  markerId,
}: {
  state: PlannerState;
  wall: Wall;
  markerId: string;
}) {
  const wallLength = wallBasis(wall, state.widthInches, state.depthInches).length;
  const height = state.heightInches;
  const maximumDimension = Math.max(wallLength, height);
  const margin = Math.max(18, maximumDimension * 0.18);
  const labelSize = Math.max(4.5, maximumDimension * 0.034);
  const stroke = Math.max(1.4, maximumDimension * 0.011);
  const [startPoint, endPoint] = wallEndpoints(wall, state.widthInches, state.depthInches);
  const startCeiling = ceilingHeightAt(startPoint[0], startPoint[1], state);
  const endCeiling = ceilingHeightAt(endPoint[0], endPoint[1], state);
  const startCeilingY = height - startCeiling;
  const endCeilingY = height - endCeiling;
  const wallPolygon: readonly Point[] = [
    [0, height],
    [0, startCeilingY],
    [wallLength, endCeilingY],
    [wallLength, height],
  ];
  const viewWidth = wallLength + margin * 2;
  const viewHeight = height + margin * 2;
  const doorHeight = Math.min(80, height - 6);
  const doorWidth = Math.min(state.doorWidthInches, wallLength - 2);
  const doorX = (wallLength - doorWidth) / 2;
  const fixtureX = state.fixturePosition * wallLength;
  const fixtureHeadHeight = Math.min(height - 10, 82);
  const controlX = state.controllerPosition * wallLength;
  const controlHeight = Math.min(60, height - 9);
  const tandem = KOHLER_ADAPTER.recommend(state).generator?.configuration === "tandem";
  const steamHeads = [
    { wall: state.steamHeadWall, position: state.steamHeadPosition },
    ...(tandem
      ? [{ wall: state.secondarySteamHeadWall, position: state.secondarySteamHeadPosition }]
      : []),
  ];
  const steamHeadHeight = 6;
  const tileSize = 12;
  const clipId = `${markerId}-wall-clip`;

  return (
    <svg
      className="plan-view__svg plan-view__svg--elevation"
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      role="img"
      aria-labelledby={`${markerId}-title ${markerId}-description`}
    >
      <title id={`${markerId}-title`}>{`${WALL_LABELS[wall]} wall steam room elevation`}</title>
      <desc id={`${markerId}-description`}>
        {`${displayLength(wallLength, state.units)} wide by ${displayLength(height, state.units)} high. Fixtures on this wall and the selected ceiling slope are shown.`}
      </desc>
      <defs>
        <clipPath id={clipId}>
          <polygon points={pointsAttribute(wallPolygon)} />
        </clipPath>
        <marker
          id={markerId}
          markerWidth="5"
          markerHeight="5"
          refX="2.5"
          refY="2.5"
          orient="auto-start-reverse"
          markerUnits="strokeWidth"
        >
          <path d="M 5 0 L 0 2.5 L 5 5" fill="none" stroke="context-stroke" />
        </marker>
      </defs>

      <rect width={viewWidth} height={viewHeight} fill="#f8faf9" rx={margin * 0.08} />
      <g transform={`translate(${margin} ${margin})`}>
        <polygon points={pointsAttribute(wallPolygon)} fill="#ffffff" stroke="#344142" strokeWidth={stroke} vectorEffect="non-scaling-stroke" />
        <g clipPath={`url(#${clipId})`} opacity="0.72">
          {Array.from({ length: Math.floor(wallLength / tileSize) }, (_, index) => (index + 1) * tileSize).map((x) => (
            <line key={`vertical-${x}`} x1={x} y1={0} x2={x} y2={height} stroke="#d8dfdd" strokeWidth={stroke * 0.25} vectorEffect="non-scaling-stroke" />
          ))}
          {Array.from({ length: Math.floor(height / tileSize) }, (_, index) => (index + 1) * tileSize).map((yFromFloor) => (
            <line key={`horizontal-${yFromFloor}`} x1={0} y1={height - yFromFloor} x2={wallLength} y2={height - yFromFloor} stroke="#d8dfdd" strokeWidth={stroke * 0.25} vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        {state.doorWall === wall ? (
          <g>
            <rect
              x={doorX}
              y={height - doorHeight}
              width={doorWidth}
              height={doorHeight}
              fill="#e9f4f3"
              fillOpacity="0.7"
              stroke="#667879"
              strokeWidth={stroke * 0.75}
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={state.doorSwing.endsWith("left") ? doorX + doorWidth * 0.78 : doorX + doorWidth * 0.22}
              y1={height - doorHeight * 0.57}
              x2={state.doorSwing.endsWith("left") ? doorX + doorWidth * 0.78 : doorX + doorWidth * 0.22}
              y2={height - doorHeight * 0.36}
              stroke="#526061"
              strokeWidth={stroke * 1.2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ) : null}

        {state.bench.type !== "none" && state.bench.wall === wall ? (
          <rect
            x={(wallLength - state.bench.widthInches) / 2}
            y={height - state.bench.heightInches}
            width={state.bench.widthInches}
            height={state.bench.type === "built-in" ? state.bench.heightInches : Math.max(3, state.bench.depthInches * 0.18)}
            fill="#dce5e1"
            stroke="#788584"
            strokeWidth={stroke * 0.55}
            vectorEffect="non-scaling-stroke"
          />
        ) : null}

        {state.fixtureWall === wall ? (
          <g>
            <line x1={fixtureX} y1={height - 42} x2={fixtureX} y2={height - fixtureHeadHeight} stroke="#526061" strokeWidth={stroke * 1.2} vectorEffect="non-scaling-stroke" />
            <line x1={fixtureX} y1={height - fixtureHeadHeight} x2={fixtureX + 8} y2={height - fixtureHeadHeight} stroke="#526061" strokeWidth={stroke * 1.2} vectorEffect="non-scaling-stroke" />
            <circle cx={fixtureX} cy={height - 42} r={4} fill="#f7f9f8" stroke="#526061" strokeWidth={stroke * 0.55} vectorEffect="non-scaling-stroke" />
            <path d={`M ${fixtureX + 3} ${height - fixtureHeadHeight + 2} h 10`} stroke="#526061" strokeWidth={stroke * 2.2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </g>
        ) : null}

        {state.controllerWall === wall ? (
          <rect
            x={controlX - 4}
            y={height - controlHeight - 5}
            width={8}
            height={10}
            rx={1.5}
            fill="#167579"
            stroke="#eaf5f4"
            strokeWidth={stroke * 0.45}
            vectorEffect="non-scaling-stroke"
          />
        ) : null}

        {steamHeads.map((head, index) => {
          if (head.wall !== wall) return null;
          const headX = head.position * wallLength;
          return state.steamHeadStyle === "round" ? (
            <circle key={`steam-head-${index}`} cx={headX} cy={height - steamHeadHeight} r={3.5} fill="#596667" />
          ) : (
            <rect
              key={`steam-head-${index}`}
              x={headX - (state.steamHeadStyle === "linear" ? 9 : 3.5)}
              y={height - steamHeadHeight - 2.5}
              width={state.steamHeadStyle === "linear" ? 18 : 7}
              height={5}
              rx={state.steamHeadStyle === "linear" ? 2 : 0}
              fill="#596667"
            />
          );
        })}

        <line
          x1={0}
          y1={-margin * 0.45}
          x2={wallLength}
          y2={-margin * 0.45}
          stroke="#526061"
          strokeWidth={stroke * 0.45}
          markerStart={`url(#${markerId})`}
          markerEnd={`url(#${markerId})`}
          vectorEffect="non-scaling-stroke"
        />
        <text x={wallLength / 2} y={-margin * 0.58} textAnchor="middle" fontSize={labelSize} fill="#273435">
          {displayLength(wallLength, state.units)}
        </text>
        <line
          x1={-margin * 0.45}
          y1={0}
          x2={-margin * 0.45}
          y2={height}
          stroke="#526061"
          strokeWidth={stroke * 0.45}
          markerStart={`url(#${markerId})`}
          markerEnd={`url(#${markerId})`}
          vectorEffect="non-scaling-stroke"
        />
        <text
          x={-margin * 0.6}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(-90 ${-margin * 0.6} ${height / 2})`}
          fontSize={labelSize}
          fill="#273435"
        >
          {displayLength(height, state.units)}
        </text>
      </g>
    </svg>
  );
}

export function PlanView({
  className,
  elevationWall,
  state: suppliedState,
  variant = "plan",
}: PlanViewProps) {
  const storeState = usePlannerStore((store) => store.present);
  const state = suppliedState ?? storeState;
  const id = useId().replaceAll(":", "");
  const wall = elevationWall ?? state.fixtureWall;
  const classes = ["plan-view", `plan-view--${variant}`, className].filter(Boolean).join(" ");

  return (
    <figure className={classes} data-testid="plan-view">
      {variant === "plan" ? (
        <PlanDrawing state={state} markerId={`plan-arrow-${id}`} />
      ) : (
        <ElevationDrawing state={state} wall={wall} markerId={`elevation-arrow-${id}`} />
      )}
      <figcaption className="plan-view__caption">
        <span className="plan-view__caption-title">
          {variant === "plan" ? "Dimensioned floor plan" : `${WALL_LABELS[wall]} wall elevation`}
        </span>
        <span className="plan-view__caption-detail">
          {variant === "plan"
            ? `${displayLength(state.widthInches, state.units)} × ${displayLength(state.depthInches, state.units)}`
            : `${displayLength(wallBasis(wall, state.widthInches, state.depthInches).length, state.units)} × ${displayLength(state.heightInches, state.units)}`}
        </span>
      </figcaption>
    </figure>
  );
}

export default PlanView;
