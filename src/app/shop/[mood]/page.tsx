import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { MOODS, moodBySlug } from "@/content/moods";

// Static export: only the four moods exist; anything else is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return MOODS.map((m) => ({ mood: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[mood]">): Promise<Metadata> {
  const mood = moodBySlug((await params).mood);
  return mood ? { title: mood.name, description: mood.blurb } : {};
}

export default async function MoodPage({ params }: PageProps<"/shop/[mood]">) {
  const mood = moodBySlug((await params).mood);
  if (!mood) notFound();
  const others = MOODS.filter((m) => m.slug !== mood.slug);

  return (
    <>
      <section className="band" style={{ "--bg": mood.color, "--ink": mood.ink } as CSSProperties}>
        <span className="pill">Shop by mood</span>
        <h1 className="fat" style={{ marginTop: 18 }}>{mood.name}</h1>
        <p className="lede">{mood.blurb}</p>
        <ul className="ticks">
          {mood.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <div className="acts">
          <Link className="btn" href="/#arcade">Back to the claw</Link>
        </div>
      </section>

      <section className="blk" aria-labelledby="whatH">
        <h2 className="h2 fat rv" id="whatH" style={{ marginBottom: 40 }}>Coming at launch</h2>
        <div className="products">
          {mood.products.map((p) =>
            p.image ? (
              <article className="good rv" key={p.name}>
                <div className="im"><img src={p.image} alt={p.name} /></div>
                <b>{p.name}</b>
                <span>{p.materials}</span>
                <span style={{ marginTop: 6 }}>{p.availability}</span>
              </article>
            ) : (
              <article className="good soon rv" key={p.name}>
                <div className="im" aria-hidden="true">+</div>
                <b>{p.name}</b>
                <span>{p.materials}</span>
                <span style={{ marginTop: 6 }}>{p.availability}</span>
              </article>
            ),
          )}
        </div>
        <div className="acts rv" style={{ justifyContent: "flex-start", marginTop: 36 }}>
          <Link className="btn" href="/#join">Tell me when it opens</Link>
        </div>

        <h2 className="fat rv" style={{ fontSize: 32, marginTop: 90 }}>Other moods</h2>
        <div className="others rv">
          {others.map((o) => (
            <Link key={o.slug} href={`/shop/${o.slug}/`} style={{ "--c": o.color, "--k": o.ink } as CSSProperties}>
              {o.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
