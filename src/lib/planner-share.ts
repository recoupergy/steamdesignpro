import type { PlannerState } from "@/lib/planner-schema";

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function encodePlannerState(state: PlannerState) {
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(state)));
}

export function sharePathForState(state: PlannerState) {
  return `/design?v=1&s=${encodeURIComponent(encodePlannerState(state))}`;
}
