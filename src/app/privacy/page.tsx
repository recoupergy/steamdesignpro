import Link from "next/link";

import { ContentPage, contentMetadata } from "@/components/content";

export const metadata = contentMetadata({
  title: "Privacy Policy | SteamDesignPro",
  description:
    "How SaunaShare, Inc. handles planner inputs, local browser storage, share links, operational logs, privacy requests, and third-party source links on SteamDesignPro.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ContentPage
      path="/privacy"
      eyebrow="Legal"
      title="Privacy policy"
      summary="This policy explains how SaunaShare, Inc., the operator of SteamDesignPro, handles information when you use the website and browser-based steam-shower planner."
      breadcrumbs={[{ label: "Privacy" }]}
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

      <section className="content-section" aria-labelledby="privacy-scope">
        <h2 id="privacy-scope">1. Scope and operator</h2>
        <p>
          This policy applies to steamdesignpro.com and the SteamDesignPro
          planning application. The service is owned and operated by SaunaShare,
          Inc. It does not govern Kohler websites or other third-party services
          reached through source links.
        </p>
      </section>

      <section className="content-section" aria-labelledby="privacy-information">
        <h2 id="privacy-information">2. Information involved in using the planner</h2>
        <h3>Planner information you enter</h3>
        <p>
          Planner inputs can include room dimensions, unit preference, wall and
          door configuration, bench and fixture placement, generator location,
          finish selections, project notes, and related design assumptions. The
          core planner does not require an account.
        </p>
        <h3>Local autosave</h3>
        <p>
          To restore work in the same browser, the planner may store project state
          using local browser storage. Local storage remains on that browser
          unless you clear it, reset the planner, use a private-browsing session,
          or the browser or device removes it. Another person who can use the same
          browser profile may be able to view locally saved work.
        </p>
        <h3>Share links</h3>
        <p>
          When you create or copy a shareable plan link, design state may be
          encoded in the URL. Anyone who receives that URL can read and open the
          information it contains. URLs may also appear in browser history,
          bookmarks, server logs, screenshots, messaging services, or referrer
          data. Do not place personal, confidential, security-sensitive, or
          regulated information in planner notes or share links.
        </p>
        <h3>Operational data</h3>
        <p>
          Like most websites, SteamDesignPro and its hosting or security providers
          may process technical request data such as IP address, device and
          browser type, requested URL, referring page, timestamps, diagnostics,
          and security events. This information is used to deliver, protect,
          troubleshoot, and improve the service.
        </p>
        <h3>Communications</h3>
        <p>
          If you contact SaunaShare, Inc., we process the contact details, message,
          attachments, and related correspondence needed to respond and maintain a
          record of the request.
        </p>
      </section>

      <section className="content-section" aria-labelledby="privacy-use">
        <h2 id="privacy-use">3. How information is used</h2>
        <ul>
          <li>Provide and restore planner functionality.</li>
          <li>Generate a share link when you request one.</li>
          <li>Maintain site reliability, accessibility, and security.</li>
          <li>Diagnose errors and prevent abuse.</li>
          <li>Respond to questions, requests, or legal obligations.</li>
          <li>
            Understand aggregate service performance without using planner
            content for unrelated advertising.
          </li>
        </ul>
      </section>

      <section className="content-section" aria-labelledby="privacy-cookies">
        <h2 id="privacy-cookies">4. Browser storage, cookies, and advertising</h2>
        <p>
          Local browser storage used for autosave is functional storage, not an
          advertising profile. At the effective date, SteamDesignPro does not sell
          personal information or use advertising cookies for cross-context
          behavioral advertising. Infrastructure providers may use strictly
          necessary cookies or similar mechanisms for security, load balancing,
          or service operation. If the site&apos;s analytics or advertising
          practices materially change, this policy and any legally required
          choices will be updated.
        </p>
      </section>

      <section className="content-section" aria-labelledby="privacy-disclosure">
        <h2 id="privacy-disclosure">5. When information may be disclosed</h2>
        <p>Information may be disclosed only as reasonably needed:</p>
        <ul>
          <li>
            To hosting, infrastructure, security, and professional-service
            providers working on SaunaShare, Inc.&apos;s behalf.
          </li>
          <li>
            When you intentionally share a planner URL or direct us to disclose
            information.
          </li>
          <li>
            To comply with law, legal process, or a valid government request.
          </li>
          <li>
            To protect rights, safety, service integrity, or prevent fraud and
            abuse.
          </li>
          <li>
            In connection with a merger, financing, acquisition, reorganization,
            or sale of relevant business assets, subject to applicable law.
          </li>
        </ul>
        <p>
          Third-party source links are ordinary outbound links. The destination
          site receives information normally sent by a browser when you follow a
          link and applies its own privacy policy.
        </p>
      </section>

      <section className="content-section" aria-labelledby="privacy-retention">
        <h2 id="privacy-retention">6. Retention and deletion</h2>
        <p>
          Locally saved planner state is controlled through your browser and is
          retained until it is reset, cleared, or removed by the browser or
          device. Operational logs and communications are retained only as long as
          reasonably needed for the purposes described above, including security,
          support, legal, and recordkeeping needs. Backup and security systems may
          retain limited copies for an additional period.
        </p>
      </section>

      <section className="content-section" aria-labelledby="privacy-choices">
        <h2 id="privacy-choices">7. Your choices and privacy rights</h2>
        <p>
          You can avoid local autosave by using appropriate browser controls,
          clear stored site data through your browser, reset a plan, and choose
          not to distribute a share URL. Depending on where you live, you may also
          have rights to request access, correction, deletion, or restriction of
          personal information, or to appeal a response.
        </p>
        <p>
          Direct privacy requests to SaunaShare, Inc., attention Privacy,
          through the company&apos;s current published business contact channel.
          We may need to verify the request and may retain information where
          permitted or required by law.
        </p>
      </section>

      <section className="content-section" aria-labelledby="privacy-security">
        <h2 id="privacy-security">8. Security and children</h2>
        <p>
          SaunaShare, Inc. uses reasonable administrative and technical measures
          appropriate to the service, but no browser, transmission, or storage
          method can be guaranteed completely secure. SteamDesignPro is a
          building-planning tool for adults and is not directed to children under
          13. We do not knowingly collect personal information from children under
          13 through the planner.
        </p>
      </section>

      <section className="content-section" aria-labelledby="privacy-changes">
        <h2 id="privacy-changes">9. Changes to this policy</h2>
        <p>
          This policy may be updated as the service or legal requirements change.
          The revised policy will be posted here with a new “last updated” date.
          Material changes will be communicated in an additional reasonable way
          when required by law.
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
