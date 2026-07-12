import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" prefetch={false} className="brand">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span>SteamDesignPro</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/#how-it-works" prefetch={false}>How it works</Link>
        <Link href="/steam-generator-sizing" prefetch={false}>Sizing</Link>
        <Link href="/kohler" prefetch={false}>KOHLER models</Link>
        <Link href="/guide" prefetch={false}>Guide</Link>
        <Link href="/sources" prefetch={false}>Sources</Link>
      </nav>
      <Link href="/design" prefetch={false} className="header-planner-link">
        Design now
      </Link>
    </header>
  );
}
