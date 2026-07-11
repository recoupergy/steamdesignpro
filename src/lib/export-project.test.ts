import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { DEFAULT_PLANNER_STATE } from "./planner-schema";
import { KOHLER_ADAPTER } from "./kohler/adapter";
import { createProjectPdf } from "./export-project";

describe("project PDF export", () => {
  it("creates a deterministic four-page PDF with inputs, drawings, specification, and sources", async () => {
    const input = {
      state: DEFAULT_PLANNER_STATE,
      recommendation: KOHLER_ADAPTER.recommend(DEFAULT_PLANNER_STATE),
    };
    const first = await createProjectPdf(input);
    const second = await createProjectPdf(input);
    expect(new TextDecoder().decode(first.slice(0, 5))).toBe("%PDF-");
    expect(first).toEqual(second);
    const document = await PDFDocument.load(first);
    expect(document.getPageCount()).toBe(4);
    expect(document.getTitle()).toBe("SteamDesignPro preliminary planning record");
  });
});
