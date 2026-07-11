import Link from "next/link";

import {
  ContentPage,
  OFFICIAL_SOURCES,
  SourceLink,
  contentMetadata,
} from "@/components/content";

export const metadata = contentMetadata({
  title: "Kohler Steam Generator Sizing Guide & Model Table",
  description:
    "Calculate finished steam-room volume, apply Kohler’s above-8-foot ceiling step, and compare current K-32324 through K-32335 Invigoration capacities.",
  path: "/steam-generator-sizing",
});

const generators = [
  {
    model: "K-32324-NA",
    slug: "k-32324-na",
    system: "Single",
    power: "5 kW",
    maximum: "84 cu ft",
    electrical: "1 × 240 V / 40 A",
  },
  {
    model: "K-32325-NA",
    slug: "k-32325-na",
    system: "Single",
    power: "7 kW",
    maximum: "112 cu ft",
    electrical: "1 × 240 V / 50 A",
  },
  {
    model: "K-32326-NA",
    slug: "k-32326-na",
    system: "Single",
    power: "9 kW",
    maximum: "240 cu ft",
    electrical: "1 × 240 V / 60 A",
  },
  {
    model: "K-32327-NA",
    slug: "k-32327-na",
    system: "Single",
    power: "11 kW",
    maximum: "317 cu ft",
    electrical: "1 × 240 V / 60 A",
  },
  {
    model: "K-32328-NA",
    slug: "k-32328-na",
    system: "Single",
    power: "13 kW",
    maximum: "447 cu ft",
    electrical: "1 × 240 V / 80 A",
  },
  {
    model: "K-32329-NA",
    slug: "k-32329-na",
    system: "Single",
    power: "15 kW",
    maximum: "500 cu ft",
    electrical: "1 × 240 V / 90 A",
  },
  {
    model: "K-32332-NA",
    slug: "k-32332-na",
    system: "Tandem",
    power: "18 kW",
    maximum: "550 cu ft",
    electrical: "2 × 240 V / 60 A",
  },
  {
    model: "K-32333-NA",
    slug: "k-32333-na",
    system: "Tandem",
    power: "22 kW",
    maximum: "634 cu ft",
    electrical: "2 × 240 V / 60 A",
  },
  {
    model: "K-32334-NA",
    slug: "k-32334-na",
    system: "Tandem",
    power: "26 kW",
    maximum: "894 cu ft",
    electrical: "2 × 240 V / 80 A",
  },
  {
    model: "K-32335-NA",
    slug: "k-32335-na",
    system: "Tandem",
    power: "30 kW",
    maximum: "1,000 cu ft",
    electrical: "2 × 240 V / 90 A",
  },
] as const;

export default function SteamGeneratorSizingPage() {
  return (
    <ContentPage
      path="/steam-generator-sizing"
      eyebrow="Sizing reference"
      title="Size a Kohler Invigoration steam generator from finished room volume"
      summary="The current published method is straightforward but has an important ceiling-height step: calculate the enclosure’s actual finished volume, select the first model whose rating covers it, then advance through the model sequence for ceiling height above 8 feet."
      breadcrumbs={[{ label: "Steam generator sizing" }]}
      plannerCtaTitle="Calculate a preliminary selection"
      plannerCtaDescription="Enter finished dimensions in the planner to see base volume, the ceiling-height review, the selected current-series model, and the source assumptions together."
    >
      <section className="content-section" aria-labelledby="sizing-answer">
        <h2 id="sizing-answer">The short answer</h2>
        <p className="direct-answer">
          Multiply finished inside width × depth × height. Choose the smallest
          current generator whose maximum volume is at least that result. Kohler
          recommends an 8-foot-or-lower ceiling; for each foot above 8 feet, move
          to the next generator size without disregarding the selected
          model&apos;s published volume limit.{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Kohler selection guide, form 22-3187-0824
          </SourceLink>
        </p>
        <p>
          SteamDesignPro treats any partial foot above 8 feet conservatively as a
          started additional foot and flags it for professional confirmation.
          That rounding treatment is this independent planner&apos;s cautious
          interpretation; the manufacturer document says “for each foot above 8
          feet.” Use Kohler&apos;s current calculator and project-specific
          documentation to confirm the final selection.{" "}
          <SourceLink href={OFFICIAL_SOURCES.calculator}>
            Kohler steam calculator
          </SourceLink>
        </p>
        <p>
          The current generator installation instructions reviewed for the
          K-323xx families identify 10 feet as the maximum ceiling height. A
          design above 10 feet is therefore outside the documented range used by
          this planner and requires manufacturer review.{" "}
          <SourceLink href={OFFICIAL_SOURCES.generator5to11Instructions}>
            Kohler 5–11 kW instructions 1601844-2-B
          </SourceLink>{" "}
          <SourceLink href={OFFICIAL_SOURCES.generator13to15Instructions}>
            Kohler 13–15 kW instructions 1601845-2-B
          </SourceLink>
        </p>
      </section>

      <section className="content-section" aria-labelledby="sizing-sequence">
        <h2 id="sizing-sequence">Current K-323xx model sequence</h2>
        <div className="table-scroll" role="region" aria-labelledby="sizing-sequence" tabIndex={0}>
          <table className="data-table">
            <caption>
              Published maximum volume, power, and electrical service for the
              Kohler Invigoration K-323xx sequence. Electrical frequency is
              50/60 Hz.
            </caption>
            <thead>
              <tr>
                <th scope="col">Model</th>
                <th scope="col">Configuration</th>
                <th scope="col">Power</th>
                <th scope="col">Maximum room volume</th>
                <th scope="col">Published dedicated service</th>
              </tr>
            </thead>
            <tbody>
              {generators.map((generator) => (
                <tr key={generator.model}>
                  <th scope="row">
                    <Link href={"/kohler/" + generator.slug}>{generator.model}</Link>
                  </th>
                  <td>{generator.system}</td>
                  <td>{generator.power}</td>
                  <td>{generator.maximum}</td>
                  <td>{generator.electrical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="source-note">
          Table source:{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Kohler “Select Your Controller and Steam Head,” form 22-3187-0824
          </SourceLink>
          . The electrical values shown for tandem models are per circuit; the
          source requires two dedicated circuits.
        </p>
      </section>

      <section className="content-section" aria-labelledby="sizing-method">
        <h2 id="sizing-method">A repeatable five-step method</h2>
        <ol className="step-list">
          <li>
            <h3>Use finished inside dimensions</h3>
            <p>
              Measure the steam-containing volume at the completed wall, floor,
              and ceiling planes. Convert all three dimensions to one unit system
              before multiplying.
            </p>
          </li>
          <li>
            <h3>Calculate actual base volume</h3>
            <p>
              In US units, <strong>width (ft) × depth (ft) × height (ft)</strong>{" "}
              gives cubic feet. Do not substitute floor area for volume.
            </p>
          </li>
          <li>
            <h3>Select by the first capacity boundary that covers the room</h3>
            <p>
              A result exactly on a published maximum remains within that
              boundary. A result even slightly above it moves to the next model:
              for example, 112 cu ft fits K-32325-NA, while 112.1 cu ft moves to
              K-32326-NA before ceiling adjustment.
            </p>
          </li>
          <li>
            <h3>Apply the ceiling-height sequence step</h3>
            <p>
              At or below 8 feet, there is no extra step. Above 8 feet,
              SteamDesignPro advances one model for every started foot as a
              conservative planning treatment. It never uses that step to select
              a model whose published maximum is below the actual room volume.
            </p>
          </li>
          <li>
            <h3>Stop when the published range stops</h3>
            <p>
              A room over 1,000 cu ft, a ceiling above the documented 10-foot
              maximum, or a ceiling adjustment that would move beyond
              K-32335-NA is outside this method. The planner reports “manufacturer
              review required” instead of extrapolating a larger system.
            </p>
          </li>
        </ol>
      </section>

      <section className="content-section" aria-labelledby="sizing-examples">
        <h2 id="sizing-examples">Boundary examples</h2>
        <div className="example-grid">
          <article className="example">
            <h3>Exactly at a published limit</h3>
            <p>
              4 ft × 3.5 ft × 8 ft = 112 cu ft. With no above-8-foot step, the
              preliminary selection is K-32325-NA, 7 kW.
            </p>
          </article>
          <article className="example">
            <h3>Just over a limit</h3>
            <p>
              4 ft × 3.51 ft × 8 ft = 112.32 cu ft. That exceeds 112 cu ft, so the
              preliminary base selection moves to K-32326-NA, 9 kW.
            </p>
          </article>
          <article className="example">
            <h3>Partial foot above 8 feet</h3>
            <p>
              5 ft × 4 ft × 8.5 ft = 170 cu ft. Volume first points to
              K-32326-NA; the planner&apos;s conservative started-foot treatment
              advances the preliminary selection to K-32327-NA and flags the
              interpretation for confirmation.
            </p>
          </article>
          <article className="example">
            <h3>Outside the documented range</h3>
            <p>
              A room above 1,000 cu ft or a ceiling above the documented 10-foot
              maximum receives no model recommendation from this sequence.
              Contact Kohler and the responsible design professionals.
            </p>
          </article>
        </div>
        <p className="source-note">
          Capacity boundaries and the manufacturer&apos;s 8-foot ceiling note:{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            official selection guide
          </SourceLink>
          .
        </p>
      </section>

      <section className="content-section" aria-labelledby="sizing-system">
        <h2 id="sizing-system">What changes with a tandem selection</h2>
        <p>
          The four tandem SKUs represent paired-generator systems. Kohler&apos;s
          selection guide requires two dedicated circuits and two drain pans, and
          its control chart requires two steam heads for tandem generators.{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Kohler tandem requirements
          </SourceLink>
        </p>
        <p>
          Consequently, the jump from a 15 kW single system to an 18 kW tandem
          system changes more than capacity. It affects equipment count, branch
          circuits, steam outlets, drainage planning, space, access, and control
          compatibility. Those consequences should be reviewed before treating
          the model number as final.
        </p>
      </section>

      <section className="content-section" aria-labelledby="sizing-electrical">
        <h2 id="sizing-electrical">Electrical wording that needs professional review</h2>
        <div className="callout callout--warning">
          <h3>Manufacturer instruction and local code must be reconciled</h3>
          <p>
            Kohler&apos;s published guide calls for a separate dedicated 240 V
            circuit and says no GFCI should be connected to the circuit.{" "}
            <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
              See the manufacturer note
            </SourceLink>
            . SteamDesignPro repeats that wording only as a sourced manufacturer
            requirement. It is not electrical design advice and does not override
            adopted code, a permit authority, or the licensed electrician
            responsible for the installation.
          </p>
        </div>
      </section>

      <section className="content-section" aria-labelledby="sizing-questions">
        <h2 id="sizing-questions">Questions the calculation does not settle</h2>
        <dl className="answer-list">
          <div>
            <dt>Does tile, stone, or glass change this published table?</dt>
            <dd>
              The current Kohler selection procedure cited here does not publish a
              surface-material multiplier. SteamDesignPro records material as a
              construction input but does not silently alter generator capacity.
            </dd>
          </div>
          <div>
            <dt>Can the generator be more than 25 feet from the steam head?</dt>
            <dd>
              Kohler says it needs to be installed within 25 feet. The planner
              flags a longer entered distance instead of assuming equivalent
              performance.{" "}
              <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
                Manufacturer distance note
              </SourceLink>
            </dd>
          </div>
          <div>
            <dt>Is the capacity table an electrical design?</dt>
            <dd>
              No. It reports manufacturer nameplate planning values. A licensed
              electrician must design the installation and confirm every
              applicable requirement.
            </dd>
          </div>
        </dl>
        <p>
          Continue with the <Link href="/guide">planning guide</Link>, prepare the{" "}
          <Link href="/steam-shower-checklist">project checklist</Link>, or inspect
          the <Link href="/sources">official-source register</Link>.
        </p>
      </section>
    </ContentPage>
  );
}
