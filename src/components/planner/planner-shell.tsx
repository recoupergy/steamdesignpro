"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  FileText,
  Info,
  Redo2,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Undo2,
} from "lucide-react";
import { KOHLER_ADAPTER } from "@/lib/kohler/adapter";
import { DEFAULT_PLANNER_STATE } from "@/lib/planner-schema";
import { sharePathForState } from "@/lib/planner-share";
import { usePlannerStore } from "@/store/planner-store";
import { PlannerControls } from "./planner-controls";
import { RecommendationSummary } from "./recommendation-summary";
import { SceneViewport } from "./scene-viewport";

const AUTOSAVE_KEY = "steamdesignpro:planner:v1";

async function waitForSnapshotCanvas() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const canvas =
      document.querySelector<HTMLCanvasElement>("[data-testid='three-canvas'] canvas") ??
      document.querySelector<HTMLCanvasElement>("canvas[data-testid='three-canvas']");
    if (canvas && canvas.width > 0 && canvas.height > 0) return canvas;
    await new Promise<void>((resolve) => window.setTimeout(resolve, 100));
  }
  return null;
}

export function PlannerShell() {
  const state = usePlannerStore((store) => store.present);
  const past = usePlannerStore((store) => store.past);
  const future = usePlannerStore((store) => store.future);
  const hydrated = usePlannerStore((store) => store.hydrated);
  const initialize = usePlannerStore((store) => store.initialize);
  const undo = usePlannerStore((store) => store.undo);
  const redo = usePlannerStore((store) => store.redo);
  const reset = usePlannerStore((store) => store.reset);
  const mobileTab = usePlannerStore((store) => store.mobileTab);
  const setMobileTab = usePlannerStore((store) => store.setMobileTab);
  const initialized = useRef(false);
  const [shareStatus, setShareStatus] = useState("");
  const [exporting, setExporting] = useState(false);
  const recommendation = useMemo(() => KOHLER_ADAPTER.recommend(state), [state]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const params = new URLSearchParams(window.location.search);
    const hasExplicitUrlState =
      params.get("v") === "1" && Boolean(params.get("s") || params.get("starter"));
    let savedState: string | null = null;
    if (!hasExplicitUrlState) {
      try {
        savedState = window.localStorage.getItem(AUTOSAVE_KEY);
      } catch {
        // An unavailable local store must never block the planner.
      }
    }
    if (!hasExplicitUrlState && !savedState) {
      initialize(DEFAULT_PLANNER_STATE);
      return;
    }
    let cancelled = false;
    void import("@/lib/planner-url").then(({ parsePlannerState, stateFromSearchParams }) => {
      let nextState = hasExplicitUrlState
        ? stateFromSearchParams(params)
        : DEFAULT_PLANNER_STATE;
      if (!hasExplicitUrlState && savedState) {
        try {
          nextState = parsePlannerState(JSON.parse(savedState)) ?? nextState;
        } catch {
          // A corrupt local store must never block the planner.
        }
      }
      if (!cancelled) initialize(nextState);
    });
    return () => { cancelled = true; };
  }, [initialize]);

  useEffect(() => {
    if (!hydrated) return;
    const saveLocally = () => {
      try {
        window.localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(state));
      } catch {
        // Private browsing or storage policy may disable autosave; URL state still works.
      }
    };
    const syncUrl = () => {
      const path = sharePathForState(state);
      if (`${window.location.pathname}${window.location.search}` !== path) {
        window.history.replaceState(window.history.state, "", path);
      }
    };
    const timeout = window.setTimeout(() => {
      saveLocally();
      syncUrl();
    }, 300);
    window.addEventListener("pagehide", saveLocally);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("pagehide", saveLocally);
      saveLocally();
    };
  }, [hydrated, state]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [redo, undo]);

  async function shareProject() {
    const url = new URL(sharePathForState(state), window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("Project link copied");
    } catch {
      window.prompt("Copy this project link", url);
      setShareStatus("Project link ready to copy");
    }
    window.setTimeout(() => setShareStatus(""), 2500);
  }

  async function exportPdf() {
    setExporting(true);
    setShareStatus("Preparing 3D snapshot and PDF");
    try {
      window.dispatchEvent(new Event("steamdesignpro:request-3d"));
      const canvas = await waitForSnapshotCanvas();
      let snapshotDataUrl: string | undefined;
      try {
        snapshotDataUrl = canvas?.toDataURL("image/png");
      } catch {
        snapshotDataUrl = undefined;
      }
      const { createProjectPdf } = await import("@/lib/export-project");
      const input = snapshotDataUrl
        ? { state, recommendation, snapshotDataUrl }
        : { state, recommendation };
      const bytes = await createProjectPdf(input);
      const blob = new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer], {
        type: "application/pdf",
      });
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = "steamdesignpro-project.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
      setShareStatus("PDF exported");
    } catch {
      setShareStatus("PDF export could not be completed. Try again.");
    } finally {
      setExporting(false);
      window.setTimeout(() => setShareStatus(""), 3000);
    }
  }

  return (
    <div className="planner-app" data-mobile-tab={mobileTab}>
      <header className="app-header">
        <div className="project-title">
          <span className="live-indicator" aria-hidden="true" />
          <div><strong>Live planner</strong><span>KOHLER Invigoration Series</span></div>
        </div>
        <div className="app-actions" role="toolbar" aria-label="Project actions">
          <button type="button" onClick={undo} disabled={!past.length} aria-label="Undo" aria-keyshortcuts="Control+Z Meta+Z">
            <Undo2 aria-hidden="true" />
            <span>Undo</span>
          </button>
          <button type="button" onClick={redo} disabled={!future.length} aria-label="Redo" aria-keyshortcuts="Control+Y Meta+Shift+Z">
            <Redo2 aria-hidden="true" />
            <span>Redo</span>
          </button>
          <button type="button" onClick={reset} aria-label="Reset project">
            <RotateCcw aria-hidden="true" />
            <span>Reset</span>
          </button>
          <button type="button" onClick={shareProject} aria-label="Copy shareable project link">
            <Share2 aria-hidden="true" />
            <span>Share</span>
          </button>
          <button type="button" onClick={exportPdf} disabled={exporting} className="primary-action" aria-label="Export project PDF">
            <Download aria-hidden="true" />
            <span>{exporting ? "Exporting…" : "PDF"}</span>
          </button>
        </div>
        <p className="sr-only" aria-live="polite">{shareStatus}</p>
      </header>

      <main className="planner-workspace">
        <aside className="controls-rail" aria-label="Planner inputs">
          <PlannerControls recommendation={recommendation} />
        </aside>
        <section className="scene-panel" aria-label="Interactive steam shower model">
          <SceneViewport />
        </section>
        <nav className="mobile-tabs" aria-label="Planner panels">
          <button type="button" aria-pressed={mobileTab === "design"} onClick={() => setMobileTab("design")}>
            <SlidersHorizontal aria-hidden="true" /> Design
          </button>
          <button type="button" aria-pressed={mobileTab === "results"} onClick={() => setMobileTab("results")}>
            <FileText aria-hidden="true" /> Results
          </button>
          <button type="button" aria-pressed={mobileTab === "details"} onClick={() => setMobileTab("details")}>
            <Info aria-hidden="true" /> More
          </button>
        </nav>
        <button type="button" className="mobile-result-peek" onClick={() => setMobileTab("results")}>
          <span>
            <small>Preliminary recommendation</small>
            <strong>{recommendation.generator?.sku ?? "Manufacturer review"}</strong>
          </span>
          <span>
            <small>Room volume</small>
            <strong>{state.units === "metric" ? `${recommendation.baseVolumeCubicMeters.toFixed(2)} m³` : `${recommendation.baseVolumeCuFt.toFixed(1)} ft³`}</strong>
          </span>
          <span aria-hidden="true">View →</span>
        </button>
        <aside className="results-rail" aria-label="Recommendation and checks">
          <RecommendationSummary state={state} recommendation={recommendation} />
        </aside>
        <aside className="details-panel" aria-label="Planning limits and resources">
          <p className="eyebrow">Before construction</p>
          <h2>Coordinate the complete assembly</h2>
          <p>
            Use this plan to start conversations with the manufacturer and licensed project professionals. Current manuals, actual site conditions, local code, and the authority having jurisdiction control.
          </p>
          <div className="details-links">
            <Link href="/steam-shower-checklist"><FileText aria-hidden="true" /> Coordination checklist</Link>
            <Link href="/sources"><Info aria-hidden="true" /> Source revisions</Link>
            <Link href="/terms"><Info aria-hidden="true" /> Planning terms</Link>
          </div>
        </aside>
      </main>

      <div className="independence-notice">
        <p>
          Independent preliminary planning aid by SaunaShare, Inc. Not affiliated with, endorsed, certified, or authorized by Kohler Co. Not construction or professional documentation.
        </p>
        <Link href="/terms">Full limitations</Link>
      </div>
    </div>
  );
}
