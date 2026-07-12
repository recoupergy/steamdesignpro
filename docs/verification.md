# Release verification

Verified against the production-mode build on 2026-07-11.

| Check | Result |
| --- | --- |
| ESLint | Passed with zero warnings |
| TypeScript | Strict typecheck passed |
| Vitest | 58 tests passed across 6 files |
| Asset/license audit | Passed; 4 restricted official records documented and no prohibited CAD/mesh packages in `public/` |
| Next.js production build | Passed; 27 routes rendered or statically generated |
| Playwright | 43 passed, 3 intentional device-specific skips, 0 failed at 390×844 and 1440×900 |
| Landing and routing | Direct `/design` CTA, root canonical, legacy query redirect, sitemap entry, and 320 px overflow check passed |
| axe-core | No automatically detectable WCAG A/AA violations on the landing page or planner in either browser project |
| Official source links | Passed in the local desktop release smoke; intentionally skipped on mobile and in CI |
| Default Three.js scene | 2,374 triangles, 87 render calls on both viewports; nonblank, framed, moving, and clear of planner UI |

## Lighthouse lab results

| Profile | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile landing | 98 | 100 | 100 | 100 | 913 ms | 2,326 ms | 7 ms | 0 |
| Desktop landing | 86 | 100 | 100 | 100 | 905 ms | 2,462 ms | 4 ms | 0 |

Lighthouse is a repeatable lab check, not field Core Web Vitals. Total Blocking Time is the available lab interactivity proxy; the requested 75th-percentile INP target requires real-user monitoring after launch.

Evidence is checked into `artifacts/lighthouse/` and `artifacts/screenshots/`. Raw Lighthouse reports, Playwright traces, and videos are ignored to keep the repository focused.
