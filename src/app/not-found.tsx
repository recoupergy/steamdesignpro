import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Page Not Found | SteamDesignPro",
  },
  description:
    "The requested SteamDesignPro planning or product page could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="status-page">
      <div className="status-page__inner">
        <p className="status-page__code" aria-hidden="true">
          404
        </p>
        <h1>That planning page is not here</h1>
        <p>
          The address may be incomplete, an old shared link may use a version the
          planner no longer recognizes, or the requested product page may not be
          in the current Kohler Invigoration source set.
        </p>
        <div className="status-page__actions">
          <Link className="button-link button-link--primary" href="/">
            Open the planner
          </Link>
          <Link className="button-link button-link--secondary" href="/kohler">
            Browse current models
          </Link>
        </div>
        <nav className="status-page__links" aria-label="Useful pages">
          <Link href="/guide">Planning guide</Link>
          <Link href="/steam-generator-sizing">Sizing reference</Link>
          <Link href="/steam-shower-checklist">Project checklist</Link>
          <Link href="/sources">Official sources</Link>
        </nav>
      </div>
    </main>
  );
}
