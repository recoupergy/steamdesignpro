# KOHLER Invigoration research and normalization report

Last verified: 2026-07-11. SteamDesignPro is independent of Kohler Co.; this is a planning-data audit, not manufacturer approval or construction guidance.

## Primary-source basis

The sizing sequence and controller/head decision tree are normalized from KOHLER's [Select Your Controller and Steam Head](https://www.studiokohler.com/content/dam/kohler-kds/PDP-PDF-22-3187-0824-select-your-controller-and-steam-head.pdf), Form 22-3187-0824. Individual capacity, circuit, drain-pan, dimension, and installation fields are corroborated against the current KOHLER specification and installation PDFs linked field-by-field in `data/kohler/`.

Current orderable finish sets are intentionally narrower than historical specification finish lists. Each controller and steam-head record therefore stores both sets and exposes only the intersection verified on its current KOHLER product page as of the retrieval date.

## Generator sequence

| Configuration | SKU | Power | Maximum room volume | Dedicated electrical requirement |
| --- | --- | ---: | ---: | --- |
| Single | K-32324-NA | 5 kW | 84 ft³ | 1 × 240 V / 40 A |
| Single | K-32325-NA | 7 kW | 112 ft³ | 1 × 240 V / 50 A |
| Single | K-32326-NA | 9 kW | 240 ft³ | 1 × 240 V / 60 A |
| Single | K-32327-NA | 11 kW | 317 ft³ | 1 × 240 V / 60 A |
| Single | K-32328-NA | 13 kW | 447 ft³ | 1 × 240 V / 80 A |
| Single | K-32329-NA | 15 kW | 500 ft³ | 1 × 240 V / 90 A |
| Tandem | K-32332-NA | 18 kW | 550 ft³ | 2 × 240 V / 60 A |
| Tandem | K-32333-NA | 22 kW | 634 ft³ | 2 × 240 V / 60 A |
| Tandem | K-32334-NA | 26 kW | 894 ft³ | 2 × 240 V / 80 A |
| Tandem | K-32335-NA | 30 kW | 1,000 ft³ | 2 × 240 V / 90 A |

The engine first selects the catalog capacity at or above base volume, then advances through the ordered catalog once for each ceiling-height step. Tandem results explicitly require two component generators, two dedicated circuits, two steam heads, and two drain pans. It never invents a model above the documented 1,000 ft³ range.

## Normalized rules and conservative decisions

- Base volume is finished width × depth × height.
- KOHLER recommends an 8-foot-or-lower ceiling and says to move up one generator size for each foot above 8 feet. Because the source does not define fractional-foot rounding, a started foot is conservatively rounded upward and flagged for review.
- The documented maximum ceiling is 10 feet. A taller room returns no SKU and requires manufacturer/design-professional review.
- The generator must be within 25 feet of the steam head. Longer entered distances remain visible as a hard planning warning.
- Current cited KOHLER material does not publish a surface-finish multiplier. Material is captured in the project record but does not alter capacity.
- KOHLER's source language calls for a dedicated 240 V circuit and says no GFCI on that generator circuit. The planner presents this only as a manufacturer instruction beside conspicuous requirements to reconcile it with current local code and a licensed electrician; it does not issue electrical approval.
- Installation discussion defaults include a steam-head centerline 6 inches above the finished floor, control centerline 60 inches above the finished floor, and at least 6 inches of generator air gap on three sides, all subject to the selected product's current instructions.

## Compatibility normalization

Mechanical showers use K-5557/K-5558 round-head control kits or K-32312 with separately selected K-32309 linear or K-32310 square heads. Anthem+ and DTV+ digital showers use K-5548-K1/K-5549-K1 round-head adapter kits or K-32311 with K-32309/K-32310. Single systems require one head; tandem systems require two.

The implementation keeps these records behind the manufacturer-neutral `ManufacturerAdapter` contract. There are no fictitious brands, comparison claims, prices, availability claims, ratings, or reviews.

## Data quality and update policy

Source records contain retrieval dates, document revisions, page references, narrow supporting excerpts, and direct URLs. Zod schemas validate every checked-in generator, rules, controller, and steam-head record during tests. Any future refresh must preserve historical evidence in version control, rerun every boundary and compatibility test, recheck all official links, and avoid silently carrying forward finishes that are no longer shown as orderable.

See [`data/kohler/`](../data/kohler), the [asset and permission report](asset-sources.md), and the public `/sources` route for the complete field-level register.
