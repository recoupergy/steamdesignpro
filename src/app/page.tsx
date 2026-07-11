import type { Metadata } from "next";
import Link from "next/link";
import { PlannerShell } from "@/components/planner/planner-shell";

export const metadata: Metadata = {
  title: "Steam Shower Planner",
  description:
    "Enter finished steam-shower dimensions, see a live 3D and 2D enclosure, and receive a source-linked preliminary KOHLER Invigoration generator and control package.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SteamDesignPro",
    url: "https://steamdesignpro.com",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any modern web browser",
    browserRequirements: "JavaScript and WebGL recommended; an accessible 2D fallback is provided.",
    description:
      "A browser-based preliminary planning tool for steam-shower enclosure geometry and current KOHLER Invigoration equipment sizing.",
    creator: { "@type": "Organization", name: "SaunaShare, Inc." },
    featureList: [
      "Live 3D and 2D steam-shower plan",
      "US and metric dimensions",
      "Current KOHLER Invigoration generator sizing",
      "Controller and steam-head compatibility validation",
      "Versioned share links and PDF planning record",
    ],
  };

  return (
    <>
      <PlannerShell />
      <section className="home-facts" aria-labelledby="home-facts-title">
        <div>
          <p className="eyebrow">What this planner answers</p>
          <h1 id="home-facts-title">Preliminary steam-shower sizing, placement, and coordination in one workspace</h1>
        </div>
        <div className="home-facts-grid">
          <article>
            <h2>How is the generator sized?</h2>
            <p>
              The base calculation is finished width × depth × height. Current KOHLER guidance recommends an 8-foot-or-lower ceiling and advances one generator size for each foot above 8 feet, without exceeding a model’s published maximum.
            </p>
            <Link href="/steam-generator-sizing">Read the boundary-tested sizing method</Link>
          </article>
          <article>
            <h2>What does the result include?</h2>
            <p>
              The planner pairs the current K-323xx generator sequence with a documented mechanical, Anthem+, or DTV+ controller and compatible round, square, or linear steam head. Tandem systems show two generators, circuits, steam heads, and drain pans.
            </p>
            <Link href="/kohler">Review the current KOHLER model catalog</Link>
          </article>
          <article>
            <h2>What still needs a professional?</h2>
            <p>
              Final electrical, plumbing, waterproofing, vapor, structural, code, equipment, and installation decisions depend on the actual project. This tool is a discussion aid—not a permit, engineering, or construction document.
            </p>
            <Link href="/steam-shower-checklist">Use the coordination checklist</Link>
          </article>
        </div>
        <p className="home-source-note">
          Source basis retrieved July 11, 2026: current KOHLER K-323xx specifications, Form 22-3187-0824, and installation instructions 1601844-2-B / 1601845-2-B. <Link href="/sources">See revision-level provenance.</Link>
        </p>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }} />
    </>
  );
}
