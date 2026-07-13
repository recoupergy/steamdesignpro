import Link from "next/link";
import { KOHLER_CONTROLS } from "@/lib/kohler/controls";

import {
  ContentPage,
  OFFICIAL_SOURCES,
  contentMetadata,
} from "@/components/content";

export const metadata = contentMetadata({
  title: "Official Kohler Sources & Research Method | SteamDesignPro",
  description:
    "The primary-source register behind SteamDesignPro’s current Kohler Invigoration K-323xx sizing, compatibility, electrical, and planning guidance.",
  path: "/sources",
});

const sourceRecords = [
  {
    title: "Kohler steam calculator",
    url: OFFICIAL_SOURCES.calculator,
    identity: "Live Kohler web tool; no fixed revision shown",
    usedFor:
      "Manufacturer cross-check and confirmation of the room-dimension, shower-system, and steam-head inputs Kohler currently requests.",
    caution:
      "A calculator result is a planning input, not a substitute for the exact product specification and installation documents.",
  },
  {
    title: "Select Your Controller and Steam Head",
    url: OFFICIAL_SOURCES.selectionGuide,
    identity: "Kohler form 22-3187-0824; © 2024 Kohler Co.",
    usedFor:
      "Current K-32324 through K-32335 capacity sequence, power and electrical table, ceiling-height note, 25-foot distance, tandem requirements, and control/steam-head paths.",
    caution:
      "The PDF says Kohler product finish availability varies by SKU and directs readers back to current product pages.",
  },
  {
    title: "Steam Generators for Home Use",
    url: OFFICIAL_SOURCES.generatorCatalog,
    identity: "Live Kohler category page; no fixed revision shown",
    usedFor:
      "Current commercial listing of the ten K-323xx Invigoration generator models.",
    caution:
      "SteamDesignPro displays the current list-price references from this catalog for budget planning. Prices, dealer availability, tax, freight, and installation can change and must be verified before ordering.",
  },
  {
    title: "Steam Generator (5 kW–11 kW) installation instructions",
    url: OFFICIAL_SOURCES.generator5to11Instructions,
    identity: "Kohler document 1601844-2-B at last review",
    usedFor:
      "Current K-32324 through K-32327 and related tandem installation context, including the 10-foot maximum ceiling, 25-foot steam-head distance, access, clearances, placement warnings, circuits, and local-code direction.",
    caution:
      "This is an installation source, not permission for an unlicensed user to design or perform the work. Retrieve the document attached to the exact selected SKU again before rough-in.",
  },
  {
    title: "Steam Generator (13 kW–15 kW) installation instructions",
    url: OFFICIAL_SOURCES.generator13to15Instructions,
    identity: "Kohler document 1601845-2-B at last review",
    usedFor:
      "Current K-32328, K-32329, and related tandem installation-family cross-check for the documented ceiling range and equipment requirements.",
    caution:
      "Requirements can differ by generator family. Do not apply a clearance or electrical value from one family to another without exact-model confirmation.",
  },
  {
    title: "Invigoration steam-showering product results",
    url: OFFICIAL_SOURCES.steamCatalog,
    identity: "Live Kohler filtered product category; no fixed revision shown",
    usedFor:
      "Current presence of K-32309, K-32310, K-32311, K-32312, K-323xx generators, and displayed drain-pan products.",
    caution:
      "A category filter is discovery evidence; exact SKU pages and documents control product-specific decisions.",
  },
  {
    title: "K-32324-NA 5 kW product page",
    url: OFFICIAL_SOURCES.generator5kw,
    identity: "Live Kohler product page",
    usedFor:
      "Model identity and current-series product-page reference for the smallest single generator.",
    caution:
      "Use the specification and installation downloads attached to the exact SKU when preparing construction documents.",
  },
  {
    title: "K-32327-NA 11 kW product page",
    url: OFFICIAL_SOURCES.generator11kw,
    identity: "Live Kohler product page",
    usedFor:
      "Model identity and current-series product-page reference for an intermediate single generator.",
    caution:
      "Do not infer adjacent model dimensions or requirements solely from this page.",
  },
  {
    title: "K-32333-NA 22 kW product page",
    url: OFFICIAL_SOURCES.generator22kw,
    identity: "Live Kohler product page",
    usedFor:
      "Model identity and current-series product-page reference for a tandem generator.",
    caution:
      "Tandem system counts and circuits are taken from the selection guide, not inferred from marketing imagery.",
  },
  {
    title: "K-32335-NA 30 kW product page",
    url: OFFICIAL_SOURCES.generator30kw,
    identity: "Live Kohler product page",
    usedFor:
      "Model identity and current-series product-page reference for the largest model in the published 1,000-cu-ft sequence.",
    caution:
      "SteamDesignPro stops beyond this published range rather than extrapolating another model.",
  },
  {
    title: "K-32335 specification sheet",
    url: OFFICIAL_SOURCES.generator30kwSpec,
    identity: "Live Kohler TechComm PDF; footer revision should be checked when downloaded",
    usedFor:
      "Direct technical-document cross-check for the current top-of-sequence tandem model.",
    caution:
      "Kohler states that specifications may be revised without notice; retain the downloaded revision with the project record.",
  },
  {
    title: "Digital steam adapter installation instructions",
    url: OFFICIAL_SOURCES.digitalAdapterInstructions,
    identity: "Kohler document 1581267-2-B at last review",
    usedFor:
      "Safety language, local-code instruction, digital-system context, and the distinction between planning and installation requirements.",
    caution:
      "Always retrieve the instructions attached to the exact adapter and system being installed; document revisions can change.",
  },
  {
    title: "Steam-head installation guide",
    url: OFFICIAL_SOURCES.steamHeadInstructions,
    identity: "Kohler document 1069332-2-C at last review",
    usedFor:
      "General source cross-check for steam-head installation concepts and warnings.",
    caution:
      "This is not used as dimensional provenance for K-32309 or K-32310. Current model-specific drawings control those representations.",
  },
  {
    title: "Studio KOHLER technical specifications portal",
    url: OFFICIAL_SOURCES.technicalResources,
    identity: "Live official professional-resource portal",
    usedFor:
      "Discovery of official specification sheets, installation instructions, CAD, BIM, Revit, and other technical files.",
    caution:
      "The existence of a download portal does not mean an official 3D file is available or licensed for every model.",
  },
] as const;

export default function SourcesPage() {
  return (
    <ContentPage
      path="/sources"
      eyebrow="Research record"
      title="Official sources behind SteamDesignPro"
      summary="Product facts in the planner are tied to first-party Kohler pages and documents. This public register identifies what each source supports, where it does not support an inference, and when the set was last reviewed."
      breadcrumbs={[{ label: "Sources" }]}
      plannerCtaTitle="See the sources next to the result"
      plannerCtaDescription="The planner keeps capacity, electrical characteristics, compatibility, and warning links alongside the preliminary recommendation so the reasoning can be checked."
    >
      <section className="content-section" aria-labelledby="sources-status">
        <h2 id="sources-status">Review status</h2>
        <dl className="source-status">
          <div>
            <dt>Manufacturer scope</dt>
            <dd>Kohler Invigoration Series only</dd>
          </div>
          <div>
            <dt>Generator family</dt>
            <dd>Current K-32324-NA through K-32335-NA sequence</dd>
          </div>
          <div>
            <dt>Last link and content review</dt>
            <dd>
              <time dateTime="2026-07-11">July 11, 2026</time>
            </dd>
          </div>
          <div>
            <dt>Canonical manufacturer domain</dt>
            <dd>kohler.com and its official Kohler technical-resource domains</dd>
          </div>
        </dl>
        <p>
          “Last reviewed” is not a promise that a manufacturer page has not
          changed since that date. Check the exact current documents again before
          specification, purchase, permit submission, rough-in, and installation.
        </p>
      </section>

      <section className="content-section" aria-labelledby="sources-register">
        <h2 id="sources-register">Primary-source register</h2>
        <div className="source-register">
          {sourceRecords.map((source, index) => (
            <article className="source-record" key={source.url}>
              <header>
                <p className="source-record__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3>
                  <a href={source.url} rel="external">
                    {source.title}
                  </a>
                </h3>
              </header>
              <p className="source-record__url">
                <span className="visually-hidden">Official URL: </span>
                <a href={source.url} rel="external">
                  {source.url}
                </a>
              </p>
              <dl>
                <div>
                  <dt>Identity</dt>
                  <dd>{source.identity}</dd>
                </div>
                <div>
                  <dt>Used for</dt>
                  <dd>{source.usedFor}</dd>
                </div>
                <div>
                  <dt>Boundary</dt>
                  <dd>{source.caution}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="finish-provenance">
        <h2 id="finish-provenance">Current finish-availability provenance</h2>
        <p>
          The planner exposes only the intersection of finish variants shown on the current product pages for every item in a compatible package. Specification-only colors are retained in the source data but are not offered as an orderable final package unless the live product page also lists them.
        </p>
        <div className="responsive-table-wrap">
          <table>
            <caption>Product-page finish selectors reviewed July 11, 2026.</caption>
            <thead><tr><th scope="col">SKU</th><th scope="col">Planner finishes</th><th scope="col">PDP provenance</th></tr></thead>
            <tbody>
              {[...KOHLER_CONTROLS.controls, ...KOHLER_CONTROLS.steamHeads].map((item) => (
                <tr key={item.sku}>
                  <th scope="row">{item.sku}</th>
                  <td>{item.pdpFinishCodes.join(", ")}</td>
                  <td><a href={item.pdpFinishSource.sourceUrl} rel="external">Current product page</a><br /><small>{item.pdpFinishSource.quote}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-section" aria-labelledby="sources-method">
        <h2 id="sources-method">How source conflicts are handled</h2>
        <ol className="step-list">
          <li>
            <h3>Prefer the exact current SKU</h3>
            <p>
              A current product-specific specification or installation document
              outranks a collection page, brochure, reseller, or superficially
              similar earlier model.
            </p>
          </li>
          <li>
            <h3>Keep source identity with the field</h3>
            <p>
              Capacity, voltage, amperage, dimensions, compatibility, and
              placement rules are stored with their source URL, retrieval date,
              document identity, and field-level provenance in the checked-in
              research data.
            </p>
          </li>
          <li>
            <h3>Do not silently migrate old model facts</h3>
            <p>
              Older K-17xx and K-55xx generator geometry or requirements are not
              treated as K-323xx facts. Where current model-specific evidence is
              unavailable, the planner labels the limitation rather than filling
              it with an old value.
            </p>
          </li>
          <li>
            <h3>Stop at unresolved contradictions</h3>
            <p>
              If two current official sources disagree in a way that could change
              a selection or installation, SteamDesignPro should flag
              manufacturer review instead of picking the more convenient value.
            </p>
          </li>
        </ol>
      </section>

      <section className="content-section" aria-labelledby="sources-scope">
        <h2 id="sources-scope">What this register does not claim</h2>
        <p>
          Listing an official source does not imply that Kohler reviewed,
          authorized, or endorses SteamDesignPro. It also does not turn
          manufacturer literature into project engineering. The{" "}
          <Link href="/steam-generator-sizing">sizing reference</Link> explains
          the planner&apos;s interpretation, and the{" "}
          <Link href="/steam-shower-checklist">project checklist</Link> identifies
          the decisions that remain with licensed professionals and the authority
          having jurisdiction.
        </p>
      </section>
    </ContentPage>
  );
}
