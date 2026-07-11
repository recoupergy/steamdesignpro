"use client";

import { ContactShadows, Environment, Lightformer, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { PlannerState, Wall } from "@/lib/planner-schema";
import { usePlannerStore } from "@/store/planner-store";
import { KOHLER_ADAPTER } from "@/lib/kohler/adapter";
import {
  PROCEDURAL_ASSET_DIMENSIONS_INCHES,
  inchesToSceneUnits,
} from "@/lib/procedural-assets";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { PlanView } from "./plan-view";

type Vector3Tuple = readonly [number, number, number];
type EulerTuple = readonly [number, number, number];
type CameraView = "perspective" | "front" | "top" | "steam-head";

interface SteamRoomCanvasProps {
  active?: boolean;
  className?: string;
  onUnavailable?: () => void;
}

interface PanelProps {
  height: number;
  position: Vector3Tuple;
  width: number;
}

interface WallTransform {
  length: number;
  position: Vector3Tuple;
  rotationY: number;
}

const TILE_SIZE = 1;

function toSceneUnits(inches: number) {
  return inchesToSceneUnits(inches);
}

function ChromeMaterial() {
  return (
    <meshStandardMaterial
      color="#d7dddc"
      metalness={0.92}
      roughness={0.16}
      envMapIntensity={0.7}
    />
  );
}

function GlassMaterial() {
  return (
    <meshPhysicalMaterial
      color="#d9efee"
      transparent
      opacity={0.34}
      transmission={0.7}
      thickness={0.08}
      ior={1.45}
      roughness={0.08}
      metalness={0}
      depthWrite={false}
      side={THREE.DoubleSide}
    />
  );
}

function tileGridPositions(width: number, height: number) {
  const positions: number[] = [];
  const firstVertical = Math.ceil(-width / 2 / TILE_SIZE) * TILE_SIZE;
  const firstHorizontal = Math.ceil(-height / 2 / TILE_SIZE) * TILE_SIZE;

  for (let x = firstVertical; x < width / 2; x += TILE_SIZE) {
    if (Math.abs(x + width / 2) < 0.001) continue;
    positions.push(x, -height / 2, 0, x, height / 2, 0);
  }
  for (let y = firstHorizontal; y < height / 2; y += TILE_SIZE) {
    if (Math.abs(y + height / 2) < 0.001) continue;
    positions.push(-width / 2, y, 0, width / 2, y, 0);
  }
  return new Float32Array(positions);
}

function TilePanel({ width, height, position }: PanelProps) {
  const gridPositions = useMemo(() => tileGridPositions(width, height), [width, height]);

  return (
    <group position={position}>
      <mesh receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#f5f6f3"
          roughness={0.72}
          metalness={0.02}
          side={THREE.FrontSide}
        />
      </mesh>
      <lineSegments position={[0, 0, 0.006]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[gridPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#cbd2d0" transparent opacity={0.62} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

function GlassPanel({ width, height, position }: PanelProps) {
  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <GlassMaterial />
    </mesh>
  );
}

function SurfacePanel({
  glass,
  ...panelProps
}: PanelProps & { glass: boolean }) {
  return glass ? <GlassPanel {...panelProps} /> : <TilePanel {...panelProps} />;
}

function GlassFrame({ width, height }: { width: number; height: number }) {
  const rail = 0.045;
  return (
    <group position={[0, height / 2, 0.026]}>
      <mesh position={[-width / 2, 0, 0]}>
        <boxGeometry args={[rail, height, rail]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[width / 2, 0, 0]}>
        <boxGeometry args={[rail, height, rail]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width + rail, rail, rail]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[0, -height / 2, 0]}>
        <boxGeometry args={[width + rail, rail, rail]} />
        <ChromeMaterial />
      </mesh>
    </group>
  );
}

function DoorLeaf({
  height,
  hingeIsLeft,
  width,
}: {
  height: number;
  hingeIsLeft: boolean;
  width: number;
}) {
  const rail = 0.045;
  const handleX = hingeIsLeft ? width / 2 - 0.23 : -width / 2 + 0.23;
  return (
    <group>
      <mesh>
        <planeGeometry args={[width, height]} />
        <GlassMaterial />
      </mesh>
      <mesh position={[-width / 2, 0, 0.025]}>
        <boxGeometry args={[rail, height, rail]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[width / 2, 0, 0.025]}>
        <boxGeometry args={[rail, height, rail]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[0, height / 2, 0.025]}>
        <boxGeometry args={[width + rail, rail, rail]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[0, -height / 2, 0.025]}>
        <boxGeometry args={[width + rail, rail, rail]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[handleX, 0, 0.1]}>
        <cylinderGeometry args={[0.028, 0.028, Math.min(1.35, height * 0.28), 12]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[handleX, 0.55, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.14, 10]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[handleX, -0.55, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.14, 10]} />
        <ChromeMaterial />
      </mesh>
    </group>
  );
}

function Door({
  height,
  swing,
  width,
}: {
  height: number;
  swing: PlannerState["doorSwing"];
  width: number;
}) {
  const hingeIsLeft = swing.endsWith("left");
  const opensOut = swing.startsWith("out");
  const hingeX = hingeIsLeft ? -width / 2 : width / 2;
  const leafCenterX = hingeIsLeft ? width / 2 : -width / 2;
  const angle = THREE.MathUtils.degToRad(14) * (opensOut ? 1 : -1) * (hingeIsLeft ? 1 : -1);

  return (
    <group>
      <GlassFrame width={width} height={height} />
      <group position={[hingeX, height / 2, 0.04]} rotation={[0, angle, 0]}>
        <group position={[leafCenterX, 0, 0]}>
          <DoorLeaf width={width} height={height} hingeIsLeft={hingeIsLeft} />
        </group>
      </group>
    </group>
  );
}

function wallTransform(wall: Wall, width: number, depth: number): WallTransform {
  switch (wall) {
    case "north":
      return { length: width, position: [0, 0, -depth / 2], rotationY: 0 };
    case "south":
      return { length: width, position: [0, 0, depth / 2], rotationY: Math.PI };
    case "west":
      return { length: depth, position: [-width / 2, 0, 0], rotationY: Math.PI / 2 };
    case "east":
      return { length: depth, position: [width / 2, 0, 0], rotationY: -Math.PI / 2 };
  }
}

function RoomWall({
  depth,
  doorSwing,
  doorWall,
  doorWidth,
  glass,
  height,
  wall,
  width,
}: {
  depth: number;
  doorSwing: PlannerState["doorSwing"];
  doorWall: Wall;
  doorWidth: number;
  glass: boolean;
  height: number;
  wall: Wall;
  width: number;
}) {
  const transform = wallTransform(wall, width, depth);
  const hasDoor = doorWall === wall;
  const safeDoorWidth = Math.min(doorWidth, transform.length - 0.2);
  const doorHeight = Math.min(toSceneUnits(80), height - 0.5);
  const sideWidth = (transform.length - safeDoorWidth) / 2;
  const headerHeight = height - doorHeight;

  return (
    <group position={transform.position} rotation={[0, transform.rotationY, 0]}>
      {hasDoor ? (
        <>
          <SurfacePanel
            width={sideWidth}
            height={height}
            position={[-(safeDoorWidth + sideWidth) / 2, height / 2, 0]}
            glass={glass}
          />
          <SurfacePanel
            width={sideWidth}
            height={height}
            position={[(safeDoorWidth + sideWidth) / 2, height / 2, 0]}
            glass={glass}
          />
          <SurfacePanel
            width={safeDoorWidth}
            height={headerHeight}
            position={[0, doorHeight + headerHeight / 2, 0]}
            glass={glass}
          />
          <Door width={safeDoorWidth} height={doorHeight} swing={doorSwing} />
        </>
      ) : (
        <SurfacePanel width={transform.length} height={height} position={[0, height / 2, 0]} glass={glass} />
      )}
      {glass ? <GlassFrame width={transform.length} height={height} /> : null}
    </group>
  );
}

function Bench({ state, width, depth }: { state: PlannerState; width: number; depth: number }) {
  if (state.bench.type === "none") return null;

  const benchWidth = toSceneUnits(state.bench.widthInches);
  const benchDepth = toSceneUnits(state.bench.depthInches);
  const benchHeight = toSceneUnits(state.bench.heightInches);
  const thickness = 0.18;
  const transform = wallTransform(state.bench.wall, width, depth);
  const isBuiltIn = state.bench.type === "built-in";
  const returnLength = Math.min(benchWidth * 0.58, Math.max(benchDepth * 1.35, 1.5));

  return (
    <group position={transform.position} rotation={[0, transform.rotationY, 0]}>
      <mesh
        position={[0, isBuiltIn ? benchHeight / 2 : benchHeight - thickness / 2, benchDepth / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[benchWidth, isBuiltIn ? benchHeight : thickness, benchDepth]} />
        <meshStandardMaterial color={isBuiltIn ? "#e8ece9" : "#d8dfdc"} roughness={0.68} />
      </mesh>
      {state.bench.type === "floating" ? (
        <mesh position={[0, benchHeight - 0.32, 0.08]} castShadow>
          <boxGeometry args={[Math.max(benchWidth - 0.35, 0.3), 0.08, 0.16]} />
          <meshStandardMaterial color="#778281" roughness={0.45} metalness={0.18} />
        </mesh>
      ) : null}
      {state.bench.type === "corner" ? (
        <mesh
          position={[-benchWidth / 2 + benchDepth / 2, benchHeight - thickness / 2, returnLength / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[benchDepth, thickness, returnLength]} />
          <meshStandardMaterial color="#d8dfdc" roughness={0.68} />
        </mesh>
      ) : null}
    </group>
  );
}

function MountedOnWall({
  children,
  depth,
  position,
  wall,
  width,
}: {
  children: React.ReactNode;
  depth: number;
  position: number;
  wall: Wall;
  width: number;
}) {
  const transform = wallTransform(wall, width, depth);
  const offset = (position - 0.5) * transform.length;
  return (
    <group position={transform.position} rotation={[0, transform.rotationY, 0]}>
      <group position={[offset, 0, 0.055]}>{children}</group>
    </group>
  );
}

function ShowerFixture({ type, roomHeight }: { type: PlannerState["showerType"]; roomHeight: number }) {
  const valveHeight = Math.min(toSceneUnits(48), roomHeight - 2.4);
  const showerHeight = Math.min(toSceneUnits(82), roomHeight - 0.8);
  const valveCount = type === "mechanical" ? 2 : 1;

  return (
    <group>
      <mesh position={[0, valveHeight, 0.012]}>
        <ringGeometry args={[0.34, 0.42, 32]} />
        <meshBasicMaterial color="#23a7a2" transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <mesh position={[0, (valveHeight + showerHeight) / 2, 0.02]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, showerHeight - valveHeight, 12]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[0, showerHeight, 0.27]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.034, 0.034, 0.52, 12]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[0, showerHeight, 0.55]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.075, 24]} />
        <ChromeMaterial />
      </mesh>
      {Array.from({ length: valveCount }, (_, index) => {
        const x = valveCount === 1 ? 0 : (index - 0.5) * 0.38;
        return (
          <group key={x} position={[x, valveHeight, 0.06]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.095, 24]} />
              <ChromeMaterial />
            </mesh>
            <mesh position={[0, 0.05, 0.11]} rotation={[0, 0, -0.25]} castShadow>
              <boxGeometry args={[0.045, 0.26, 0.045]} />
              <ChromeMaterial />
            </mesh>
          </group>
        );
      })}
      {type !== "mechanical" ? (
        <mesh position={[0.43, valveHeight, 0.08]} castShadow>
          <boxGeometry args={[0.28, 0.43, 0.1]} />
          <meshStandardMaterial color="#253031" roughness={0.24} metalness={0.42} />
        </mesh>
      ) : null}
    </group>
  );
}

function SteamControl({ roomHeight }: { roomHeight: number }) {
  const controlHeight = Math.min(toSceneUnits(60), roomHeight - 0.7);
  const envelope = PROCEDURAL_ASSET_DIMENSIONS_INCHES.k32312ControlEnvelope;
  const width = toSceneUnits(envelope.width);
  const height = toSceneUnits(envelope.height);
  const projection = toSceneUnits(envelope.projection);
  return (
    <group position={[0, controlHeight, projection / 2]}>
      <mesh position={[0, 0, -projection / 2 + 0.004]}>
        <ringGeometry args={[Math.max(width, height) * 0.62, Math.max(width, height) * 0.76, 32]} />
        <meshBasicMaterial color="#23a7a2" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[width, height, projection]} />
        <meshStandardMaterial color="#d9dfdd" metalness={0.74} roughness={0.18} />
      </mesh>
      <mesh position={[0, height * 0.07, projection / 2 + 0.003]}>
        <planeGeometry args={[width * 0.72, height * 0.58]} />
        <meshStandardMaterial color="#183638" emissive="#0a5557" emissiveIntensity={0.24} roughness={0.2} />
      </mesh>
      <mesh position={[0, -height * 0.36, projection / 2 + 0.008]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[width * 0.08, width * 0.08, 0.025, 16]} />
        <meshStandardMaterial color="#78b9b7" emissive="#2e7777" emissiveIntensity={0.32} />
      </mesh>
    </group>
  );
}

function SteamHead({ style }: { style: PlannerState["steamHeadStyle"] }) {
  const headHeight = toSceneUnits(6);
  if (style === "round") {
    return (
      <group>
        <mesh position={[0, headHeight, 0.01]}>
          <ringGeometry args={[0.28, 0.36, 32]} />
          <meshBasicMaterial color="#d18a25" transparent opacity={0.2} depthWrite={false} />
        </mesh>
        <mesh position={[0, headHeight, 0.075]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 28]} />
          <ChromeMaterial />
        </mesh>
      </group>
    );
  }

  // Current K-32309/K-32310 face dimensions are captured in data/kohler/controls.json.
  const dimensions = style === "linear"
    ? PROCEDURAL_ASSET_DIMENSIONS_INCHES.k32309LinearHead
    : PROCEDURAL_ASSET_DIMENSIONS_INCHES.k32310SquareHead;
  const width = toSceneUnits(dimensions.width);
  const height = toSceneUnits(dimensions.height);
  const projection = toSceneUnits(dimensions.projection);
  return (
    <group position={[0, headHeight, projection / 2]}>
      <mesh position={[0, 0, -projection / 2 + 0.004]}>
        <ringGeometry args={[Math.max(width, height) * 0.58, Math.max(width, height) * 0.7, 32]} />
        <meshBasicMaterial color="#d18a25" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[width, height, projection]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[0, 0, projection / 2 + 0.003]}>
        <planeGeometry args={[width * 0.7, Math.min(height * 0.24, 0.075)]} />
        <meshStandardMaterial color="#4b5758" roughness={0.42} />
      </mesh>
    </group>
  );
}

function FloorDrain() {
  return (
    <group position={[0, 0.014, 0]}>
      <mesh>
        <cylinderGeometry args={[0.24, 0.24, 0.025, 28]} />
        <ChromeMaterial />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.027, 20]} />
        <meshStandardMaterial color="#677273" metalness={0.68} roughness={0.38} />
      </mesh>
    </group>
  );
}

function SlopedCeiling({ state, width, depth, height }: { state: PlannerState; width: number; depth: number; height: number }) {
  const drop = toSceneUnits(state.ceilingSlopeDropInches);
  const direction = state.ceilingSlopeDirection;
  const run = direction === "north" || direction === "south" ? depth : width;
  const angle = direction === "none" || drop === 0 ? 0 : Math.atan2(drop, run);
  const rotation: EulerTuple =
    direction === "north"
      ? [-angle, 0, 0]
      : direction === "south"
        ? [angle, 0, 0]
        : direction === "west"
          ? [0, 0, angle]
          : direction === "east"
            ? [0, 0, -angle]
            : [0, 0, 0];
  const panelWidth = direction === "east" || direction === "west" ? Math.hypot(width, drop) : width;
  const panelDepth = direction === "north" || direction === "south" ? Math.hypot(depth, drop) : depth;
  const centerHeight = height - drop / 2;

  let lowEdgePosition: Vector3Tuple | null = null;
  let lowEdgeSize: Vector3Tuple = [0, 0, 0];
  switch (direction) {
    case "north":
      lowEdgePosition = [0, height - drop, -depth / 2];
      lowEdgeSize = [width, 0.028, 0.028];
      break;
    case "south":
      lowEdgePosition = [0, height - drop, depth / 2];
      lowEdgeSize = [width, 0.028, 0.028];
      break;
    case "west":
      lowEdgePosition = [-width / 2, height - drop, 0];
      lowEdgeSize = [0.028, 0.028, depth];
      break;
    case "east":
      lowEdgePosition = [width / 2, height - drop, 0];
      lowEdgeSize = [0.028, 0.028, depth];
      break;
    case "none":
      break;
  }

  return (
    <>
      <group position={[0, centerHeight, 0]} rotation={rotation}>
        <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[panelWidth, panelDepth]} />
          <meshStandardMaterial color="#f4f6f3" roughness={0.76} side={THREE.FrontSide} />
        </mesh>
      </group>
      {lowEdgePosition && drop > 0 ? (
        <mesh position={lowEdgePosition}>
          <boxGeometry args={lowEdgeSize} />
          <meshStandardMaterial color="#5d9291" roughness={0.38} metalness={0.12} />
        </mesh>
      ) : null}
    </>
  );
}

function roomPointOnWall(
  wall: Wall,
  position: number,
  width: number,
  depth: number,
): { point: Vector3Tuple; inward: Vector3Tuple } {
  const transform = wallTransform(wall, width, depth);
  const localX = (position - 0.5) * transform.length;
  const cosine = Math.cos(transform.rotationY);
  const sine = Math.sin(transform.rotationY);
  return {
    point: [
      transform.position[0] + localX * cosine,
      toSceneUnits(6),
      transform.position[2] - localX * sine,
    ],
    inward: [sine, 0, cosine],
  };
}

function cameraFrame(state: PlannerState, cameraView: CameraView) {
  const width = toSceneUnits(state.widthInches);
  const depth = toSceneUnits(state.depthInches);
  const height = toSceneUnits(state.heightInches);
  const roomScale = Math.max(width, depth, height);
  const target: Vector3Tuple = [0, height * 0.42, 0];

  if (cameraView === "front") {
    return {
      position: [0, height * 0.46, depth / 2 + roomScale * 1.72] as Vector3Tuple,
      target,
      up: [0, 1, 0] as Vector3Tuple,
      roomScale,
    };
  }
  if (cameraView === "top") {
    return {
      position: [0, height + roomScale * 1.82, 0.001] as Vector3Tuple,
      target: [0, 0, 0] as Vector3Tuple,
      up: [0, 0, -1] as Vector3Tuple,
      roomScale,
    };
  }
  if (cameraView === "steam-head") {
    const mounted = roomPointOnWall(
      state.steamHeadWall,
      state.steamHeadPosition,
      width,
      depth,
    );
    const distance = Math.max(2.2, Math.min(roomScale * 0.78, 7));
    return {
      position: [
        mounted.point[0] + mounted.inward[0] * distance,
        Math.min(height * 0.36, 3.2),
        mounted.point[2] + mounted.inward[2] * distance,
      ] as Vector3Tuple,
      target: mounted.point,
      up: [0, 1, 0] as Vector3Tuple,
      roomScale,
    };
  }

  return {
    position: [roomScale * 1.2, roomScale * 0.95, roomScale * 1.48] as Vector3Tuple,
    target,
    up: [0, 1, 0] as Vector3Tuple,
    roomScale,
  };
}

function CameraController({
  active,
  cameraView,
  reducedMotion,
  state,
}: {
  active: boolean;
  cameraView: CameraView;
  reducedMotion: boolean;
  state: PlannerState;
}) {
  const frame = cameraFrame(state, cameraView);
  const controlsKey = `${cameraView}-${state.widthInches}-${state.depthInches}-${state.heightInches}-${state.steamHeadWall}-${state.steamHeadPosition}`;

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={frame.position}
        up={frame.up}
        fov={cameraView === "steam-head" ? 46 : 38}
        near={0.04}
        far={Math.max(150, frame.roomScale * 24)}
      />
      <OrbitControls
        key={controlsKey}
        makeDefault
        enabled={active}
        target={frame.target}
        enableDamping={!reducedMotion && active}
        dampingFactor={0.08}
        enablePan
        enableRotate
        enableZoom
        minDistance={Math.max(0.8, frame.roomScale * 0.12)}
        maxDistance={frame.roomScale * 5}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2 - 0.015}
        screenSpacePanning
      />
    </>
  );
}

function ContextMonitor({ onUnavailable }: { onUnavailable: (() => void) | undefined }) {
  const renderer = useThree((threeState) => threeState.gl);

  useEffect(() => {
    if (!onUnavailable) return;
    const canvas = renderer.domElement;
    const handleContextLost = () => onUnavailable();
    canvas.addEventListener("webglcontextlost", handleContextLost);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLost);
  }, [onUnavailable, renderer]);

  return null;
}

function RenderAuditMarker() {
  const renderer = useThree((threeState) => threeState.gl);
  useFrame(() => {
    document.documentElement.dataset.sceneTriangles = String(renderer.info.render.triangles);
    document.documentElement.dataset.sceneCalls = String(renderer.info.render.calls);
  });
  return null;
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function SteamRoomScene({
  active,
  onUnavailable,
}: {
  active: boolean;
  onUnavailable: (() => void) | undefined;
}) {
  const state = usePlannerStore((store) => store.present);
  const cameraView = usePlannerStore((store) => store.cameraView);
  const reducedMotion = usePrefersReducedMotion();
  const width = toSceneUnits(state.widthInches);
  const depth = toSceneUnits(state.depthInches);
  const height = toSceneUnits(state.heightInches);
  const doorWidth = toSceneUnits(state.doorWidthInches);
  const glassWalls = new Set(state.glassWalls);
  const shadowScale = Math.max(width, depth) * 1.14;
  const tandem = KOHLER_ADAPTER.recommend(state).generator?.configuration === "tandem";

  return (
    <>
      <ContextMonitor onUnavailable={onUnavailable} />
      <RenderAuditMarker />
      <color attach="background" args={["#edf1ef"]} />
      <fog attach="fog" args={["#edf1ef", Math.max(width, depth, height) * 2.8, Math.max(width, depth, height) * 7]} />
      <ambientLight intensity={0.92} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[0, height * 1.4, depth]} scale={[width * 1.8, height, 1]} />
        <Lightformer form="rect" intensity={0.7} color="#d5ecea" position={[-width, height * 0.8, -depth]} rotation={[0, Math.PI / 2, 0]} scale={[depth, height, 1]} />
      </Environment>
      <hemisphereLight color="#ffffff" groundColor="#85908e" intensity={0.72} />
      <directionalLight
        position={[width * 0.7, height * 1.4, depth * 0.8]}
        intensity={1.18}
        color="#fffdf8"
      />
      <directionalLight position={[-width, height * 0.8, -depth]} intensity={0.35} color="#d7eceb" />

      <group>
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <TilePanel width={width} height={depth} position={[0, 0, 0]} />
        </group>
        {(["north", "east", "south", "west"] as const).map((wall) => (
          <RoomWall
            key={wall}
            wall={wall}
            width={width}
            depth={depth}
            height={height}
            glass={glassWalls.has(wall)}
            doorWall={state.doorWall}
            doorWidth={doorWidth}
            doorSwing={state.doorSwing}
          />
        ))}
        <SlopedCeiling state={state} width={width} depth={depth} height={height} />
        <Bench state={state} width={width} depth={depth} />
        <MountedOnWall wall={state.fixtureWall} position={state.fixturePosition} width={width} depth={depth}>
          <ShowerFixture type={state.showerType} roomHeight={height} />
        </MountedOnWall>
        <MountedOnWall wall={state.controllerWall} position={state.controllerPosition} width={width} depth={depth}>
          <SteamControl roomHeight={height} />
        </MountedOnWall>
        <MountedOnWall wall={state.steamHeadWall} position={state.steamHeadPosition} width={width} depth={depth}>
          <SteamHead style={state.steamHeadStyle} />
        </MountedOnWall>
        {tandem ? (
          <MountedOnWall wall={state.secondarySteamHeadWall} position={state.secondarySteamHeadPosition} width={width} depth={depth}>
            <SteamHead style={state.steamHeadStyle} />
          </MountedOnWall>
        ) : null}
        <FloorDrain />
      </group>

      <ContactShadows
        position={[0, 0.018, 0]}
        opacity={0.28}
        scale={shadowScale}
        blur={2.5}
        far={height + 1}
        resolution={512}
        frames={1}
        color="#35403f"
      />
      <CameraController
        active={active}
        cameraView={cameraView}
        reducedMotion={reducedMotion}
        state={state}
      />
    </>
  );
}

export function SteamRoomCanvas({
  active = true,
  className,
  onUnavailable,
}: SteamRoomCanvasProps) {
  const classes = ["steam-room-canvas", className].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      data-testid="three-canvas"
      role="img"
      aria-label="Interactive three-dimensional steam room preview. Use the standard view buttons for keyboard-accessible viewpoints."
    >
      <Canvas
        aria-hidden="true"
        dpr={[1, 1.75]}
        frameloop={active ? "demand" : "never"}
        camera={{ fov: 38, near: 0.04, far: 250, position: [8, 7, 10] }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
        performance={{ min: 0.55, max: 1, debounce: 180 }}
        fallback={<PlanView className="steam-room-canvas__fallback" variant="plan" />}
      >
        <SteamRoomScene active={active} onUnavailable={onUnavailable} />
      </Canvas>
    </div>
  );
}

export default SteamRoomCanvas;
