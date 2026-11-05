import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { SITE, SOCIAL } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions about Mint & Paw? Email us.",
};

export default function ContactPage() {
  return (
    <>
      <section className="band" style={{ "--bg": "var(--bubble)" } as CSSProperties}>
        <h1 className="fat">Say hi.</h1>
        <p className="lede">Questions, ideas or just a good dog photo: we read everything.</p>
        <div className="acts">
          <a className="btn" href={`mailto:${SITE.email}`}>Email {SITE.email}</a>
        </div>
      </section>
      <section className="blk">
        <div className="prose rv">
          <h2 className="fat">Follow along</h2>
          <ul>
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
