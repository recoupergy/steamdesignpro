import Link from "next/link";

import {
  ContentPage,
  OFFICIAL_SOURCES,
  SourceLink,
  contentMetadata,
} from "@/components/content";

export const metadata = contentMetadata({
  title: "Steam Shower Planning Checklist | Design-to-Install Handoff",
  description:
    "A printable, source-cited checklist for coordinating steam-room dimensions, Kohler generator sizing, controls, electrical work, plumbing, waterproofing, and service access.",
  path: "/steam-shower-checklist",
});

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <span className="check-item__box" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

export default function SteamShowerChecklistPage() {
  return (
    <ContentPage
      path="/steam-shower-checklist"
      eyebrow="Project handoff"
      title="Steam-shower planning checklist"
      summary="Use this list to make decisions and open questions visible across design, rough-in, enclosure construction, equipment selection, and commissioning. It is a coordination checklist—not an installation procedure or substitute for the current manuals and licensed trades."
      breadcrumbs={[{ label: "Steam-shower checklist" }]}
      plannerCtaTitle="Attach a room plan to the checklist"
      plannerCtaDescription="Start from the compact room, replace its defaults with verified finished dimensions, and export the assumptions your project team needs to review."
    >
      <section className="content-section checklist-section" aria-labelledby="checklist-record">
        <h2 id="checklist-record">1. Establish the project record</h2>
        <ul className="print-checklist">
          <CheckItem>
            Record project address, room name, responsible designer, installer,
            electrician, plumber, waterproofing lead, and permit authority.
          </CheckItem>
          <CheckItem>
            Save the exact generator, controller, adapter, steam-head, and drain-pan
            model numbers under consideration; do not record only collection names.
          </CheckItem>
          <CheckItem>
            Download the current product page, specification sheet, and installation
            guide for each exact SKU on the review date.
          </CheckItem>
          <CheckItem>
            Record document form or revision numbers and the date each source was
            retrieved. Recheck them before ordering and before rough-in.
          </CheckItem>
        </ul>
        <p className="source-note">
          Start with the{" "}
          <SourceLink href={OFFICIAL_SOURCES.generatorCatalog}>
            current Kohler steam-generator catalog
          </SourceLink>{" "}
          and the <Link href="/sources">SteamDesignPro source register</Link>.
        </p>
      </section>

      <section className="content-section checklist-section" aria-labelledby="checklist-geometry">
        <h2 id="checklist-geometry">2. Verify the finished enclosure geometry</h2>
        <ul className="print-checklist">
          <CheckItem>
            Measure finished inside width, depth, and height at the surfaces that
            will contain steam.
          </CheckItem>
          <CheckItem>
            Record ceiling slopes, dropped areas, full-height projections, and any
            condition that changes enclosed volume.
          </CheckItem>
          <CheckItem>
            Confirm door wall, hinge side, swing, clear opening, hardware, and
            conflicts with benches or fixtures.
          </CheckItem>
          <CheckItem>
            Mark solid walls, glass walls, exterior walls, windows, skylights, and
            penetrations.
          </CheckItem>
          <CheckItem>
            Have the responsible design and waterproofing professionals confirm
            the steam-rated enclosure, vapor-management, slope, drainage, and
            movement-joint strategy.
          </CheckItem>
        </ul>
        <p>
          Kohler&apos;s published selection method calculates cubic feet as width ×
          height × depth and recommends a ceiling height of 8 feet or less.{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Kohler selection guide
          </SourceLink>
        </p>
      </section>

      <section className="content-section checklist-section" aria-labelledby="checklist-sizing">
        <h2 id="checklist-sizing">3. Confirm the sizing decision</h2>
        <ul className="print-checklist">
          <CheckItem>Calculate and record actual finished cubic volume.</CheckItem>
          <CheckItem>
            Identify the first published model capacity that covers that volume.
          </CheckItem>
          <CheckItem>
            If the ceiling is above 8 feet, record how the required move through
            the generator sequence was applied and who confirmed it.
          </CheckItem>
          <CheckItem>
            Stop and request manufacturer review if the room is above 1,000 cu
            ft, the ceiling is above the documented 10-foot maximum, or the
            ceiling step moves beyond the published model sequence.
          </CheckItem>
          <CheckItem>
            Compare the result with Kohler&apos;s current calculator and retain the
            result with the project record.
          </CheckItem>
        </ul>
        <p>
          Review the <Link href="/steam-generator-sizing">full sizing table and boundary examples</Link>.{" "}
          The official capacity sequence and ceiling note are in the{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Kohler selection guide
          </SourceLink>
          .
        </p>
      </section>

      <section className="content-section checklist-section" aria-labelledby="checklist-system">
        <h2 id="checklist-system">4. Lock the compatible control path</h2>
        <ul className="print-checklist">
          <CheckItem>
            Identify the shower as mechanical, Anthem+ digital, or DTV+ digital.
          </CheckItem>
          <CheckItem>
            For a mechanical shower, verify K-5557, K-5558, or K-32312 against the
            current guide; pair K-32312 only with its listed separately sold steam
            head.
          </CheckItem>
          <CheckItem>
            For an Anthem+ or DTV+ system, verify K-5548-K1, K-5549-K1, or K-32311
            against the current guide; pair K-32311 only with its listed
            separately sold steam head.
          </CheckItem>
          <CheckItem>
            For tandem generators, include two steam heads and verify the tandem
            control or adapter path.
          </CheckItem>
          <CheckItem>
            Verify the exact finish suffix on each current product page; finish
            options vary by SKU.
          </CheckItem>
        </ul>
        <p className="source-note">
          Controller, adapter, and head combinations:{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Kohler controller and steam-head chart
          </SourceLink>
          . Current displayed products and finishes:{" "}
          <SourceLink href={OFFICIAL_SOURCES.steamCatalog}>
            Kohler Invigoration catalog results
          </SourceLink>
          .
        </p>
      </section>

      <section className="content-section checklist-section" aria-labelledby="checklist-placement">
        <h2 id="checklist-placement">5. Coordinate equipment and fixture locations</h2>
        <ul className="print-checklist">
          <CheckItem>
            Dimension the proposed steam head, control, shower fixture, bench,
            door, and user standing area on plan and elevation.
          </CheckItem>
          <CheckItem>
            Keep the steam head out of likely body-contact zones and verify all
            model-specific placement requirements in the current installation
            guide.
          </CheckItem>
          <CheckItem>
            Confirm the steam path from generator to head is 25 feet or less, or
            stop for manufacturer review.
          </CheckItem>
          <CheckItem>
            Confirm the generator location is dry, ventilated, accessible for
            service, and otherwise compliant with the exact current manual.
          </CheckItem>
          <CheckItem>
            Coordinate blocking, access panels, steam piping, controls, sensors,
            electrical equipment, water, relief, drains, and penetrations before
            framing and again before close-in.
          </CheckItem>
        </ul>
        <p>
          Kohler&apos;s selection guide publishes the 25-foot generator-to-steam-head
          limit. Its current steam-adapter instructions also warn that the steam
          head is hot during operation and require compliance with local
          plumbing, building, and electrical codes.{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Distance requirement
          </SourceLink>{" "}
          <SourceLink href={OFFICIAL_SOURCES.generator5to11Instructions}>
            Current generator safety and code instructions
          </SourceLink>
        </p>
      </section>

      <section className="content-section checklist-section" aria-labelledby="checklist-electrical">
        <h2 id="checklist-electrical">6. Electrical coordination</h2>
        <ul className="print-checklist">
          <CheckItem>
            Give the licensed electrician the exact generator SKU, published kW,
            voltage, amperage, frequency, and current installation guide.
          </CheckItem>
          <CheckItem>
            Confirm available service capacity, load calculation, conductor and
            raceway design, disconnecting means, bonding, protection, routing,
            working clearances, permits, and inspections.
          </CheckItem>
          <CheckItem>
            For tandem models, coordinate two dedicated 240 V circuits at the
            amperage published for the selected tandem SKU.
          </CheckItem>
          <CheckItem>
            Document the licensed electrician&apos;s resolution of Kohler&apos;s “no
            GFCI” manufacturer instruction against current adopted code and the
            authority having jurisdiction.
          </CheckItem>
        </ul>
        <div className="callout callout--warning">
          <p>
            Do not treat the planner&apos;s electrical summary as a wiring
            specification. Kohler publishes dedicated-circuit values and the no-GFCI
            statement in its selection guide; local code and the licensed
            professional still control the project-specific design.{" "}
            <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
              Manufacturer electrical table and note
            </SourceLink>
          </p>
        </div>
      </section>

      <section className="content-section checklist-section" aria-labelledby="checklist-plumbing">
        <h2 id="checklist-plumbing">7. Plumbing, drainage, and service coordination</h2>
        <ul className="print-checklist">
          <CheckItem>
            Have the licensed plumber review water quality, pressure, supply,
            steam, relief, drain, flushing, and service requirements in the exact
            manual.
          </CheckItem>
          <CheckItem>
            Include the appropriate drain pan in the coordination plan; for tandem
            systems, include two pans as directed by Kohler.
          </CheckItem>
          <CheckItem>
            Coordinate penetrations and sealants with the selected steam-rated
            waterproofing system and its manufacturer.
          </CheckItem>
          <CheckItem>
            Preserve permanent access needed for inspection, maintenance,
            replacement, and leak response.
          </CheckItem>
          <CheckItem>
            Photograph and dimension concealed rough-in before walls or ceilings
            are closed.
          </CheckItem>
        </ul>
        <p>
          Kohler&apos;s current steam category page identifies a drain pan as part of
          steam-generator planning, and its selection guide states that tandem
          systems use two drain pans.{" "}
          <SourceLink href={OFFICIAL_SOURCES.steamCatalog}>
            Kohler steam category
          </SourceLink>{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Tandem drain-pan note
          </SourceLink>
        </p>
      </section>

      <section className="content-section checklist-section" aria-labelledby="checklist-closeout">
        <h2 id="checklist-closeout">8. Before commissioning and handoff</h2>
        <ul className="print-checklist">
          <CheckItem>
            Confirm inspections and trade sign-offs required by the permit
            authority are complete.
          </CheckItem>
          <CheckItem>
            Have the installer commission and test the system using the current
            manufacturer procedure.
          </CheckItem>
          <CheckItem>
            Verify that controls, safety information, shutdown, cleaning, and
            maintenance have been explained to the owner.
          </CheckItem>
          <CheckItem>
            Deliver manuals, model and serial numbers, warranty information,
            inspection records, concealed-condition photos, and the final
            as-built equipment locations.
          </CheckItem>
          <CheckItem>
            Replace preliminary planner outputs with verified as-built
            information; keep assumptions clearly labeled if they remain.
          </CheckItem>
        </ul>
      </section>
    </ContentPage>
  );
}
