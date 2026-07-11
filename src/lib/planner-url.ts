import {
  DEFAULT_PLANNER_STATE,
  STARTER_CONFIGURATIONS,
  constrainPlannerState,
  type PlannerState,
} from "@/lib/planner-schema";
import { plannerStateSchema } from "@/lib/planner-validation";
export { encodePlannerState, sharePathForState } from "@/lib/planner-share";

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function decodePlannerState(value: string): PlannerState | null {
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(value));
    return constrainPlannerState(plannerStateSchema.parse(JSON.parse(json)));
  } catch {
    return null;
  }
}

export function parsePlannerState(value: unknown): PlannerState | null {
  const parsed = plannerStateSchema.safeParse(value);
  return parsed.success ? constrainPlannerState(parsed.data) : null;
}

export function stateFromSearchParams(params: URLSearchParams) {
  if (params.get("v") !== "1") return DEFAULT_PLANNER_STATE;
  const serialized = params.get("s");
  if (serialized) return decodePlannerState(serialized) ?? DEFAULT_PLANNER_STATE;
  const starter = params.get("starter");
  if (starter && starter in STARTER_CONFIGURATIONS) {
    return STARTER_CONFIGURATIONS[starter as keyof typeof STARTER_CONFIGURATIONS];
  }
  return DEFAULT_PLANNER_STATE;
}
