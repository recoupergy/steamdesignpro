"use client";

import { usePlannerStore } from "@/store/planner-store";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import { PlanView } from "./plan-view";

type SceneMode = "3d" | "plan" | "elevation";
type CameraView = "perspective" | "front" | "top" | "steam-head";

interface SceneViewportProps {
  className?: string;
}

const SCENE_MODES: readonly { label: string; value: SceneMode }[] = [
  { label: "3D", value: "3d" },
  { label: "Plan", value: "plan" },
  { label: "Elevation", value: "elevation" },
];

const CAMERA_VIEWS: readonly { label: string; value: CameraView }[] = [
  { label: "Perspective", value: "perspective" },
  { label: "Front", value: "front" },
  { label: "Top", value: "top" },
  { label: "Steam head", value: "steam-head" },
];

const DynamicSteamRoomCanvas = dynamic(
  () => import("./steam-room-canvas").then((module) => module.SteamRoomCanvas),
  {
    ssr: false,
    loading: () => <PlanView className="scene-viewport__loading-plan" variant="plan" />,
  },
);

function canCreateWebGL2Context() {
  if (typeof window === "undefined" || !window.WebGL2RenderingContext) return false;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", {
      antialias: true,
      failIfMajorPerformanceCaveat: false,
      powerPreference: "high-performance",
    });
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return context !== null;
  } catch {
    return false;
  }
}

function useViewportActivity(elementRef: RefObject<HTMLElement | null>) {
  const [intersecting, setIntersecting] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry?.isIntersecting ?? false),
      { rootMargin: "120px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef]);

  useEffect(() => {
    const handleVisibility = () => setDocumentVisible(document.visibilityState !== "hidden");
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return intersecting && documentVisible;
}

export function SceneViewport({ className }: SceneViewportProps) {
  const sceneMode = usePlannerStore((store) => store.sceneMode);
  const cameraView = usePlannerStore((store) => store.cameraView);
  const setSceneMode = usePlannerStore((store) => store.setSceneMode);
  const setCameraView = usePlannerStore((store) => store.setCameraView);
  const rootRef = useRef<HTMLElement>(null);
  const active = useViewportActivity(rootRef);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [threeRequested, setThreeRequested] = useState<boolean | null>(null);
  const id = useId().replaceAll(":", "");
  const panelId = `scene-panel-${id}`;
  const classes = ["scene-viewport", className].filter(Boolean).join(" ");

  useEffect(() => {
    const detectTimeout = window.setTimeout(() => {
      setWebglSupported(canCreateWebGL2Context());
      setThreeRequested(false);
    }, 0);
    const desktopAutoLoad = window.matchMedia("(min-width: 921px)").matches
      ? window.setTimeout(() => setThreeRequested(true), 4_500)
      : undefined;
    return () => {
      window.clearTimeout(detectTimeout);
      if (desktopAutoLoad !== undefined) window.clearTimeout(desktopAutoLoad);
    };
  }, []);

  useEffect(() => {
    const requestThree = () => setThreeRequested(true);
    window.addEventListener("steamdesignpro:request-3d", requestThree);
    return () => window.removeEventListener("steamdesignpro:request-3d", requestThree);
  }, []);

  const handleUnavailable = useCallback(() => setWebglSupported(false), []);

  const handleModeKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % SCENE_MODES.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + SCENE_MODES.length) % SCENE_MODES.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = SCENE_MODES.length - 1;
    }
    if (nextIndex === null) return;
    const nextMode = SCENE_MODES[nextIndex];
    if (!nextMode) return;
    event.preventDefault();
    setSceneMode(nextMode.value);
    document.getElementById(`scene-mode-${nextMode.value}-${id}`)?.focus();
  };

  let viewportContent: React.ReactNode;
  if (sceneMode === "plan") {
    viewportContent = <PlanView variant="plan" />;
  } else if (sceneMode === "elevation") {
    viewportContent = <PlanView variant="elevation" />;
  } else if (webglSupported && threeRequested) {
    viewportContent = <DynamicSteamRoomCanvas active={active} onUnavailable={handleUnavailable} />;
  } else {
    viewportContent = <PlanView className="scene-viewport__webgl-fallback" variant="plan" />;
  }

  return (
    <section ref={rootRef} className={classes} data-testid="scene-viewport" aria-label="Steam room drawing">
      <header className="scene-viewport__toolbar">
        <div className="scene-viewport__mode-switch" role="tablist" aria-label="Drawing mode">
          {SCENE_MODES.map((option, index) => (
            <button
              key={option.value}
              id={`scene-mode-${option.value}-${id}`}
              className="scene-viewport__mode-button"
              type="button"
              role="tab"
              aria-controls={panelId}
              aria-selected={sceneMode === option.value}
              tabIndex={sceneMode === option.value ? 0 : -1}
              onClick={() => {
                setSceneMode(option.value);
                if (option.value === "3d") setThreeRequested(true);
              }}
              onKeyDown={(event) => handleModeKeyDown(event, index)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {sceneMode === "3d" ? (
          <div className="scene-viewport__camera-switch" role="group" aria-label="Standard 3D views">
            <button
              className="scene-viewport__camera-button"
              type="button"
              onClick={() => {
                setThreeRequested(true);
                setCameraView("perspective");
              }}
            >
              Reset
            </button>
            {CAMERA_VIEWS.map((option) => (
              <button
                key={option.value}
                className="scene-viewport__camera-button"
                type="button"
                aria-pressed={cameraView === option.value}
                onClick={() => {
                  setThreeRequested(true);
                  setCameraView(option.value);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </header>

      <div
        id={panelId}
        className="scene-viewport__stage"
        role="tabpanel"
        aria-labelledby={`scene-mode-${sceneMode}-${id}`}
        aria-busy={sceneMode === "3d" && (webglSupported === null || threeRequested === null)}
      >
        {viewportContent}
      </div>

      {sceneMode === "3d" && webglSupported && threeRequested === false ? (
        <div className="scene-viewport__deferred-bar">
          <span className="sr-only" role="status">
            The measured plan is ready. Load the interactive 3D model when you need it.
          </span>
          <span aria-hidden="true">3D ready</span>
          <button type="button" onClick={() => setThreeRequested(true)}>Load interactive 3D</button>
        </div>
      ) : null}

      {sceneMode === "3d" && webglSupported === false ? (
        <p className="scene-viewport__fallback-notice" role="status">
          3D preview is unavailable in this browser. The measured floor plan remains fully available.
        </p>
      ) : null}
    </section>
  );
}

export default SceneViewport;
