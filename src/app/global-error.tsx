"use client";

import Link from "next/link";
import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="status-page status-page--global">
          <div className="status-page__inner">
            <p className="status-page__code" aria-hidden="true">
              SteamDesignPro
            </p>
            <h1>The planning workspace could not start</h1>
            <p>
              Try loading the application again. If the problem persists, return
              to the planner in a new navigation and verify any restored local
              inputs before relying on the result.
            </p>
            <div className="status-page__actions">
              <button
                className="button-link button-link--primary"
                type="button"
                onClick={reset}
              >
                Try again
              </button>
              <Link className="button-link button-link--secondary" href="/">
                Reload planner
              </Link>
            </div>
            {error.digest ? (
              <p className="status-page__reference">
                Support reference: <code>{error.digest}</code>
              </p>
            ) : null}
          </div>
        </main>
      </body>
    </html>
  );
}
