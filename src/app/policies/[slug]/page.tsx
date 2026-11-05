import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { POLICIES, policyBySlug } from "@/content/policies";
import { SITE } from "@/content/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const policy = policyBySlug((await params).slug);
  return policy ? { title: policy.title, description: policy.intro } : {};
}

export default async function PolicyPage({ params }: PageProps<"/policies/[slug]">) {
  const policy = policyBySlug((await params).slug);
  if (!policy) notFound();

  return (
    <>
      <section className="band" style={{ "--bg": "var(--white)" } as CSSProperties}>
        <h1 className="fat">{policy.title}</h1>
        <p className="lede">{policy.intro}</p>
      </section>
      <section className="blk" style={{ paddingTop: 30 }}>
        <div className="prose">
          {policy.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="fat">{s.heading}</h2>
              <ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
          <h2 className="fat">Questions</h2>
          <p>
            Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we&apos;ll get back to you.
          </p>
        </div>
      </section>
    </>
  );
}
