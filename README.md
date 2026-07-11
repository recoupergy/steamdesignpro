# SteamDesignPro

SteamDesignPro.com is an independent, browser-based preliminary planning tool for steam-shower geometry and current KOHLER Invigoration equipment. It combines a measured 2D fallback, an on-demand Three.js room, source-linked sizing and accessory compatibility, versioned share URLs, and a deterministic PDF planning record.

It is owned and operated by SaunaShare, Inc. and is not affiliated with, endorsed, certified, or authorized by Kohler Co. The output is not construction or professional documentation.

## Stack

- Next.js 16 App Router, React 19, strict TypeScript, and Tailwind CSS 4
- React Three Fiber / Three.js with demand rendering and mobile on-demand loading
- Zustand with versioned URL state and versioned local autosave
- Zod-validated source data in `data/kohler/`
- Vitest, Playwright, axe-core, and Lighthouse
- Vercel production deployment from GitHub `main`

## Local development

Requirements: Node.js 22–24 and pnpm 11.7.0.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`. No runtime secrets or external APIs are required.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm assets:verify
pnpm build
pnpm test:e2e
```

Playwright runs at 390×844 and 1440×900, checks the 2D and WebGL views, validates nonblank/moving canvas pixels, audits WCAG A/AA rules, exercises planner history/share/PDF behavior, and verifies the crawlable routes. Final production-mode Lighthouse is run against a local production server:

```bash
pnpm build
pnpm start --port 3108
LIGHTHOUSE_MODE=mobile LIGHTHOUSE_URL=http://127.0.0.1:3108 pnpm lighthouse
LIGHTHOUSE_MODE=desktop LIGHTHOUSE_URL=http://127.0.0.1:3108 pnpm lighthouse
```

Final screenshots, render counts, and Lighthouse summaries live in `artifacts/`. Raw reports, traces, and videos are intentionally ignored.

## Sizing and data policy

The KOHLER adapter lives under `src/lib/kohler/` behind the manufacturer-neutral contract in `src/lib/manufacturer-adapter.ts`. It uses finished width × depth × height, the current K-323xx thresholds, conservative started-foot ceiling handling above 8 ft, and hard manufacturer-review boundaries above the documented 10-ft ceiling or 1,000 ft³ catalog range. Surface material is recorded but does not change capacity because the current cited KOHLER procedure publishes no material multiplier.

Current normalized records and field-level provenance are checked into:

- `data/kohler/generators.json`
- `data/kohler/controls.json`
- `data/kohler/rules.json`
- `data/kohler/assets.json`

See `docs/research-report.md` for the source reconciliation, `docs/asset-sources.md` for the asset/license audit, and `docs/verification.md` for the release evidence.

## Asset policy

No official KOHLER CAD, BIM, photography, or meshes are redistributed. The room and fixture proxies are independently authored procedural geometry. Published visible face dimensions are pinned in `src/lib/procedural-assets.ts` and tested; official source checksums are retained only as audit metadata.

## Deployment

The canonical host is `https://steamdesignpro.com`; `www` redirects to the apex. Vercel is connected to the public GitHub repository and deploys production from `main`. Security headers and the canonical redirect are defined in `next.config.ts`.

## Rights

Copyright © 2026 SaunaShare, Inc. All rights reserved. KOHLER, Invigoration, Anthem+, and DTV+ are trademarks of Kohler Co.
