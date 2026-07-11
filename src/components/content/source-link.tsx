import type { ReactNode } from "react";

type SourceLinkProps = {
  href: string;
  children: ReactNode;
};

export function SourceLink({ href, children }: SourceLinkProps) {
  return (
    <a className="source-link" href={href} rel="external">
      <span>{children}</span>
      <span className="source-link__marker" aria-hidden="true">
        ↗
      </span>
      <span className="visually-hidden"> (official Kohler source)</span>
    </a>
  );
}
