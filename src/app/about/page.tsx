import Link from "next/link";

import {
  ContentPage,
  OFFICIAL_SOURCES,
  SourceLink,
  contentMetadata,
} from "@/components/content";

export const metadata = contentMetadata({
  title: "About SteamDesignPro and SaunaShare, Inc.",
  description:
    "Learn who operates SteamDesignPro, why it is an independent planning aid, how its Kohler source research is handled, and where professional responsibility begins.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ContentPage
      path="/about"
      eyebrow="About the project"
      title="A visual planning aid for better steam-shower coordination"
      summary="SteamDesignPro is owned and operated by SaunaShare, Inc. It helps project teams turn room geometry and current manufacturer facts into a preliminary plan that can be inspected, discussed, and corrected before construction decisions become expensive."
      breadcrumbs={[{ label: "About" }]}
      plannerCtaTitle="Plan first, then verify"
      plannerCtaDescription="Use the planner to make room assumptions and equipment questions visible. Take the result—not just a model number—to the people responsible for the project."
    >
      <section className="content-section" aria-labelledby="about-purpose">
        <h2 id="about-purpose">Why SteamDesignPro exists</h2>
        <p>
          Steam-shower planning crosses several disciplines at once: interior
          geometry, enclosure construction, waterproofing and vapor management,
          plumbing, electrical service, controls, service access, and product
          compatibility. A product selector alone does not show where a door
          collides with a bench, where a hot steam head sits relative to a user,
          or which assumptions still need a professional answer.
        </p>
        <p>
          SteamDesignPro brings those conversations into one dimensioned visual
          workspace. Its role is to reveal relationships and unresolved questions,
          not to claim authority over the design professionals, licensed trades,
          manufacturer, or code officials who control the work.
        </p>
      </section>

      <section className="content-section" aria-labelledby="about-scope">
        <h2 id="about-scope">A deliberately narrow first release</h2>
        <p>
          The first release supports one manufacturer and one current generator
          family: Kohler Invigoration K-32324-NA through K-32335-NA. Kohler&apos;s
          current steam-generator catalog lists that sequence, and its current
          selection guide publishes the related capacity and control paths.{" "}
          <SourceLink href={OFFICIAL_SOURCES.generatorCatalog}>
            Kohler steam-generator catalog
          </SourceLink>{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Kohler selection guide
          </SourceLink>
        </p>
        <p>
          This narrow scope is intentional. Product rules are not interchangeable
          across manufacturers or model generations. SteamDesignPro does not
          present placeholder brands, mix systems, or silently reuse the geometry
          of earlier K-17xx or K-55xx generators as if it described current
          K-323xx equipment.
        </p>
      </section>

      <section className="content-section" aria-labelledby="about-method">
        <h2 id="about-method">How product claims are handled</h2>
        <dl className="principle-list">
          <div>
            <dt>First-party before secondary</dt>
            <dd>
              Capacity, electrical characteristics, compatibility, and placement
              rules must point to a current official manufacturer page or
              document.
            </dd>
          </div>
          <div>
            <dt>Exact model before analogy</dt>
            <dd>
              A similar-looking product is not treated as dimensional evidence
              for the selected SKU.
            </dd>
          </div>
          <div>
            <dt>Boundaries before false precision</dt>
            <dd>
              When the published sequence or evidence ends, the planner stops and
              requests manufacturer or professional review.
            </dd>
          </div>
          <div>
            <dt>Source and interpretation kept separate</dt>
            <dd>
              A manufacturer statement is cited as such; a conservative planner
              interpretation is labeled and does not masquerade as a quote or
              certification.
            </dd>
          </div>
        </dl>
        <p>
          The public <Link href="/sources">source register</Link> shows the
          reviewed documents, retrieval date, use, and known limitations. The{" "}
          <Link href="/guide">planning guide</Link> explains how to carry that
          evidence into a project handoff.
        </p>
      </section>

      <section className="content-section" aria-labelledby="about-independence">
        <h2 id="about-independence">Independent by design</h2>
        <p>
          SaunaShare, Inc. is not Kohler Co., and SteamDesignPro is not an
          official Kohler calculator, sales channel, engineering service, or
          installer certification program. No affiliation, endorsement,
          certification, or authorization is implied. Manufacturer names and
          model identifiers are used to describe the products to which the cited
          planning data applies.
        </p>
        <p>
          For an official manufacturer calculation, use the{" "}
          <SourceLink href={OFFICIAL_SOURCES.calculator}>
            Kohler steam calculator
          </SourceLink>
          . For project decisions, use the exact current product documents,
          adopted codes, the authority having jurisdiction, verified site
          conditions, and qualified licensed professionals.
        </p>
      </section>

      <section className="content-section" aria-labelledby="about-useful">
        <h2 id="about-useful">What a useful result looks like</h2>
        <p>
          A successful planner session is not merely a recommended SKU. It is a
          compact record of finished dimensions, volume, ceiling treatment,
          proposed system and control path, equipment distance, fixture
          relationships, warnings, sources, assumptions, and assigned follow-up
          work. If the plan uncovers a conflict early, it has done its job.
        </p>
      </section>
    </ContentPage>
  );
}
