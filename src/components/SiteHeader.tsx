"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Mark from "./Mark";
import { MOODS } from "@/content/moods";

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="hdr">
      <Link className="logo fat" href="/" aria-label="Mint & Paw home">
        <Mark fill="var(--lic)" />
        mint&amp;paw
      </Link>
      <nav className="nav" aria-label="Shop by mood">
        {MOODS.map((m) => {
          const href = `/shop/${m.slug}/`;
          return (
            <Link key={m.slug} href={href} aria-current={pathname === href ? "page" : undefined}>
              {m.name}
            </Link>
          );
        })}
      </nav>
      <div className="hdr-r">
        <Link className="btn btn--white shop-m" href="/shop/">
          Shop
        </Link>
        <Link className="btn btn--tennis join-cta" href="/#join">
          Join the pack
        </Link>
      </div>
    </header>
  );
}
