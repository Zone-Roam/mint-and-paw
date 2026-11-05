import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { MOODS } from "@/content/moods";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop by mood: Zoomies, Snooze, Snacks and Sniffs. Opening soon.",
};

export default function ShopPage() {
  return (
    <>
      <section className="band">
        <h1 className="fat">The shop opens soon.</h1>
        <p className="lede">We sort everything by what your pet is up to. Pick a mood to see what&apos;s coming at launch.</p>
      </section>
      <section className="blk" aria-label="Moods">
        <div className="moods">
          {MOODS.map((m) => (
            <Link key={m.slug} className="mood rv" href={`/shop/${m.slug}/`} style={{ "--c": m.color, "--k": m.ink } as CSSProperties}>
              <h2 className="fat">{m.name}</h2>
              <p>{m.blurb}</p>
              <div className="pic"><img src={m.capsuleImage} alt="" /></div>
              <span className="go-to">See {m.name.toLowerCase()} →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
