import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  Check,
  CircuitBoard,
  Droplets,
  FileText,
  Gauge,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { SteamRoomPreview } from "@/components/landing/steam-room-preview";

export const metadata: Metadata = {
  title: { absolute: "SteamDesignPro | Free 3D Steam Shower Planner" },
  description:
    "Design a steam-shower enclosure in 3D, size current KOHLER Invigoration equipment, coordinate critical placements, and export a source-linked planning PDF.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "SteamDesignPro",
    url: "https://steamdesignpro.com",
    title: "SteamDesignPro | Free 3D Steam Shower Planner",
    description:
      "See the enclosure, preliminary equipment match, placement checks, and project handoff before the tile goes up.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "SteamDesignPro steam-shower planner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SteamDesignPro | Free 3D Steam Shower Planner",
    description:
      "See the enclosure, preliminary equipment match, placement checks, and project handoff before the tile goes up.",
    images: ["/opengraph-image"],
  },
};

const designerHref = "/design";

const workflow = [
  {
    number: "01",
    title: "Enter the enclosure",
    body: "Set finished width, depth, height, surface, glass walls, door, bench, and ceiling slope.",
  },
  {
    number: "02",
    title: "Place every touchpoint",
    body: "Position the fixture, control, steam head, generator location, and a second head when tandem equipment requires it.",
  },
  {
    number: "03",
    title: "Match the system",
    body: "Watch the preliminary generator, electrical demand, controls, heads, finish compatibility, and route checks update live.",
  },
  {
    number: "04",
    title: "Take the plan with you",
    body: "Copy a versioned share link or export a four-page planning record for early trade coordination.",
  },
] as const;

const plannerResolves = [
  "Preliminary generator sizing",
  "Enclosure geometry and fixture relationships",
  "Current control and steam-head compatibility",
  "Finish availability intersections",
  "Generator route and tandem coordination",
  "A shared, versioned project record",
] as const;

const professionalsFinalize = [
  "Electrical and plumbing design",
  "Waterproofing and vapor strategy",
  "Structure, accessibility, and permits",
  "Concealed routing and service access",
  "Local-code and AHJ requirements",
  "Final product and installation approval",
] as const;

export default function Home() {
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SteamDesignPro",
    url: "https://steamdesignpro.com/design",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any modern web browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    browserRequirements: "JavaScript and WebGL recommended; an accessible 2D fallback is provided.",
    description:
      "A free browser-based preliminary planning tool for steam-shower enclosure geometry and current KOHLER Invigoration equipment sizing.",
    creator: { "@type": "Organization", name: "SaunaShare, Inc." },
    featureList: [
      "Live 3D room with measured plan and elevation",
      "US and metric dimensions",
      "Current KOHLER Invigoration generator sizing",
      "Controller and steam-head compatibility validation",
      "Versioned share links and four-page PDF planning record",
    ],
  };

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero__steam landing-hero__steam--one" aria-hidden="true" />
        <div className="landing-hero__steam landing-hero__steam--two" aria-hidden="true" />
        <div className="landing-shell landing-hero__grid">
          <div className="landing-hero__copy">
            <p className="landing-kicker"><span /> Free 3D steam-shower planner</p>
            <h1>See your steam shower before the tile goes up.</h1>
            <p className="landing-hero__lede">
              Set the finished dimensions, place the glass, bench, controls, fixtures, and steam heads, then get a source-linked preliminary KOHLER generator package in one live plan.
            </p>
            <div className="landing-actions">
              <Link className="landing-button landing-button--primary" href={designerHref} prefetch={false}>
                Design now <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="landing-button landing-button--quiet" href="#how-it-works" prefetch={false}>
                See what the planner checks
              </Link>
            </div>
            <p className="landing-hero__fineprint">
              Free to use <span>·</span> No account required <span>·</span> US and metric <span>·</span> Preliminary planning only
            </p>
          </div>
          <div className="landing-hero__visual">
            <SteamRoomPreview />
            <div className="landing-hero__seal" aria-hidden="true">
              <ShieldCheck />
              <span>Source-linked<br />planning logic</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-proof" aria-label="Planner capabilities">
        <div className="landing-shell landing-proof__grid">
          <div><Box aria-hidden="true" /><p><strong>3D + 2D</strong><span>Live room, plan, and elevation</span></p></div>
          <div><Gauge aria-hidden="true" /><p><strong>Current models</strong><span>KOHLER K-323xx sizing</span></p></div>
          <div><CircuitBoard aria-hidden="true" /><p><strong>Live checks</strong><span>Equipment, route, and placement</span></p></div>
          <div><FileText aria-hidden="true" /><p><strong>4-page PDF</strong><span>Inputs, specification, sources, limits</span></p></div>
        </div>
      </section>

      <section className="landing-section landing-workflow" id="how-it-works">
        <div className="landing-shell">
          <div className="landing-section__heading">
            <p className="landing-kicker"><span /> How it works</p>
            <h2>From finished room to coordinated system.</h2>
            <p>Every decision stays connected to the same project, so changing the room changes the recommendation—not just the drawing.</p>
          </div>
          <ol className="landing-workflow__grid">
            {workflow.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="landing-section landing-showcase">
        <div className="landing-shell landing-showcase__row">
          <div className="landing-showcase__copy">
            <p className="landing-kicker"><span /> Model the room</p>
            <h2>Design the whole enclosure, not just the generator.</h2>
            <p>
              Orbit the room in 3D, switch to a measured plan or elevation, and test the relationships that are expensive to discover after waterproofing begins.
            </p>
            <ul className="landing-check-list">
              <li><Check aria-hidden="true" /> Door swing, glass, bench, and fixture layout</li>
              <li><Check aria-hidden="true" /> Perspective, front, top, and steam-head views</li>
              <li><Check aria-hidden="true" /> US and metric dimensions</li>
              <li><Check aria-hidden="true" /> Undo, redo, reset, autosave, and share links</li>
            </ul>
            <Link className="landing-text-link" href={designerHref} prefetch={false}>Open the room designer <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="landing-plan-card">
            <div className="landing-plan-card__header">
              <div><span>Drawing 02</span><strong>Measured floor plan</strong></div>
              <p>Scale 1:24</p>
            </div>
            <svg viewBox="0 0 660 470" role="img" aria-label="Measured plan of a five foot by four foot steam shower">
              <defs>
                <pattern id="plan-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M24 0H0v24" fill="none" stroke="#d8e1df" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="660" height="470" fill="url(#plan-grid)" />
              <rect x="122" y="90" width="390" height="270" fill="#fff" stroke="#17383a" strokeWidth="9" />
              <path d="M122 360h102M335 360h177" stroke="#fff" strokeWidth="13" />
              <path d="M224 360a111 111 0 0 1 111-111" fill="none" stroke="#b36d1c" strokeWidth="3" strokeDasharray="8 7" />
              <path d="M224 360h111V249" fill="none" stroke="#17383a" strokeWidth="4" />
              <rect x="145" y="112" width="150" height="62" fill="#d8e5e2" stroke="#557675" strokeWidth="3" />
              <circle cx="476" cy="314" r="12" fill="#b77727" />
              <rect x="456" y="111" width="32" height="42" rx="3" fill="#17383a" />
              <g stroke="#537271" strokeWidth="2" fill="none">
                <path d="M122 52h390M122 66V38M512 66V38" />
                <path d="M82 90v270M68 90h28M68 360h28" />
              </g>
              <text x="317" y="43" textAnchor="middle">5′ 0″ finished</text>
              <text x="57" y="228" textAnchor="middle" transform="rotate(-90 57 228)">4′ 0″ finished</text>
              <text x="162" y="145">BENCH</text>
              <text x="441" y="337">HEAD</text>
              <text x="438" y="105">CONTROL</text>
            </svg>
            <div className="landing-plan-card__footer"><Ruler aria-hidden="true" /> Finished dimensions drive both drawing and sizing</div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-sizing">
        <div className="landing-shell landing-showcase__row landing-showcase__row--reverse">
          <div className="landing-sizing__panel">
            <div className="landing-sizing__panel-top">
              <span>Preliminary equipment match</span>
              <strong>Within documented range</strong>
            </div>
            <div className="landing-sizing__sku">
              <div><span>KOHLER</span><strong>K-32326-NA</strong></div>
              <p>9 kW</p>
            </div>
            <dl>
              <div><dt>Finished room</dt><dd>160.0 ft³</dd></div>
              <div><dt>Published maximum</dt><dd>240 ft³</dd></div>
              <div><dt>Ceiling adjustment</dt><dd>0 sizes</dd></div>
              <div><dt>Electrical discussion</dt><dd>240 V / 60 A</dd></div>
            </dl>
            <p className="landing-sizing__note"><ShieldCheck aria-hidden="true" /> Direct source links travel with the result.</p>
          </div>
          <div className="landing-showcase__copy">
            <p className="landing-kicker landing-kicker--light"><span /> Size with boundaries</p>
            <h2>Sizing that knows where certainty ends.</h2>
            <p>
              SteamDesignPro follows the current KOHLER K-323xx capacity sequence and applies the documented ceiling guidance conservatively. When the room leaves the published range, the planner stops selecting equipment and calls for review.
            </p>
            <ul className="landing-check-list landing-check-list--dark">
              <li><Check aria-hidden="true" /> Finished room volume, not floor area</li>
              <li><Check aria-hidden="true" /> Started-foot ceiling step above 8 ft</li>
              <li><Check aria-hidden="true" /> Hard review boundary above 10 ft or 1,000 ft³</li>
              <li><Check aria-hidden="true" /> No unpublished surface-material multiplier</li>
            </ul>
            <Link className="landing-text-link landing-text-link--light" href="/steam-generator-sizing" prefetch={false}>Read the tested sizing method <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="landing-section landing-specification">
        <div className="landing-shell landing-specification__grid">
          <div className="landing-showcase__copy">
            <p className="landing-kicker"><span /> Keep it connected</p>
            <h2>One live specification, all the way through.</h2>
            <p>
              Change the room or shower system and the preliminary generator, control, steam head, finish, circuits, drain pans, and routed-distance checks stay connected to the same project.
            </p>
            <blockquote>
              <Droplets aria-hidden="true" />
              <p><strong>Tandem means tandem everywhere.</strong> Two generators, two dedicated circuits, two steam heads, and two drain pans remain visible throughout the plan.</p>
            </blockquote>
          </div>
          <div className="landing-spec-card">
            <div className="landing-spec-card__title"><span>Live specification</span><strong>Anthem+ · linear head</strong></div>
            <div className="landing-spec-card__status"><span /> Compatible package</div>
            <dl>
              <div><dt>Generator</dt><dd>K-32332-NA <span>18 kW tandem</span></dd></div>
              <div><dt>Digital adapter</dt><dd>K-32311 <span>1 required</span></dd></div>
              <div><dt>Steam heads</dt><dd>K-32309 <span>2 required</span></dd></div>
              <div><dt>Drain pans</dt><dd>K-5559-NA <span>2 required</span></dd></div>
              <div><dt>Dedicated circuits</dt><dd>2 × 240 V / 60 A</dd></div>
            </dl>
            <Link href="/kohler" prefetch={false}>Browse the current model records <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="landing-section landing-pdf">
        <div className="landing-shell landing-showcase__row">
          <div className="landing-pdf__stack" aria-hidden="true">
            <article className="landing-paper landing-paper--back"><span>04</span><strong>Checklist + sources</strong></article>
            <article className="landing-paper landing-paper--middle"><span>03</span><strong>Inputs + assumptions</strong></article>
            <article className="landing-paper landing-paper--front">
              <div><span>STEAMDESIGNPRO</span><small>01 / 04</small></div>
              <p>Preliminary planning record</p>
              <strong>K-32326-NA</strong>
              <svg viewBox="0 0 240 150">
                <path d="m26 104 92-52 92 51-92 52Z" fill="#e1eae8" stroke="#5e7b79" strokeWidth="2" />
                <path d="M26 104V40l92-30v42M118 52V10l92 38v55" fill="#f7faf9" stroke="#5e7b79" strokeWidth="2" />
                <rect x="45" y="77" width="64" height="24" fill="#bfd0ce" />
                <circle cx="75" cy="60" r="5" fill="#b77727" />
              </svg>
              <small>Room summary · system · early coordination flags</small>
            </article>
          </div>
          <div className="landing-showcase__copy">
            <p className="landing-kicker"><span /> Share the thinking</p>
            <h2>A better first meeting starts with the same plan.</h2>
            <p>
              The export captures the planning summary, 3D snapshot, measured plan and elevation, specification, every project input, assumptions, exclusions, coordination checklist, and direct official sources.
            </p>
            <ul className="landing-check-list">
              <li><Check aria-hidden="true" /> Deterministic four-page PDF</li>
              <li><Check aria-hidden="true" /> Source revisions and direct links</li>
              <li><Check aria-hidden="true" /> Electrical, plumbing, and waterproofing discussion list</li>
              <li><Check aria-hidden="true" /> Clear preliminary-planning limits</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="landing-section landing-boundary">
        <div className="landing-shell">
          <div className="landing-section__heading landing-section__heading--center">
            <p className="landing-kicker"><span /> The right boundary</p>
            <h2>Useful enough to move the project forward. Honest enough to know what comes next.</h2>
          </div>
          <div className="landing-boundary__grid">
            <article>
              <p>THE PLANNER HELPS RESOLVE</p>
              <ul>{plannerResolves.map((item) => <li key={item}><Check aria-hidden="true" /> {item}</li>)}</ul>
            </article>
            <article>
              <p>QUALIFIED PROFESSIONALS FINALIZE</p>
              <ul>{professionalsFinalize.map((item) => <li key={item}><ArrowRight aria-hidden="true" /> {item}</li>)}</ul>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-section landing-faq">
        <div className="landing-shell landing-faq__grid">
          <div className="landing-section__heading">
            <p className="landing-kicker"><span /> Frequently asked</p>
            <h2>Before you start designing.</h2>
            <p>SteamDesignPro is deliberately focused: one clear planning workflow, current sourced equipment data, and no account wall.</p>
          </div>
          <div className="landing-faq__items">
            <details>
              <summary>Is SteamDesignPro free?</summary>
              <p>Yes. Start without an account, save locally in your browser, create a share link, and export the preliminary planning PDF.</p>
            </details>
            <details>
              <summary>Does it replace a contractor or licensed professional?</summary>
              <p>No. It is an early planning and coordination aid—not architectural, engineering, permit, waterproofing, electrical, plumbing, or installation documentation.</p>
            </details>
            <details>
              <summary>What can I design?</summary>
              <p>A rectangular steam-shower enclosure with configurable dimensions, door, glass, bench, surface, ceiling slope, fixture, control, steam-head placement, generator location, route distance, and finish.</p>
            </details>
            <details>
              <summary>Which equipment does it size today?</summary>
              <p>The current release documents KOHLER Invigoration K-323xx generators and compatible control and steam-head paths from cited primary sources.</p>
            </details>
            <details>
              <summary>What does the PDF include?</summary>
              <p>Four pages covering the summary, drawings, specification, project inputs, assumptions, exclusions, coordination checklist, sources, and planning limits.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="landing-closing">
        <div className="landing-closing__steam" aria-hidden="true" />
        <div className="landing-shell landing-closing__inner">
          <p className="landing-kicker landing-kicker--light"><span /> Your room, first</p>
          <h2>Start with the room you actually have.</h2>
          <p>Build the enclosure, see the system respond, and leave with a plan everyone can discuss.</p>
          <Link className="landing-button landing-button--aqua" href={designerHref} prefetch={false}>
            Design now <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }} />
    </main>
  );
}
