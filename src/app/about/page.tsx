import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { MOODS } from "@/content/moods";

import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Our story",
  description: "Mint & Paw is a new shop for dogs and cats, opening soon.",
};

export default function AboutPage() {
  return (
    <>
      <section className="band" style={{ "--bg": "var(--tennis)" } as CSSProperties}>
        <h1 className="fat">Our story.</h1>
        <p className="lede">Mint &amp; Paw is a new shop for dogs and cats. We&apos;re opening soon.</p>
      </section>
      <section className="blk">
        <div className="prose rv">
          <h2 className="fat">What we&apos;re making</h2>
          <p>{SITE.operatorStatement}</p>
          <p>Toys, beds, bowls and walk gear, sorted by the four things pets do all day:</p>
          <div className="others" style={{ marginTop: 18 }}>
            {MOODS.map((m) => (
              <Link key={m.slug} href={`/shop/${m.slug}/`} style={{ "--c": m.color, "--k": m.ink } as CSSProperties}>
                {m.name}
              </Link>
            ))}
          </div>
        </div>
        {/* Replace with the founding story: who you are, why pets, what you won't compromise on. */}
        <div className="card-soon rv">The full story of how Mint &amp; Paw started lands here before launch.</div>
      </section>
    </>
  );
}
