import Link from "next/link";
import type { CSSProperties } from "react";

export default function NotFound() {
  return (
    <section className="band" style={{ "--bg": "var(--grape)", "--ink": "var(--white)", minHeight: "70vh" } as CSSProperties}>
      <span className="pill" style={{ background: "var(--white)", color: "var(--lic)" }}>404</span>
      <h1 className="fat" style={{ marginTop: 18 }}>This page ran off after a squirrel.</h1>
      <p className="lede">The link might be old, or the page moved. The claw machine is still where you left it.</p>
      <div className="acts">
        <Link className="btn btn--white" href="/">Back to the homepage</Link>
        <Link className="btn btn--line" href="/shop/">Browse the shop</Link>
      </div>
    </section>
  );
}
