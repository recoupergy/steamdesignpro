import Link from "next/link";

import {
  ContentPage,
  OFFICIAL_SOURCES,
  SourceLink,
  contentMetadata,
} from "@/components/content";

export const metadata = contentMetadata({
  title: "Terms of Use | SteamDesignPro",
  description:
    "Terms governing use of the SteamDesignPro independent steam-shower planning aid operated by SaunaShare, Inc., including reliance and professional-review limits.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ContentPage
      path="/terms"
      eyebrow="Legal"
      title="Terms of use"
      summary="These terms govern access to SteamDesignPro, a preliminary browser-based planning aid owned and operated by SaunaShare, Inc. They explain the service’s limited purpose and your responsibility to verify every project decision."
      breadcrumbs={[{ label: "Terms" }]}
      showPlannerCta={false}
    >
      <div className="policy-meta">
        <p>
          <strong>Effective:</strong>{" "}
          <time dateTime="2026-07-11">July 11, 2026</time>
        </p>
        <p>
          <strong>Last updated:</strong>{" "}
          <time dateTime="2026-07-11">July 11, 2026</time>
        </p>
      </div>

      <section className="content-section" aria-labelledby="terms-acceptance">
        <h2 id="terms-acceptance">1. Acceptance and eligibility</h2>
        <p>
          By accessing or using SteamDesignPro, you agree to these terms and the{" "}
          <Link href="/privacy">privacy policy</Link>. If you do not agree, do not
          use the service. You must be legally able to enter into these terms, and
          if you use the service for a company or project team, you represent that
          you have authority to do so on its behalf.
        </p>
      </section>

      <section className="content-section" aria-labelledby="terms-purpose">
        <h2 id="terms-purpose">2. Limited purpose of the service</h2>
        <p>
          SteamDesignPro helps users visualize preliminary steam-shower geometry,
          apply a documented manufacturer sizing sequence, explore compatible
          product paths, and organize questions for a project team. Dimensions,
          2D or 3D representations, warnings, model selections, electrical
          characteristics, exports, and checklists are planning aids only.
        </p>
        <p>
          The service does not provide and must not be treated as engineering,
          architectural, interior-design, accessibility, waterproofing,
          vapor-management, electrical, plumbing, structural, mechanical, code,
          permit, health, safety, procurement, commissioning, or installation
          services or documents. No output is stamped, certified, site-verified,
          or approved by a manufacturer or authority having jurisdiction.
        </p>
      </section>

      <section className="content-section" aria-labelledby="terms-authority">
        <h2 id="terms-authority">3. Documents and professionals that control</h2>
        <p>
          You are responsible for obtaining and following the current documents
          for every exact product; verifying site conditions and measurements;
          complying with applicable laws, codes, permits, and inspections; and
          retaining qualified licensed professionals for all work that requires
          them. Current manufacturer instructions, project documents prepared by
          responsible professionals, adopted code, and the authority having
          jurisdiction take precedence over SteamDesignPro.
        </p>
        <p>
          Kohler states that its product specifications can be revised. The
          current selection guide also presents electrical and system
          requirements that must be reconciled with project-specific conditions
          and local code.{" "}
          <SourceLink href={OFFICIAL_SOURCES.selectionGuide}>
            Kohler selection guide
          </SourceLink>{" "}
          <SourceLink href={OFFICIAL_SOURCES.digitalAdapterInstructions}>
            Kohler installation instructions and code notice
          </SourceLink>
        </p>
      </section>

      <section className="content-section" aria-labelledby="terms-independent">
        <h2 id="terms-independent">4. Independent service and trademarks</h2>
        <p>
          SteamDesignPro and SaunaShare, Inc. are independent of Kohler Co. The
          service is not affiliated with, endorsed by, certified by, sponsored by,
          or authorized by Kohler Co. and is not an official Kohler calculator,
          specification service, or installation program.
        </p>
        <p>
          KOHLER, Invigoration, Anthem, DTV+, and related product names and marks
          are trademarks of Kohler Co. or its affiliates. Other trademarks belong
          to their respective owners. Their use identifies referenced products
          and does not imply ownership, permission, endorsement, or compatibility
          beyond what a cited current source supports.
        </p>
      </section>

      <section className="content-section" aria-labelledby="terms-responsibility">
        <h2 id="terms-responsibility">5. Your responsibilities</h2>
        <p>When using SteamDesignPro, you agree to:</p>
        <ul>
          <li>
            Enter accurate finished dimensions and clearly label estimates or
            unknown conditions.
          </li>
          <li>
            Independently check calculations, model numbers, compatibility,
            quantities, source revisions, and field conditions.
          </li>
          <li>
            Not order products, perform work, or direct others to perform work
            solely from a planner result.
          </li>
          <li>
            Give the responsible professionals complete project information,
            including warnings and assumptions.
          </li>
          <li>
            Keep personal, confidential, security-sensitive, and regulated
            information out of planner notes and shareable URLs.
          </li>
          <li>
            Use the service lawfully and without disrupting, probing, overloading,
            or attempting unauthorized access to it.
          </li>
        </ul>
      </section>

      <section className="content-section" aria-labelledby="terms-license">
        <h2 id="terms-license">6. Permission to use SteamDesignPro</h2>
        <p>
          Subject to these terms, SaunaShare, Inc. grants you a limited,
          revocable, nonexclusive, nontransferable permission to use the service
          and create planning outputs for your own lawful personal, client, or
          internal project coordination. This permission does not transfer
          ownership of the site, software, visual design, research compilation,
          or other SteamDesignPro materials.
        </p>
        <p>
          You may share an output with the project team if its source notes,
          limitations, and disclaimers remain clear. You may not present an output
          as a certified drawing, remove attribution in a misleading way, resell
          access to the service, copy substantial portions to create a competing
          database, or use the service in a way that infringes another person&apos;s
          rights.
        </p>
      </section>

      <section className="content-section" aria-labelledby="terms-links">
        <h2 id="terms-links">7. Manufacturer information and third-party links</h2>
        <p>
          Product facts and source links are provided for research traceability.
          Third-party sites are controlled by their owners and can change without
          notice. SaunaShare, Inc. does not control their content, availability,
          terms, privacy practices, pricing, inventory, or downloads. A link is
          not an endorsement, and its inclusion does not establish a partnership.
        </p>
        <p>
          Review the <Link href="/sources">source register</Link> for retrieval
          dates and evidence boundaries. You remain responsible for retrieving
          the current official materials for the exact product from the
          manufacturer.
        </p>
      </section>

      <section className="content-section" aria-labelledby="terms-availability">
        <h2 id="terms-availability">8. Service changes and availability</h2>
        <p>
          SaunaShare, Inc. may correct data, change features, add or remove
          supported products, suspend access, or discontinue the service. A saved
          local plan or shared URL may become incompatible with a later version,
          although SteamDesignPro may provide migration or recovery tools when
          practical. Keep independent copies of project records that matter to
          you.
        </p>
      </section>

      <section className="content-section" aria-labelledby="terms-warranty">
        <h2 id="terms-warranty">9. No warranty</h2>
        <p>
          To the fullest extent permitted by law, SteamDesignPro is provided “as
          is” and “as available.” SaunaShare, Inc. disclaims implied warranties,
          including merchantability, fitness for a particular purpose, title, and
          noninfringement. We do not warrant that the service or any output is
          complete, current, error-free, continuously available, suitable for a
          particular site, accepted by a manufacturer or code official, or safe
          to build from.
        </p>
        <p>
          Some jurisdictions do not allow certain warranty exclusions, so parts
          of this section may not apply to you.
        </p>
      </section>

      <section className="content-section" aria-labelledby="terms-liability">
        <h2 id="terms-liability">10. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, SaunaShare, Inc. and its
          officers, employees, contractors, and service providers will not be
          liable for indirect, incidental, special, consequential, exemplary, or
          punitive damages, or for lost data, revenue, profit, business, or
          opportunity, arising from or related to the service or reliance on an
          output. This does not limit liability that cannot legally be excluded or
          limited.
        </p>
      </section>

      <section className="content-section" aria-labelledby="terms-general">
        <h2 id="terms-general">11. General terms</h2>
        <p>
          Applicable law governs these terms without displacing non-waivable
          consumer rights. If a provision is unenforceable, it will be limited to
          the minimum extent necessary and the remaining provisions will
          continue. A delay in enforcement is not a waiver. You may not assign
          these terms without SaunaShare, Inc.&apos;s consent; SaunaShare, Inc. may
          assign them as part of a reorganization or transfer of the service.
        </p>
      </section>

      <section className="content-section" aria-labelledby="terms-changes">
        <h2 id="terms-changes">12. Changes and contact</h2>
        <p>
          These terms may be updated as the service changes. The updated version
          will be posted here with a revised date, and additional notice will be
          provided when required by law. Continued use after an update takes
          effect means you accept the revised terms.
        </p>
        <p>
          Direct questions about these terms to SaunaShare, Inc. through the
          company&apos;s current published business contact channel. Product,
          sizing, installation, warranty, or technical questions about KOHLER
          products should be directed to Kohler or the appropriate licensed
          project professional.
        </p>
      </section>
      <p className="policy-return">
        <Link href="/design?v=1&starter=compact">
          Return to the compact starter plan
        </Link>
      </p>
    </ContentPage>
  );
}
