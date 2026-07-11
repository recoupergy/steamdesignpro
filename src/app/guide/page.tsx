import Link from "next/link";

import {
  ContentPage,
  OFFICIAL_SOURCES,
  SourceLink,
  contentMetadata,
} from "@/components/content";

export const metadata = contentMetadata({
  title: "How to Plan a Steam Shower | SteamDesignPro Guide",
  description:
    "A practical, source-cited workflow for measuring a steam enclosure, reviewing Kohler Invigoration generator sizing, and preparing a professional handoff.",
  path: "/guide",
});

export default function GuidePage() {
  return (
    <ContentPage
      path="/guide"
      eyebrow="Planning guide"
      title="Plan the room before you select the steam equipment"
      summary="A useful steam-shower plan connects finished enclosure geometry, generator capacity, compatible controls, fixture placement, service access, and the trades responsible for the work. This guide explains what to record and what the planner can—and cannot—decide."
      breadcrumbs={[{ label: "Planning guide" }]}
      plannerCtaTitle="Start with a measured room"
      plannerCtaDescription="The compact starter makes the geometry visible immediately. Replace every default with finished-field dimensions before relying on its preliminary recommendation."
    >
      <section className="content-section" aria-labelledby="guide-output">
        <h2 id="guide-output">What the planner produces</h2>
        <p>
          SteamDesignPro turns room inputs into a visual planning record: enclosure
          dimensions, calculated volume, a preliminary generator selection,
          electrical characteristics published for that model, a compatible
          control and steam-head path, placement warnings, and a discussion
          checklist. Kohler&apos;s own calculator also begins with room length,
          width, and height, then asks about the shower system and steam-head
          shape.{" "}
          <SourceLink href={OFFICIAL_SOURCES.calculator}>
            Kohler steam calculator
          </SourceLink>
        </p>
        <p>
          The output is deliberately a coordination artifact, not a permit set.
          It should help an owner, designer, electrician, plumber, tile or
          waterproofing professional, and installer identify unresolved questions
          before products are ordered or walls are closed.
        </p>
      </section>

      <section className="content-section" aria-labelledby="guide-measure">
        <h2 id="guide-measure">1. Measure the finished steam enclosure</h2>
        <p>
          Record inside width, depth, and height at the finished tile or wall
          surface—not rough framing. Note any slope, dropped area, ledge, column,
          or full-height bench that changes the enclosed air volume. The Kohler
          selection guide defines base volume as width × height × depth and
          recommends a ceiling height of 8 feet or less.{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Kohler controller and steam-head selection guide, form 22-3187-0824
          </SourceLink>
        </p>
        <div className="callout callout--example">
          <h3>Worked geometry example</h3>
          <p>
            A finished enclosure measuring 5 ft × 4 ft × 8 ft has a base
            volume of 160 cu ft. In Kohler&apos;s published sequence, 160 cu ft is
            above the 112-cu-ft K-32325-NA limit and within the 240-cu-ft
            K-32326-NA limit, before any ceiling-height step is considered.{" "}
            <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
              Official capacity table
            </SourceLink>
          </p>
        </div>
      </section>

      <section className="content-section" aria-labelledby="guide-envelope">
        <h2 id="guide-envelope">2. Describe the enclosure and openings</h2>
        <ul className="check-list">
          <li>Identify which walls are solid, glass, or partly open.</li>
          <li>Record the door wall, hinge side, clear opening, and swing.</li>
          <li>Mark exterior walls, windows, skylights, and unusual transitions.</li>
          <li>
            Confirm that the design team has a continuous steam-rated enclosure,
            waterproofing, vapor-management, and drainage strategy.
          </li>
        </ul>
        <p>
          SteamDesignPro records finish and envelope notes for professional
          review. It does not apply an invented material multiplier to Kohler&apos;s
          sizing table; the current Kohler selection guide bases the published
          selection procedure on room volume and ceiling height.{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Review the manufacturer procedure
          </SourceLink>
        </p>
      </section>

      <section className="content-section" aria-labelledby="guide-zones">
        <h2 id="guide-zones">3. Coordinate people, fixtures, and hot surfaces</h2>
        <p>
          Place the bench, door, shower fixture, control, and steam head as one
          coordinated composition. Preserve usable circulation and make the door
          swing legible. Treat any steam-head proximity warning as a prompt to
          consult the current product-specific installation guide. Kohler&apos;s
          current K-323xx generator instructions say not to locate the steam head
          near a seat or bench because it becomes hot during operation.{" "}
          <SourceLink href={OFFICIAL_SOURCES.generator5to11Instructions}>
            Kohler installation instructions 1601844-2-B
          </SourceLink>
        </p>
        <p>
          A 3D view can expose obvious conflicts, but it cannot see blocking,
          piping, wiring, membrane laps, structural conditions, or required
          clearances concealed behind finished surfaces.
        </p>
      </section>

      <section className="content-section" aria-labelledby="guide-generator">
        <h2 id="guide-generator">4. Review generator size and location together</h2>
        <p>
          First calculate base volume. Then apply the manufacturer&apos;s ceiling
          rule and confirm that the resulting model still covers the room&apos;s
          actual volume. Kohler says the generator should be installed within 25
          feet of the steam head and requires a separate dedicated 240 V circuit.
          Tandem selections require two dedicated circuits and two drain pans.{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Kohler sizing and system notes
          </SourceLink>
        </p>
        <p>
          The guide also says no GFCI should be connected to that circuit. That is
          a manufacturer instruction, not permission to bypass current electrical
          code. Put the apparent requirement in the project record and have the
          licensed electrician reconcile the current installation manual, adopted
          code, and authority having jurisdiction before work begins.
        </p>
        <p>
          See the{" "}
          <Link href="/steam-generator-sizing">
            full sizing method and model table
          </Link>
          .
        </p>
      </section>

      <section className="content-section" aria-labelledby="guide-controls">
        <h2 id="guide-controls">5. Select a compatible control path</h2>
        <p>
          Begin with the shower system: mechanical, Anthem+, or DTV+ digital.
          For a mechanical shower, Kohler&apos;s guide lists K-5557, K-5558, or
          K-32312; K-32312 pairs with a separately sold K-32309 linear or K-32310
          square steam head. For an Anthem+ or DTV+ digital shower, it lists
          K-5548-K1, K-5549-K1, or K-32311; K-32311 also pairs with the linear or
          square head. Tandem systems require two steam heads.{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Official controller compatibility chart
          </SourceLink>
        </p>
        <p>
          Finish availability varies by SKU, so verify the exact complete model
          number on the current product page at the time of specification rather
          than assuming every displayed finish is available for every component.{" "}
          <SourceLink href={OFFICIAL_SOURCES.steamCatalog}>
            Current Kohler Invigoration product results
          </SourceLink>
        </p>
      </section>

      <section className="content-section" aria-labelledby="guide-handoff">
        <h2 id="guide-handoff">6. Make the unresolved work explicit</h2>
        <p>
          Before handoff, save the dimensioned plan and list the assumptions that
          still need field verification. A strong preliminary package does not
          hide uncertainty; it assigns it.
        </p>
        <dl className="responsibility-list">
          <div>
            <dt>Designer or architect</dt>
            <dd>
              Enclosure geometry, door operation, accessibility, assemblies, and
              permit-document coordination.
            </dd>
          </div>
          <div>
            <dt>Waterproofing and tile team</dt>
            <dd>
              Steam-rated membrane system, transitions, penetrations, slope, and
              manufacturer-required details.
            </dd>
          </div>
          <div>
            <dt>Licensed electrician</dt>
            <dd>
              Load calculation, circuit and conductor design, disconnecting
              means, bonding, protection, permits, and code reconciliation.
            </dd>
          </div>
          <div>
            <dt>Licensed plumber and installer</dt>
            <dd>
              Water, steam, relief, drain, service access, commissioning, and all
              product-specific installation requirements.
            </dd>
          </div>
        </dl>
        <p>
          Use the{" "}
          <Link href="/steam-shower-checklist">steam-shower checklist</Link> for
          the handoff meeting, and keep the{" "}
          <Link href="/sources">source register</Link> with the project record.
        </p>
      </section>
    </ContentPage>
  );
}
