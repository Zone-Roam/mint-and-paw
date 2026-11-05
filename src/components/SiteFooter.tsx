import Link from "next/link";
import { MOODS } from "@/content/moods";
import { COMPANY_LINKS, HELP_LINKS, SITE, SOCIAL } from "@/content/site";

export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="fbig fat" aria-hidden="true">
        mint&amp;paw
      </div>
      <div className="frow">
        <nav className="fcols" aria-label="Footer">
          <div>
            <h2>Shop</h2>
            {MOODS.map((m) => (
              <Link key={m.slug} href={`/shop/${m.slug}/`}>
                {m.name}
              </Link>
            ))}
          </div>
          <div>
            <h2>Help</h2>
            {HELP_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h2>Mint &amp; Paw</h2>
            {COMPANY_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h2>Follow</h2>
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </nav>
        <p className="fnote">
          {SITE.operatorStatement}<br />
          © {new Date().getFullYear()} {SITE.name} · mintandpaw.com
        </p>
      </div>
    </footer>
  );
}
