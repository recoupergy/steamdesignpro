import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="S SteamDesignPro home">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span>SteamDesignPro</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/guide">Guide</Link>
        <Link href="/kohler">KOHLER models</Link>
        <Link href="/steam-generator-sizing">Sizing</Link>
        <Link href="/sources">Sources</Link>
        <Link href="/about">About</Link>
      </nav>
      <Link href="/?v=1&starter=compact" className="header-planner-link">
        Open planner
      </Link>
    </header>
  );
}
