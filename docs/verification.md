# Release verification

Verified against the production-mode build on 2026-07-11.

| Check | Result |
| --- | --- |
| ESLint | Passed with zero warnings |
| TypeScript | Strict typecheck passed |
| Vitest | 57 tests passed across 6 files |
| Asset/license audit | Passed; 4 restricted official records audited and no official CAD redistributed |
| Next.js production build | Passed; 26 routes rendered or statically generated |
| Playwright | 36 passed, 2 intentional device-specific skips, 0 failed at 390×844 and 1440×900 |
| axe-core | No automatically detectable WCAG A/AA violations in either browser project |
| Official source links | Passed from the desktop browser project |
| Default Three.js scene | 2,374 triangles, 87 render calls; nonblank, framed, moving, and clear of planner UI |

## Lighthouse lab results

| Profile | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 98 | 100 | 100 | 100 | 806 ms | 2,461 ms | 7 ms | 0.0042 |
| Desktop | 86 | 100 | 100 | 100 | 795 ms | 2,457 ms | 2.5 ms | 0 |

Lighthouse is a repeatable lab check, not field Core Web Vitals. Total Blocking Time is the available lab interactivity proxy; the requested 75th-percentile INP target requires real-user monitoring after launch.

Evidence is checked into `artifacts/lighthouse/` and `artifacts/screenshots/`. Raw Lighthouse reports, Playwright traces, and videos are ignored to keep the repository focused.
