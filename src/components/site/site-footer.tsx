import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" prefetch={false} className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>SteamDesignPro</span>
        </Link>
        <p>An independent steam-shower planning aid owned and operated by SaunaShare, Inc.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/design" prefetch={false}>Designer</Link>
        <Link href="/steam-shower-checklist" prefetch={false}>Project checklist</Link>
        <Link href="/sources" prefetch={false}>Sources</Link>
        <Link href="/about" prefetch={false}>About</Link>
        <Link href="/privacy" prefetch={false}>Privacy</Link>
        <Link href="/terms" prefetch={false}>Terms</Link>
      </nav>
      <p className="footer-legal">
        Not affiliated with, endorsed, certified, or authorized by Kohler Co. KOHLER, Invigoration, Anthem+, and DTV+ are trademarks of Kohler Co.
      </p>
    </footer>
  );
}
