import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { ManufacturerRecommendation } from "@/lib/manufacturer-adapter";
import { formatUsd } from "@/lib/kohler/pricing";
import { feetToInputDistance, type PlannerState } from "@/lib/planner-schema";

export interface ProjectExportInput {
  state: PlannerState;
  recommendation: ManufacturerRecommendation;
  snapshotDataUrl?: string;
}

const PAGE = { width: 612, height: 792, margin: 44 } as const;
const ink = rgb(0.09, 0.12, 0.14);
const muted = rgb(0.34, 0.4, 0.42);
const teal = rgb(0.02, 0.45, 0.46);
const paleTeal = rgb(0.9, 0.97, 0.97);
const amber = rgb(0.72, 0.4, 0.05);
const line = rgb(0.82, 0.85, 0.85);

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) current = candidate;
      else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    if (!words.length) lines.push("");
  }
  return lines;
}

function drawWrapped(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  x: number,
  y: number,
  maxWidth: number,
  color = ink,
  leading = size * 1.35,
) {
  const lines = wrapText(text, font, size, maxWidth);
  lines.forEach((textLine, index) => page.drawText(textLine, { x, y: y - index * leading, size, font, color }));
  return y - lines.length * leading;
}

function drawHeader(page: PDFPage, title: string, bold: PDFFont, regular: PDFFont, pageNumber: number) {
  page.drawText("STEAMDESIGNPRO", { x: PAGE.margin, y: 752, size: 9, font: bold, color: teal });
  page.drawText(title, { x: PAGE.margin, y: 724, size: 22, font: bold, color: ink });
  page.drawText(`Preliminary planning record  •  Page ${pageNumber} of 4`, {
    x: PAGE.margin,
    y: 704,
    size: 8.5,
    font: regular,
    color: muted,
  });
  page.drawLine({ start: { x: PAGE.margin, y: 692 }, end: { x: 568, y: 692 }, thickness: 1, color: line });
}

function drawKeyValue(page: PDFPage, label: string, value: string, x: number, y: number, bold: PDFFont, regular: PDFFont) {
  page.drawText(label.toUpperCase(), { x, y, size: 7.2, font: bold, color: muted });
  page.drawText(value, { x, y: y - 16, size: 11, font: regular, color: ink });
}

function formatDimension(inches: number, state: PlannerState) {
  return state.units === "metric" ? `${(inches * 2.54).toFixed(1)} cm` : `${(inches / 12).toFixed(2)} ft`;
}

function formatRouteDistance(feet: number, state: PlannerState) {
  return `${feetToInputDistance(feet, state.units).toFixed(1)} ${state.units === "metric" ? "m" : "ft"}`;
}

function formatVolume(recommendation: ManufacturerRecommendation, state: PlannerState) {
  return state.units === "metric"
    ? `${recommendation.baseVolumeCubicMeters.toFixed(2)} m³`
    : `${recommendation.baseVolumeCuFt.toFixed(1)} ft³`;
}

function drawPlan(
  page: PDFPage,
  state: PlannerState,
  recommendation: ManufacturerRecommendation,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const roomAspect = state.widthInches / state.depthInches;
  let planWidth = width;
  let planHeight = width / roomAspect;
  if (planHeight > height) {
    planHeight = height;
    planWidth = height * roomAspect;
  }
  const left = x + (width - planWidth) / 2;
  const bottom = y + (height - planHeight) / 2;
  page.drawRectangle({ x: left, y: bottom, width: planWidth, height: planHeight, borderColor: ink, borderWidth: 1.5 });

  for (let gridX = left + 12; gridX < left + planWidth; gridX += 12) {
    page.drawLine({ start: { x: gridX, y: bottom }, end: { x: gridX, y: bottom + planHeight }, color: line, thickness: 0.25 });
  }
  for (let gridY = bottom + 12; gridY < bottom + planHeight; gridY += 12) {
    page.drawLine({ start: { x: left, y: gridY }, end: { x: left + planWidth, y: gridY }, color: line, thickness: 0.25 });
  }

  if (state.bench.type !== "none") {
    const benchLength = Math.min(planWidth * 0.8, (state.bench.widthInches / state.widthInches) * planWidth);
    const benchDepth = Math.min(planHeight * 0.45, (state.bench.depthInches / state.depthInches) * planHeight);
    const positions = {
      north: { x: left + (planWidth - benchLength) / 2, y: bottom + planHeight - benchDepth, w: benchLength, h: benchDepth },
      south: { x: left + (planWidth - benchLength) / 2, y: bottom, w: benchLength, h: benchDepth },
      west: { x: left, y: bottom + (planHeight - benchLength) / 2, w: benchDepth, h: benchLength },
      east: { x: left + planWidth - benchDepth, y: bottom + (planHeight - benchLength) / 2, w: benchDepth, h: benchLength },
    } as const;
    const bench = positions[state.bench.wall];
    page.drawRectangle({ x: bench.x, y: bench.y, width: bench.w, height: bench.h, color: paleTeal, borderColor: teal, borderWidth: 0.75 });
  }

  const headCoordinates = (wall: PlannerState["steamHeadWall"], position: number) => ({
    x: wall === "west" ? left : wall === "east" ? left + planWidth : left + planWidth * position,
    y: wall === "south" ? bottom : wall === "north" ? bottom + planHeight : bottom + planHeight * position,
  });
  const heads = [headCoordinates(state.steamHeadWall, state.steamHeadPosition)];
  if (recommendation.generator?.configuration === "tandem") {
    heads.push(headCoordinates(state.secondarySteamHeadWall, state.secondarySteamHeadPosition));
  }
  for (const head of heads) page.drawCircle({ ...head, size: 4, color: amber });
}

export async function createProjectPdf({ state, recommendation, snapshotDataUrl }: ProjectExportInput) {
  const pdf = await PDFDocument.create();
  pdf.setTitle("SteamDesignPro preliminary planning record");
  pdf.setAuthor("SaunaShare, Inc.");
  pdf.setCreator("SteamDesignPro.com");
  pdf.setProducer("SteamDesignPro deterministic export");
  pdf.setCreationDate(new Date("2026-07-11T00:00:00.000Z"));
  pdf.setModificationDate(new Date("2026-07-11T00:00:00.000Z"));
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const overview = pdf.addPage([PAGE.width, PAGE.height]);
  drawHeader(overview, "Steam shower planning summary", bold, regular, 1);
  overview.drawRectangle({ x: PAGE.margin, y: 622, width: 524, height: 52, color: paleTeal });
  overview.drawText(
    recommendation.generator
      ? `${recommendation.generator.sku}  •  ${recommendation.generator.powerKw} kW ${recommendation.generator.configuration}`
      : "Manufacturer review required — no catalog model selected",
    { x: 58, y: 646, size: 15, font: bold, color: recommendation.generator ? teal : amber },
  );
  overview.drawText(
    `${formatVolume(recommendation, state)} base volume  •  ${recommendation.ceilingAdjustmentSteps} ceiling size adjustment`,
    { x: 58, y: 630, size: 8.5, font: regular, color: muted },
  );

  if (snapshotDataUrl?.startsWith("data:image/png;base64,")) {
    try {
      const image = await pdf.embedPng(snapshotDataUrl);
      const fitted = image.scaleToFit(300, 210);
      overview.drawImage(image, { x: 268, y: 384, width: fitted.width, height: fitted.height });
      overview.drawRectangle({ x: 268, y: 384, width: 300, height: 210, borderColor: line, borderWidth: 0.75 });
    } catch {
      overview.drawRectangle({ x: 268, y: 384, width: 300, height: 210, color: rgb(0.95, 0.96, 0.96) });
    }
  } else {
    overview.drawRectangle({ x: 268, y: 384, width: 300, height: 210, color: rgb(0.95, 0.96, 0.96) });
    overview.drawText("3D snapshot unavailable — see plan on page 2", { x: 302, y: 486, size: 9, font: regular, color: muted });
  }

  drawKeyValue(overview, "Width", formatDimension(state.widthInches, state), 44, 584, bold, regular);
  drawKeyValue(overview, "Depth", formatDimension(state.depthInches, state), 44, 540, bold, regular);
  drawKeyValue(overview, "Finished height", formatDimension(state.heightInches, state), 44, 496, bold, regular);
  drawKeyValue(overview, "Shower system", state.showerType.replaceAll("-", " "), 44, 452, bold, regular);
  drawKeyValue(overview, "Steam head", state.steamHeadStyle, 44, 408, bold, regular);
  drawKeyValue(overview, "Generator route", formatRouteDistance(state.generatorDistanceFt, state), 44, 364, bold, regular);

  let overviewY = 326;
  overview.drawText("RECOMMENDATION", { x: 44, y: overviewY, size: 8, font: bold, color: teal });
  overviewY -= 22;
  for (const item of recommendation.accessoryPackage?.items ?? []) {
    overview.drawText(`${item.quantity} × ${item.sku}`, { x: 44, y: overviewY, size: 9, font: bold, color: ink });
    overviewY = drawWrapped(overview, item.name, regular, 8, 154, overviewY, 390, muted, 11) - 6;
  }
  if (recommendation.pricing.subtotalUsd !== null) {
    overviewY = Math.min(overviewY - 4, 222);
    overview.drawText("EQUIPMENT LIST PRICE REFERENCE", { x: 44, y: overviewY, size: 8, font: bold, color: teal });
    overview.drawText(formatUsd(recommendation.pricing.subtotalUsd), { x: 44, y: overviewY - 17, size: 13, font: bold, color: ink });
    overview.drawText("KOHLER US list-price reference; installation excluded", { x: 132, y: overviewY - 15, size: 7, font: regular, color: muted });
    overviewY -= 33;
  }
  overviewY = Math.min(overviewY - 4, 190);
  overview.drawText("EARLY COORDINATION FLAGS", { x: 44, y: overviewY, size: 8, font: bold, color: teal });
  overviewY -= 17;
  for (const warning of recommendation.warnings.slice(0, 4)) {
    const marker = warning.severity === "stop" ? "REVIEW" : warning.severity === "caution" ? "CHECK" : "NOTE";
    overview.drawText(marker, { x: 44, y: overviewY, size: 7, font: bold, color: warning.severity === "information" ? teal : amber });
    overviewY = drawWrapped(overview, `${warning.title}: ${warning.detail}`, regular, 7.5, 90, overviewY, 478, ink, 10.5) - 4;
    if (overviewY < 50) break;
  }

  const drawings = pdf.addPage([PAGE.width, PAGE.height]);
  drawHeader(drawings, "Plan, elevation, and specification", bold, regular, 2);
  drawings.drawText("PLAN — SCHEMATIC, NOT FOR CONSTRUCTION", { x: 44, y: 668, size: 8, font: bold, color: teal });
  drawPlan(drawings, state, recommendation, 44, 390, 300, 258);
  drawings.drawText(`${formatDimension(state.widthInches, state)} × ${formatDimension(state.depthInches, state)}`, {
    x: 44,
    y: 372,
    size: 8,
    font: regular,
    color: muted,
  });
  drawings.drawText("ELEVATION", { x: 376, y: 668, size: 8, font: bold, color: teal });
  drawings.drawRectangle({ x: 376, y: 438, width: 192, height: 210, borderColor: ink, borderWidth: 1.25 });
  drawings.drawRectangle({ x: 376, y: 438, width: 192, height: 20, color: paleTeal });
  drawings.drawCircle({ x: 406, y: 450, size: 4, color: amber });
  if (recommendation.generator?.configuration === "tandem") {
    drawings.drawCircle({ x: 432, y: 450, size: 4, color: amber });
  }
  drawings.drawRectangle({ x: 530, y: 540, width: 12, height: 15, borderColor: teal, borderWidth: 1 });
  drawings.drawText(`${recommendation.generator?.configuration === "tandem" ? "2 heads" : "head"} at ${state.units === "metric" ? "15.2 cm" : "6 in"} AFF`, { x: 392, y: 466, size: 7, font: regular, color: muted });
  drawings.drawText(`control ${state.units === "metric" ? "152.4 cm" : "60 in"} AFF`, { x: 476, y: 562, size: 7, font: regular, color: muted });

  drawings.drawText("SPECIFICATION", { x: 44, y: 334, size: 8, font: bold, color: teal });
  let specY = 312;
  for (const item of recommendation.accessoryPackage?.items ?? []) {
    drawings.drawLine({ start: { x: 44, y: specY - 5 }, end: { x: 568, y: specY - 5 }, color: line, thickness: 0.5 });
    drawings.drawText(`${item.quantity} ×`, { x: 44, y: specY + 5, size: 8, font: bold, color: ink });
    drawings.drawText(item.sku, { x: 80, y: specY + 5, size: 8, font: bold, color: ink });
    drawings.drawText(item.name, { x: 218, y: specY + 5, size: 8, font: regular, color: ink });
    specY -= 28;
  }
  if (recommendation.generator) {
    drawings.drawText("ELECTRICAL DISCUSSION", { x: 44, y: specY - 4, size: 8, font: bold, color: teal });
    specY = drawWrapped(
      drawings,
      `${recommendation.generator.dedicatedCircuits} dedicated ${recommendation.generator.voltage} V circuit(s), ${recommendation.generator.requiredCircuitAmps} A each, 50/60 Hz. KOHLER depicts no GFCI; local code and the licensed electrician control the final design.`,
      regular,
      8,
      44,
      specY - 21,
      524,
      ink,
      11,
    );
  }

  const inputs = pdf.addPage([PAGE.width, PAGE.height]);
  drawHeader(inputs, "Project inputs, assumptions, and exclusions", bold, regular, 3);
  inputs.drawText("RECORDED PROJECT INPUTS", { x: 44, y: 668, size: 8, font: bold, color: teal });
  const inputRows = [
    ["Units", state.units === "metric" ? "Metric" : "US customary"],
    ["Finished enclosure", `${formatDimension(state.widthInches, state)} W × ${formatDimension(state.depthInches, state)} D × ${formatDimension(state.heightInches, state)} H`],
    ["Primary surface", state.surfaceMaterial.replaceAll("-", " ")],
    ["Glass walls", state.glassWalls.length ? state.glassWalls.join(", ") : "None entered"],
    ["Door", `${state.doorWall} wall; ${state.doorSwing.replaceAll("-", " ")}; ${formatDimension(state.doorWidthInches, state)} wide`],
    ["Bench", state.bench.type === "none" ? "None" : `${state.bench.type}; ${state.bench.wall} wall; ${formatDimension(state.bench.widthInches, state)} W × ${formatDimension(state.bench.depthInches, state)} D × ${formatDimension(state.bench.heightInches, state)} H`],
    ["Ceiling", state.ceilingSlopeDirection === "none" ? "Level" : `Falls to ${state.ceilingSlopeDirection}; ${formatDimension(state.ceilingSlopeDropInches, state)} drop`],
    ["Shower / head", `${state.showerType.replaceAll("-", " ")}; ${state.steamHeadStyle}; ${state.steamHeadWall} at ${Math.round(state.steamHeadPosition * 100)}%`],
    ["Second head", recommendation.generator?.configuration === "tandem" ? `${state.secondarySteamHeadWall} at ${Math.round(state.secondarySteamHeadPosition * 100)}%` : "Not required for selected single system"],
    ["Control", `${state.controllerWall} wall at ${Math.round(state.controllerPosition * 100)}%`],
    ["Shower fixture", `${state.fixtureWall} wall at ${Math.round(state.fixturePosition * 100)}%`],
    ["Generator", `${state.generatorLocation.replaceAll("-", " ")}; ${formatRouteDistance(state.generatorDistanceFt, state)} routed distance`],
    ["Finish", state.finish],
  ] as const;
  let inputY = 648;
  for (const [label, value] of inputRows) {
    inputs.drawText(label.toUpperCase(), { x: 44, y: inputY, size: 6.8, font: bold, color: muted });
    inputY = drawWrapped(inputs, value, regular, 8.2, 158, inputY, 410, ink, 10) - 6;
  }
  inputs.drawText("PROJECT NOTES", { x: 44, y: inputY - 2, size: 8, font: bold, color: teal });
  inputY -= 20;
  inputY = drawWrapped(inputs, `Exterior wall: ${state.exteriorWallNotes.trim() || "None entered."}`, regular, 8, 44, inputY, 524, ink, 10.5) - 5;
  inputY = drawWrapped(inputs, `Windows: ${state.windowNotes.trim() || "None entered."}`, regular, 8, 44, inputY, 524, ink, 10.5) - 12;
  inputs.drawText("CALCULATION ASSUMPTIONS / EXCLUSIONS", { x: 44, y: inputY, size: 8, font: bold, color: teal });
  inputY -= 18;
  const assumptions = [
    "Base capacity uses finished width × depth × height. The recorded surface material does not change capacity because the current cited KOHLER procedure publishes no material multiplier.",
    "Each started foot above 8 ft advances one catalog size as a conservative planner policy; fractional feet require confirmation. Above the documented 10-ft ceiling or 1,000 ft³ catalog range, no model is selected.",
    "Placement drawings are schematic. They do not validate every clearance, collision, pipe route, waterproofing transition, structural condition, or code requirement.",
    "Final product selection and all architectural, electrical, plumbing, waterproofing, vapor, accessibility, permit, and installation decisions are excluded and require current documents and qualified professionals.",
  ];
  for (const assumption of assumptions) inputY = drawWrapped(inputs, `• ${assumption}`, regular, 7.5, 44, inputY, 524, ink, 10) - 4;

  const checklist = pdf.addPage([PAGE.width, PAGE.height]);
  drawHeader(checklist, "Coordination checklist, sources, and limits", bold, regular, 4);
  const checks = [
    "Licensed electrician: circuit capacity, disconnecting means, protection, conductor sizing, and local-code reconciliation.",
    "Licensed plumber: water quality, shutoff, pressure relief, 1/2-in copper steam line, slope, drain, and service access.",
    "Architect / waterproofing professional: fully sealed steam enclosure, vapor retarder continuity, penetrations, ceiling slope, exterior walls, and windows.",
    "Installer / manufacturer: final model, controller/head combination, head and control placement, routed 25-ft maximum, clearances, drain pan, and commissioning.",
    "Authority having jurisdiction: electrical, plumbing, building, accessibility, and other project-specific requirements.",
  ];
  let checklistY = 660;
  for (const item of checks) {
    checklist.drawRectangle({ x: 44, y: checklistY - 2, width: 10, height: 10, borderColor: teal, borderWidth: 1 });
    checklistY = drawWrapped(checklist, item, regular, 9, 66, checklistY, 502, ink, 13) - 10;
  }

  checklist.drawText("SOURCE REVISIONS USED", { x: 44, y: checklistY, size: 8, font: bold, color: teal });
  checklistY -= 19;
  const sources = [
    "KOHLER Form 22-3187-0824, Select Your Controller and Steam Head (© 2024).",
    "KOHLER 1601844-2-B and 1601845-2-B, current Invigoration installation instructions.",
    recommendation.generator
      ? `KOHLER ${recommendation.generator.sku} specification sheet, revision ${recommendation.generator.specRevision}.`
      : "Current K-323xx specification catalog; no model selected.",
    "Selection guide: https://www.studiokohler.com/content/dam/kohler-kds/PDP-PDF-22-3187-0824-select-your-controller-and-steam-head.pdf",
    "Installation instructions: https://techcomm.kohler.com/techcomm/pdf/1601844-2.pdf",
    recommendation.generator ? `Selected model specification: ${recommendation.generator.specUrl}` : "No model-specific specification applies because manufacturer review is required.",
    "Field-level provenance: https://steamdesignpro.com/sources (sources retrieved 2026-07-11).",
  ];
  for (const source of sources) checklistY = drawWrapped(checklist, `• ${source}`, regular, 8, 44, checklistY, 524, ink, 11) - 5;

  checklist.drawRectangle({ x: 44, y: 74, width: 524, height: 128, color: rgb(0.97, 0.95, 0.91) });
  checklist.drawText("IMPORTANT LIMITS", { x: 58, y: 180, size: 8, font: bold, color: amber });
  drawWrapped(
    checklist,
    "SteamDesignPro.com is an independent preliminary planning aid owned and operated by SaunaShare, Inc. It is not affiliated with, endorsed, certified, or authorized by Kohler Co. This record is not engineering, architectural, waterproofing, electrical, plumbing, code, permit, or installation documentation. Current manufacturer documents, project conditions, local code, the authority having jurisdiction, and licensed professionals control. KOHLER, Invigoration, Anthem+, and DTV+ are trademarks of Kohler Co.",
    regular,
    8,
    58,
    160,
    496,
    ink,
    11,
  );

  return pdf.save({ useObjectStreams: false, addDefaultPage: false, objectsPerTick: 50 });
}
