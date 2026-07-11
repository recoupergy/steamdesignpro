import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const data = JSON.parse(await readFile(path.join(root, "data/kohler/assets.json"), "utf8"));

if (data.licenseReview.status !== "not-authorized-for-commercial-derivative-redistribution") {
  throw new Error("Asset license decision is missing or unexpectedly permissive.");
}
if (data.officialCadAudit.length !== 4) throw new Error("Expected four audited K-323xx control/head records.");
for (const record of data.officialCadAudit) {
  if (record.conversion !== "not-performed-license-restricted") {
    throw new Error(`${record.model} must not be converted without written permission.`);
  }
  if (!/^[a-f0-9]{64}$/.test(record.auditedObj.sha256)) throw new Error(`${record.model} OBJ checksum is invalid.`);
}

async function walk(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else files.push(absolute);
  }
  return files;
}

const publicFiles = await walk(path.join(root, "public"));
const prohibited = publicFiles.filter((file) => /\.(obj|3ds|skp|dwg|dxf|rfa|rvt|zip|glb|gltf)$/i.test(file));
if (prohibited.length) throw new Error(`Restricted or undocumented product assets found in public/: ${prohibited.join(", ")}`);

const scene = await readFile(path.join(root, data.productionProceduralAsset.sourceFile), "utf8");
const dimensions = await readFile(path.join(root, "src/lib/procedural-assets.ts"), "utf8");
for (const expected of ["13.75", "2.0625", "0.375", "preserveDrawingBuffer", "frameloop"]) {
  if (!`${scene}\n${dimensions}`.includes(expected)) {
    throw new Error(`Procedural source is missing verification marker: ${expected}`);
  }
}

console.log(`Asset audit passed: ${data.officialCadAudit.length} restricted official records documented; ${publicFiles.length} public files contain no prohibited CAD/mesh packages.`);
