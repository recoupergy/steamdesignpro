import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

async function canvasSignature(canvas: Locator) {
  return canvas.evaluate((element) => {
    if (!(element instanceof HTMLCanvasElement)) throw new Error("Canvas element missing");
    const sample = document.createElement("canvas");
    sample.width = 96;
    sample.height = 64;
    const context = sample.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("2D sampling context unavailable");
    context.drawImage(element, 0, 0, sample.width, sample.height);
    const pixels = context.getImageData(0, 0, sample.width, sample.height).data;
    let hash = 2166136261;
    let nonTransparent = 0;
    let luminanceSum = 0;
    let luminanceSquared = 0;
    const colors = new Set<string>();
    for (let index = 0; index < pixels.length; index += 16) {
      const red = pixels[index] ?? 0;
      const green = pixels[index + 1] ?? 0;
      const blue = pixels[index + 2] ?? 0;
      const alpha = pixels[index + 3] ?? 0;
      hash ^= red + green * 3 + blue * 7 + alpha * 11;
      hash = Math.imul(hash, 16777619);
      if (alpha > 0) nonTransparent += 1;
      const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      luminanceSum += luminance;
      luminanceSquared += luminance * luminance;
      colors.add(`${red >> 4}-${green >> 4}-${blue >> 4}`);
    }
    const count = pixels.length / 16;
    const mean = luminanceSum / count;
    const variance = luminanceSquared / count - mean * mean;
    return { hash: hash >>> 0, nonTransparent, variance, colorBuckets: colors.size };
  });
}

async function waitForScene(page: Page) {
  const loadButton = page.getByRole("button", { name: "Load interactive 3D" });
  await loadButton.waitFor({ state: "visible", timeout: 2_000 }).catch(() => undefined);
  if (await loadButton.isVisible()) {
    await loadButton.click();
  }
  const canvas = page.locator("[data-testid='three-canvas'] canvas");
  await expect(canvas).toBeVisible({ timeout: 30_000 });
  await expect.poll(async () => (await canvasSignature(canvas)).colorBuckets, { timeout: 30_000 }).toBeGreaterThan(12);
  return canvas;
}

test.describe("live steam-shower planner", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?v=1&starter=compact");
    await expect(page.getByRole("heading", { name: "Plan the enclosure" })).toBeVisible();
  });

  test("renders a nonblank, framed, moving scene without UI overlap", async ({ page }, testInfo) => {
    const canvas = await waitForScene(page);
    const initial = await canvasSignature(canvas);
    expect(initial.nonTransparent).toBeGreaterThan(1000);
    expect(initial.variance).toBeGreaterThan(20);

    await page.getByRole("button", { name: "Front", exact: true }).click();
    await expect.poll(async () => (await canvasSignature(canvas)).hash).not.toBe(initial.hash);
    const front = await canvasSignature(canvas);
    expect(front.colorBuckets).toBeGreaterThan(12);
    const renderAudit = await page.evaluate(() => ({
      triangles: Number(document.documentElement.dataset.sceneTriangles ?? 0),
      calls: Number(document.documentElement.dataset.sceneCalls ?? 0),
    }));
    expect(renderAudit.triangles).toBeGreaterThan(0);
    expect(renderAudit.triangles).toBeLessThan(100_000);

    const canvasBox = await canvas.boundingBox();
    const toolbarBox = await page.locator(".scene-viewport__toolbar").boundingBox();
    const controlsBox = await page.locator(".controls-rail").boundingBox();
    const resultsBox = await page.locator(".results-rail").boundingBox();
    expect(canvasBox).not.toBeNull();
    expect(toolbarBox).not.toBeNull();
    if (canvasBox && toolbarBox) expect(toolbarBox.y + toolbarBox.height).toBeLessThanOrEqual(canvasBox.y + 1);
    if (canvasBox && controlsBox && testInfo.project.name === "desktop") expect(controlsBox.x + controlsBox.width).toBeLessThanOrEqual(canvasBox.x + 1);
    if (canvasBox && resultsBox && testInfo.project.name === "desktop") expect(canvasBox.x + canvasBox.width).toBeLessThanOrEqual(resultsBox.x + 1);

    const screenshotDirectory = path.join(process.cwd(), "artifacts", "screenshots");
    await mkdir(screenshotDirectory, { recursive: true });
    await writeFile(path.join(screenshotDirectory, `scene-audit-${testInfo.project.name}.json`), `${JSON.stringify(renderAudit, null, 2)}\n`);
    await page.getByRole("button", { name: "Perspective", exact: true }).click();
    await expect.poll(async () => (await canvasSignature(canvas)).hash).not.toBe(front.hash);
    await page.screenshot({ path: path.join(screenshotDirectory, `planner-${testInfo.project.name}.png`), fullPage: false });
    await canvas.screenshot({ path: path.join(screenshotDirectory, `canvas-${testInfo.project.name}.png`) });
  });

  test("updates dimensions, recommendation, URL state, and history", async ({ page }, testInfo) => {
    const width = page.locator(".dimension-grid").first().getByLabel("Width");
    await expect(width).toHaveValue("4");
    await width.fill("6");
    await width.blur();
    const visibleResult = testInfo.project.name === "mobile" ? page.locator(".mobile-result-peek") : page.locator(".results-rail");
    await expect(visibleResult.getByText("168.0 ft³", { exact: true })).toBeVisible();
    await expect(page).toHaveURL(/\?v=1&s=/);
    await page.getByRole("button", { name: "Undo", exact: true }).click();
    await expect(width).toHaveValue("4");
    await page.getByRole("button", { name: "Redo", exact: true }).click();
    await expect(width).toHaveValue("6");
    await page.getByRole("button", { name: "Metric", exact: true }).click();
    await page.getByText("Ceiling & generator", { exact: true }).click();
    await expect(page.getByRole("spinbutton", { name: /Routed distance/ })).toHaveValue("3.05");
    await expect(visibleResult.getByText("4.76 m³", { exact: true })).toBeVisible();
  });

  test("provides keyboard-accessible measured plan and elevation fallbacks", async ({ page }) => {
    const threeTab = page.getByRole("tab", { name: "3D", exact: true });
    await threeTab.focus();
    await threeTab.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Plan", exact: true })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("plan-view")).toBeVisible();
    await expect(page.getByText("Dimensioned floor plan")).toBeVisible();
    await page.getByRole("tab", { name: "Elevation", exact: true }).click();
    await expect(page.getByText(/wall elevation/i)).toBeVisible();

    const width = page.locator(".dimension-grid").first().getByLabel("Width");
    await width.focus();
    await expect(width.locator("xpath=..")).toHaveCSS("outline-style", "solid");
  });

  test("keeps the drawing toolbar inside a 320px viewport", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "The minimum-width assertion runs once with mobile browser semantics.");
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/?v=1&starter=compact");
    const toolbar = page.locator(".scene-viewport__toolbar");
    await expect(toolbar).toBeVisible();
    const toolbarBox = await toolbar.boundingBox();
    expect(toolbarBox?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((toolbarBox?.x ?? 0) + (toolbarBox?.width ?? 321)).toBeLessThanOrEqual(320);
    for (const button of await toolbar.getByRole("button").all()) {
      const box = await button.boundingBox();
      expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
      expect((box?.x ?? 0) + (box?.width ?? 321)).toBeLessThanOrEqual(320);
    }
  });

  test("exports the deterministic planning PDF on demand", async ({ page }) => {
    await waitForScene(page);
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export project PDF" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("steamdesignpro-project.pdf");
    const saved = await download.path();
    expect(saved).toBeTruthy();
    if (!saved) return;
    const bytes = await readFile(saved);
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    expect(bytes.byteLength).toBeGreaterThan(20_000);
  });

  test("has no automatically detectable WCAG A/AA violations", async ({ page }) => {
    await page.getByRole("tab", { name: "Plan", exact: true }).click();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
});
