# 3D asset source and permission report

Last audited: 2026-07-11. This report covers the production browser scene and the official KOHLER resources reviewed for dimensional corroboration.

## Production decision

SteamDesignPro does **not** bundle, convert, or redistribute official KOHLER CAD, BIM, product photography, or meshes. KOHLER’s [current legal policy](https://www.kohler.com/en/legal) limits downloaded site content to non-commercial personal use and prohibits commercial/public modification, reuse, or distribution without written permission. The reviewed Revit metadata also states “Copyright Kohler Co.” Public download availability is not permission to create and ship a derivative GLB.

The production scene is therefore an independently authored, low-poly procedural planning proxy. It must not be described as official KOHLER CAD. Its visible K-32309 linear-head face, K-32310 square-head face, and 4 × 3¼-inch control envelope follow current published specification dimensions. Hidden internals are intentionally omitted.

## Official resource audit

| Model | Official resources found | Current drawing basis | Audited OBJ | Permission / conversion |
| --- | --- | --- | ---: | --- |
| K-32309 linear head | OBJ, 3DS, SKP, 3D DWG/DXF, Revit, 2D views | 13¾ × 2 1/16-inch face; ⅜-inch projection; spec 6-29-2026 | 8,048 vertices / 24,376 triangles | No production conversion; commercial derivative permission not documented |
| K-32310 square head | OBJ, 3DS, SKP, 3D DWG/DXF, Revit, 2D views | 3 × 3-inch face; ¾-inch projection; spec 6-29-2026 | 10,177 vertices / 30,921 triangles | No production conversion; commercial derivative permission not documented |
| K-32311 digital adapter | OBJ, 3DS, SKP, 3D DWG/DXF, Revit, 2D views | 4 × 3¼-inch face envelope; spec 6-29-2026 | 4,659 vertices / 14,207 triangles | No production conversion; commercial derivative permission not documented |
| K-32312 controller | OBJ, 3DS, SKP, 3D DWG/DXF, Revit, 2D views | 4 × 3¼ × 1 inch; spec 6-29-2026 | 2,232 vertices / 6,470 triangles | No production conversion; commercial derivative permission not documented |
| K-32324 through K-32335 generators | Studio KOHLER lists Revit/RFA on current professional product records | Current individual K-323xx specification drawings | Not converted | Browser-ready GLB/GLTF not found; RFA not redistributed |

No STEP/STP, IFC, STL, GLB, or GLTF resource was found for K-32309, K-32310, K-32311, or K-32312. Official 3D URLs follow `https://techcomm.kohler.com/techcomm/cad/{model}.{obj|3ds|skp|dxf|dwg}`. The exact SHA-256 checksums, Revit ZIP checksums, bounding spans, model revisions, and source patterns from the audit are checked in at [`data/kohler/assets.json`](../data/kohler/assets.json).

## Independent procedural model

- Source: `src/components/planner/steam-room-canvas.tsx`
- Units/origin: 12 finished inches per scene unit; room centered at floor level; each fixture is mounted from its selected wall origin.
- Materials: white ceramic proxy, clear glass proxy, generic chrome proxy, charcoal control screen. No product texture or logo is copied.
- Geometry: enclosure planes and low-segment primitives; hidden mechanical internals are omitted.
- LOD/performance: no external mesh files or textures; capped DPR of 1.75; demand rendering; rendering pauses when the viewport or document is not visible. The primitive polygon budget is low enough that separate mesh LOD files are unnecessary in this release.
- Verification: unit tests pin the published visible face envelopes and the 12-inches-per-scene-unit conversion. Playwright captures the default desktop/mobile scene, checks nonblank canvas pixels, switches camera views, checks pixel movement, and records `THREE.WebGLRenderer.info.render.triangles`. The final recorded count is written back to `data/kohler/assets.json` after verification.
- Generator: the separate generator-location drawing is a schematic SVG, not a product representation.

## Reproducibility and future permission

The present reproducible pipeline is source code → Next.js build → procedural Three.js primitives; there is no CAD conversion step. If SaunaShare later obtains written commercial derivative permission, a separate import script should pin the exact source checksum, apply inches-to-meters conversion, normalize a wall-mount origin, remove hidden internals, create LODs, compress with Meshopt/Draco only after visual validation, and write the license grant plus every conversion command into this report before any GLB ships.
