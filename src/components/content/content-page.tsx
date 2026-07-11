import Link from "next/link";
import type { ReactNode } from "react";

import { PlannerCta } from "./planner-cta";
import { PlanningNotice } from "./planning-notice";

export type Breadcrumb = {
  label: string;
  href?: `/${string}`;
};

type ContentPageProps = {
  path: `/${string}`;
  eyebrow: string;
  title: string;
  summary: string;
  breadcrumbs: Breadcrumb[];
  children: ReactNode;
  showPlannerCta?: boolean;
  plannerCtaTitle?: string;
  plannerCtaDescription?: string;
};

const SITE_URL = "https://steamdesignpro.com";

function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href="/">Planner</Link>
        </li>
        {items.map((item) => (
          <li key={item.label} aria-current={item.href ? undefined : "page"}>
            <span className="breadcrumbs__separator" aria-hidden="true">
              /
            </span>
            {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function BreadcrumbStructuredData({
  items,
  path,
}: {
  items: Breadcrumb[];
  path: `/${string}`;
}) {
  const allItems = [{ label: "Planner", href: "/" as const }, ...items];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.href ?? path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function ContentPage({
  path,
  eyebrow,
  title,
  summary,
  breadcrumbs,
  children,
  showPlannerCta = true,
  plannerCtaTitle,
  plannerCtaDescription,
}: ContentPageProps) {
  return (
    <main className="content-page" id="main-content">
      <BreadcrumbStructuredData items={breadcrumbs} path={path} />
      <div className="content-page__inner">
        <Breadcrumbs items={breadcrumbs} />
        <article className="content-article">
          <header className="content-article__header">
            <p className="content-article__eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="content-article__summary">{summary}</p>
          </header>
          <div className="content-article__body">{children}</div>
          {showPlannerCta ? (
            <PlannerCta
              {...(plannerCtaTitle === undefined
                ? {}
                : { title: plannerCtaTitle })}
              {...(plannerCtaDescription === undefined
                ? {}
                : { description: plannerCtaDescription })}
            />
          ) : null}
          <PlanningNotice />
        </article>
      </div>
    </main>
  );
}
