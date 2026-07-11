"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="status-page">
      <div className="status-page__inner">
        <p className="status-page__code" aria-hidden="true">
          Plan interrupted
        </p>
        <h1>This view could not be completed</h1>
        <p>
          Your browser may still hold a local autosave. Try this view again first.
          If the problem continues, return to the planner and review the restored
          inputs before sharing or exporting a result.
        </p>
        <div className="status-page__actions">
          <button
            className="button-link button-link--primary"
            type="button"
            onClick={reset}
          >
            Try this view again
          </button>
          <Link className="button-link button-link--secondary" href="/">
            Return to planner
          </Link>
        </div>
        {error.digest ? (
          <p className="status-page__reference">
            Support reference: <code>{error.digest}</code>
          </p>
        ) : null}
      </div>
    </main>
  );
}
