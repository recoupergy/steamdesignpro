import Link from "next/link";

type PlannerCtaProps = {
  title?: string;
  description?: string;
};

export function PlannerCta({
  title = "Put the guidance into a room plan",
  description = "Open a compact starter room, enter finished dimensions, and review the preliminary generator and accessory conversation before meeting with your project team.",
}: PlannerCtaProps) {
  return (
    <aside className="planner-cta" aria-labelledby="planner-cta-title">
      <div className="planner-cta__copy">
        <h2 id="planner-cta-title">{title}</h2>
        <p>{description}</p>
      </div>
      <Link className="button-link button-link--primary" href="/?v=1&starter=compact">
        Open compact starter plan
      </Link>
    </aside>
  );
}
