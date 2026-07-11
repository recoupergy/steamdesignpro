import type { ManufacturerAdapter, SpecificationItem } from "@/lib/manufacturer-adapter";
import type { PlannerState } from "@/lib/planner-schema";
import { resolveKohlerAccessoryPackage } from "./controls";
import { sizeKohlerGenerator } from "./sizing";

export const KOHLER_ADAPTER: ManufacturerAdapter = {
  id: "kohler-invigoration",
  displayName: "KOHLER Invigoration Series",
  recommend(state: PlannerState) {
    const sizing = sizeKohlerGenerator(state);
    const generator = sizing.recommendedGenerator;
    const resolved = generator ? resolveKohlerAccessoryPackage(state, generator) : null;
    const warnings = [...sizing.warnings];

    if (generator && !resolved) {
      warnings.push({
        id: "accessory-compatibility",
        severity: "stop",
        title: "No valid controller and steam-head package",
        detail: "The selected shower system and steam-head style do not produce a current documented KOHLER package.",
      });
    }

    if (resolved?.requestedFinishAdjusted) {
      warnings.push({
        id: "finish-adjustment",
        severity: "information",
        title: "Finish changed to a compatible option",
        detail: `The requested finish is not listed on every item in this package. The final specification uses ${resolved.selectedFinish}.`,
        sourceUrl: resolved.control.specUrl,
      });
    }

    const items: SpecificationItem[] = [];
    if (generator) {
      items.push({
        sku: generator.sku,
        name: generator.name,
        quantity: 1,
        sourceUrl: generator.specUrl,
      });
      items.push({
        sku: generator.drainPanSku,
        name: `${generator.drainPanStatus === "required" ? "Required" : "Recommended"} drain pan`,
        quantity: generator.drainPans,
        sourceUrl:
          generator.drainPanSku === "K-5559-NA"
            ? "https://www.studiokohler.com/en-us/steam-generators/5559-kohler-plumbinguscanada"
            : "https://www.studiokohler.com/en-us/steam-generators/5562-kohler-plumbinguscanada",
      });
    }
    if (resolved) {
      items.push({
        sku: `${resolved.control.sku}-${resolved.selectedFinish}`,
        name: resolved.control.name,
        quantity: 1,
        sourceUrl: resolved.control.specUrl,
      });
      if (resolved.steamHead) {
        items.push({
          sku: `${resolved.steamHead.sku}-${resolved.selectedFinish}`,
          name: resolved.steamHead.name,
          quantity: resolved.separateSteamHeads,
          sourceUrl: resolved.steamHead.specUrl,
        });
      }
    }

    return {
      ...sizing,
      manufacturerId: this.id,
      generator,
      accessoryPackage: resolved
        ? {
            controlSku: resolved.control.sku,
            steamHeadSku: resolved.steamHead?.sku ?? null,
            includedSteamHeads: resolved.includedSteamHeads,
            separateSteamHeads: resolved.separateSteamHeads,
            availableFinishes: resolved.availableFinishes,
            selectedFinish: resolved.selectedFinish,
            requestedFinishAdjusted: resolved.requestedFinishAdjusted,
            items,
          }
        : null,
      needsManufacturerReview: sizing.needsManufacturerReview || !resolved,
      warnings,
    };
  },
};
