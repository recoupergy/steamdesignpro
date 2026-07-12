import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const url = process.env.LIGHTHOUSE_URL ?? "http://127.0.0.1:3108/";
const mode = process.env.LIGHTHOUSE_MODE === "desktop" ? "desktop" : "mobile";
const artifactPrefix = (process.env.LIGHTHOUSE_ARTIFACT_PREFIX ?? mode).replace(/[^a-z0-9-]/gi, "-");
const outputDirectory = path.join(process.cwd(), "artifacts", "lighthouse");
await mkdir(outputDirectory, { recursive: true });

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu-sandbox", "--disable-dev-shm-usage"],
});

try {
  const screenEmulation =
    mode === "desktop"
      ? { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }
      : { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false };
  const result = await lighthouse(url, {
    port: chrome.port,
    output: ["json", "html"],
    logLevel: "info",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    formFactor: mode,
    screenEmulation,
    throttlingMethod: "simulate",
  });
  if (!result) throw new Error("Lighthouse did not return a report.");
  const [jsonReport, htmlReport] = result.report;
  if (typeof jsonReport !== "string" || typeof htmlReport !== "string") throw new Error("Unexpected Lighthouse report output.");
  await writeFile(path.join(outputDirectory, `${artifactPrefix}.json`), jsonReport);
  await writeFile(path.join(outputDirectory, `${artifactPrefix}.html`), htmlReport);

  const { lhr } = result;
  const categoryScore = (id) => Math.round((lhr.categories[id]?.score ?? 0) * 100);
  const numeric = (id) => lhr.audits[id]?.numericValue ?? null;
  const summary = {
    url: lhr.finalDisplayedUrl,
    mode,
    generatedAt: new Date().toISOString(),
    scores: {
      performance: categoryScore("performance"),
      accessibility: categoryScore("accessibility"),
      bestPractices: categoryScore("best-practices"),
      seo: categoryScore("seo"),
    },
    metrics: {
      firstContentfulPaintMs: numeric("first-contentful-paint"),
      largestContentfulPaintMs: numeric("largest-contentful-paint"),
      totalBlockingTimeMs: numeric("total-blocking-time"),
      cumulativeLayoutShift: numeric("cumulative-layout-shift"),
      speedIndexMs: numeric("speed-index"),
    },
    note: "Lighthouse is a lab test. Total Blocking Time is reported as an interactivity proxy; field INP requires real-user measurement.",
  };
  await writeFile(path.join(outputDirectory, `${artifactPrefix}-summary.json`), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));

  if ((summary.metrics.largestContentfulPaintMs ?? Infinity) > 2500) process.exitCode = 2;
  if ((summary.metrics.cumulativeLayoutShift ?? Infinity) > 0.1) process.exitCode = 3;
  if (summary.scores.accessibility < 95 || summary.scores.seo < 95) process.exitCode = 4;
} finally {
  await chrome.kill();
}
