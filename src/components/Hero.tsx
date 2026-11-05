"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { IMG } from "@/content/images";
import { SITE } from "@/content/site";

type Letter = { ch: string; shadow: string; amp?: boolean; breakBefore?: boolean };
const LETTERS: Letter[] = [
  { ch: "m", shadow: "var(--bubble)" },
  { ch: "i", shadow: "var(--tennis)" },
  { ch: "n", shadow: "var(--grape)" },
  { ch: "t", shadow: "var(--white)" },
  { ch: "&", shadow: "var(--lic)", amp: true },
  { ch: "p", shadow: "var(--tennis)", breakBefore: true },
  { ch: "a", shadow: "var(--grape)" },
  { ch: "w", shadow: "var(--bubble)" },
];

const css = (v: Record<string, string | number>) => v as CSSProperties;

// Replays the squeaky-toy squash every time the pointer touches a letter.
function squish(e: PointerEvent<HTMLSpanElement>) {
  const el = e.currentTarget;
  el.classList.remove("sq");
  void el.offsetWidth;
  el.classList.add("sq");
}

function Sticker({ className, src, alt, onFirstMove }: { className: string; src: string; alt: string; onFirstMove: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const down = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX - pos.current.x, y: e.clientY - pos.current.y };
    e.currentTarget.classList.add("drag");
    onFirstMove();
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !ref.current) return;
    pos.current = { x: e.clientX - drag.current.x, y: e.clientY - drag.current.y };
    ref.current.style.setProperty("--dx", `${pos.current.x}px`);
    ref.current.style.setProperty("--dy", `${pos.current.y}px`);
  };
  const up = () => {
    drag.current = null;
    ref.current?.classList.remove("drag");
  };

  return (
    <div ref={ref} className={`stk ${className}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <img src={src} alt={alt} draggable={false} />
    </div>
  );
}

const STAR = "M50 8Q56 44 92 50Q56 56 50 92Q44 56 8 50Q44 44 50 8Z";
const SEAM = "M22 30Q40 50 22 70M78 30Q60 50 78 70";
const OUTLINE = { stroke: "var(--lic)", strokeWidth: 10, strokeLinejoin: "round" as const };

function Toys() {
  return (
    <div className="toys" aria-hidden="true">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <g id="toy-bone">
            <rect x="24" y="41" width="52" height="18" rx="8" />
            <circle cx="24" cy="39" r="11" />
            <circle cx="24" cy="61" r="11" />
            <circle cx="76" cy="39" r="11" />
            <circle cx="76" cy="61" r="11" />
          </g>
          <g id="toy-fish">
            <ellipse cx="44" cy="50" rx="30" ry="18" />
            <path d="M68 50 92 33V67Z" />
          </g>
        </defs>
      </svg>
      {/* a stroked copy underneath plus a filled copy on top gives one clean outline */}
      <div className="ty" style={css({ "--s": "110px", left: "21%", top: "9%", "--d": 0.8, "--r": "-24deg" })}>
        <svg viewBox="0 0 100 100"><use href="#toy-bone" fill="var(--lic)" {...OUTLINE} /><use href="#toy-bone" fill="var(--tennis)" /></svg>
      </div>
      <div className="ty hide-m" style={css({ "--s": "120px", left: "2%", top: "44%", "--d": 1.2, "--r": "12deg" })}>
        <svg viewBox="0 0 100 100"><use href="#toy-fish" fill="var(--lic)" {...OUTLINE} /><use href="#toy-fish" fill="var(--bubble)" /><circle cx="30" cy="46" r="4.5" fill="var(--lic)" /></svg>
      </div>
      <div className="ty hide-m" style={css({ "--s": "84px", right: "3%", top: "47%", "--d": 1, "--r": "-10deg" })}>
        <svg viewBox="0 0 100 100" stroke="var(--lic)" strokeWidth="5" fill="var(--grape)">
          <ellipse cx="50" cy="64" rx="21" ry="17" /><circle cx="27" cy="39" r="9" /><circle cx="42" cy="27" r="9" /><circle cx="58" cy="27" r="9" /><circle cx="73" cy="39" r="9" />
        </svg>
      </div>
      <div className="ty" style={css({ "--s": "96px", left: "31%", bottom: "13%", "--d": 1.4 })}>
        <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="var(--tennis)" stroke="var(--lic)" strokeWidth="5" /><path d={SEAM} fill="none" stroke="var(--white)" strokeWidth="5" strokeLinecap="round" /></svg>
      </div>
      <div className="ty" style={css({ "--s": "70px", right: "29%", bottom: "20%", "--d": 0.6, "--r": "8deg" })}>
        <svg viewBox="0 0 100 100"><path d={STAR} fill="var(--white)" stroke="var(--lic)" strokeWidth="5" strokeLinejoin="round" /></svg>
      </div>
      <div className="ty" style={css({ "--s": "58px", right: "23%", top: "9%", "--d": 1.6 })}>
        <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="var(--bubble)" stroke="var(--lic)" strokeWidth="6" /><path d={SEAM} fill="none" stroke="var(--white)" strokeWidth="6" strokeLinecap="round" /></svg>
      </div>
    </div>
  );
}

export default function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const [moved, setMoved] = useState(false);

  // toys drift with the pointer, by depth
  const parallax = (e: PointerEvent<HTMLDivElement>) => {
    if (!stage.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = stage.current.getBoundingClientRect();
    stage.current.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    stage.current.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };

  return (
    <div className="hero">
      <div className="stage" ref={stage} onPointerMove={parallax}>
        <Toys />
        <h1 className="wm fat" aria-label="Mint & Paw">
          {LETTERS.map((l, i) => (
            <span key={l.ch} style={{ display: "contents" }}>
              {l.breakBefore && <br className="mbr" />}
              <span
                aria-hidden="true"
                className={l.amp ? "amp" : undefined}
                style={css({ animationDelay: `${0.05 + i * 0.07}s`, "--sh": l.shadow })}
                onPointerEnter={squish}
                onAnimationEnd={(e) => e.animationName === "squish" && e.currentTarget.classList.remove("sq")}
              >
                {l.ch}
              </span>
            </span>
          ))}
        </h1>
        <p className="lead">{SITE.tagline} Opening soon.</p>
        <div className="acts">
          <a className="btn" href="#arcade">Play the claw</a>
          <a className="btn btn--line" href="#join">Join the pack</a>
        </div>

        <Sticker className="dog" src={IMG.dachshund} alt="Dachshund sticker" onFirstMove={() => setMoved(true)} />
        <Sticker className="cat" src={IMG.gingerCat} alt="Ginger cat sticker" onFirstMove={() => setMoved(true)} />
        <Sticker className="gold" src={IMG.golden} alt="Golden retriever sticker" onFirstMove={() => setMoved(true)} />
        <span className={`psst${moved ? " gone" : ""}`} aria-hidden="true">psst, drag us around</span>
      </div>

      <div className="marq" aria-hidden="true">
        <div className="track">
          {[0, 1, 2, 3].map((k) => (
            <span key={k}>squeak ✺ fetch ✺ nap ✺ snack ✺ sniff ✺ repeat ✺</span>
          ))}
        </div>
      </div>
    </div>
  );
}
