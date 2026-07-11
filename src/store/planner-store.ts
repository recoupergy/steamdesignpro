"use client";

import {
  DEFAULT_PLANNER_STATE,
  STARTER_CONFIGURATIONS,
  constrainPlannerState,
  type PlannerState,
} from "@/lib/planner-schema";
import { KOHLER_ADAPTER } from "@/lib/kohler/adapter";
import { create } from "zustand";

type CameraView = "perspective" | "front" | "top" | "steam-head";
type SceneMode = "3d" | "plan" | "elevation";
type MobileTab = "design" | "results" | "details";

interface PlannerStore {
  present: PlannerState;
  past: PlannerState[];
  future: PlannerState[];
  hydrated: boolean;
  cameraView: CameraView;
  sceneMode: SceneMode;
  mobileTab: MobileTab;
  initialize: (state: PlannerState) => void;
  update: (update: Partial<PlannerState> | ((state: PlannerState) => PlannerState)) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  loadStarter: (starter: keyof typeof STARTER_CONFIGURATIONS) => void;
  setCameraView: (view: CameraView) => void;
  setSceneMode: (mode: SceneMode) => void;
  setMobileTab: (tab: MobileTab) => void;
}

function normalizeForFinalSpecification(candidate: PlannerState) {
  const constrained = constrainPlannerState(candidate);
  const recommendation = KOHLER_ADAPTER.recommend(constrained);
  const compatibleFinish = recommendation.accessoryPackage?.selectedFinish;
  if (compatibleFinish && compatibleFinish !== constrained.finish) {
    return { ...constrained, finish: compatibleFinish as PlannerState["finish"] };
  }
  return constrained;
}

function sameState(left: PlannerState, right: PlannerState) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export const usePlannerStore = create<PlannerStore>((set) => ({
  present: DEFAULT_PLANNER_STATE,
  past: [],
  future: [],
  hydrated: false,
  cameraView: "perspective",
  sceneMode: "3d",
  mobileTab: "design",
  initialize: (state) =>
    set({
      present: normalizeForFinalSpecification(state),
      past: [],
      future: [],
      hydrated: true,
    }),
  update: (update) =>
    set((store) => {
      const candidate = typeof update === "function" ? update(store.present) : { ...store.present, ...update };
      const next = normalizeForFinalSpecification(candidate);
      if (sameState(store.present, next)) return store;
      return {
        present: next,
        past: [...store.past.slice(-49), store.present],
        future: [],
      };
    }),
  undo: () =>
    set((store) => {
      const previous = store.past.at(-1);
      if (!previous) return store;
      return {
        present: previous,
        past: store.past.slice(0, -1),
        future: [store.present, ...store.future].slice(0, 50),
      };
    }),
  redo: () =>
    set((store) => {
      const next = store.future[0];
      if (!next) return store;
      return {
        present: next,
        past: [...store.past.slice(-49), store.present],
        future: store.future.slice(1),
      };
    }),
  reset: () =>
    set((store) => ({
      present: DEFAULT_PLANNER_STATE,
      past: [...store.past.slice(-49), store.present],
      future: [],
      cameraView: "perspective",
    })),
  loadStarter: (starter) =>
    set((store) => ({
      present: normalizeForFinalSpecification(STARTER_CONFIGURATIONS[starter]),
      past: [...store.past.slice(-49), store.present],
      future: [],
      cameraView: "perspective",
    })),
  setCameraView: (cameraView) => set({ cameraView }),
  setSceneMode: (sceneMode) => set({ sceneMode }),
  setMobileTab: (mobileTab) => set({ mobileTab }),
}));
