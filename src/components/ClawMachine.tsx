"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Mood } from "@/content/moods";

type Mode = "slot" | "free" | "held";
type UI = { holding: boolean; busy: boolean; target: number; modes: Mode[] };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = {
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t: number) => 1 - Math.pow(1 - t, 3),
  back: (t: number) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2),
  bounce: (t: number) => {
    const n = 7.5625, d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
  },
};

export default function ClawMachine({ moods }: { moods: Mood[] }) {
  const [fi, setFi] = useState(0);
  const [ui, setUi] = useState<UI>({ holding: true, busy: true, target: 0, modes: moods.map((_, i) => (i === 0 ? "held" : "slot")) });
  const sectionRef = useRef<HTMLElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const clawRef = useRef<HTMLDivElement>(null);
  const armRef = useRef<HTMLDivElement>(null);
  const cableRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGSVGElement>(null);
  const flRef = useRef<SVGGElement>(null);
  const frRef = useRef<SVGGElement>(null);
  const capRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lblRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // imperative controls, filled in by the engine effect
  const api = useRef<{ pick: (i: number) => void; step: (d: number) => void; go: () => void }>({ pick: () => {}, step: () => {}, go: () => {} });

  useEffect(() => {
    const machine = machineRef.current!, section = sectionRef.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = moods.length;

    /* tiny tween engine (same idea as Mrrp's) */
    type Tween = { o: Record<string, number>; from: Record<string, number>; to: Record<string, number>; dur: number; t0: number; fn: (t: number) => number; res: () => void };
    const tweens = new Set<Tween>();
    // animates the numeric fields named in `to`; other fields on `o` are left alone
    const tween = (o: object, to: Record<string, number>, dur: number, fn = ease.inOut) =>
      new Promise<void>((res) => {
        const obj = o as Record<string, number>, from: Record<string, number> = {};
        for (const k in to) from[k] = obj[k];
        tweens.add({ o: obj, from, to, dur: (reduce ? 0.01 : dur) * 1000, t0: performance.now(), fn, res });
      });
    const stepTweens = (now: number) => {
      tweens.forEach((tw) => {
        const k = clamp((now - tw.t0) / tw.dur, 0, 1), e = tw.fn(k);
        for (const key in tw.to) tw.o[key] = lerp(tw.from[key], tw.to[key], e);
        if (k >= 1) { tweens.delete(tw); tw.res(); }
      });
    };
    const wait = (ms: number) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

    const S = { fi: 0, holding: true, target: 0, busy: true, c: { x: 0, L: 0, open: 0 }, sw: { a: 0, v: 0 } };
    const P = moods.map((_, i) => ({ x: 0, y: 0, r: 0, mode: (i === 0 ? "held" : "slot") as Mode }));
    const L = { W: 0, H: 0, D: 0, rail: 22, L0: 0, slots: [] as { x: number; y: number }[] };
    let booted = false;

    const sync = () => setUi({ holding: S.holding, busy: S.busy, target: S.target, modes: P.map((p) => p.mode) });
    const setMood = (i: number) => { S.fi = i; setFi(i); };

    function layout() {
      L.W = machine.clientWidth; L.H = machine.clientHeight;
      L.D = Math.round(Math.min(L.W * 0.19, 180));
      machine.style.setProperty("--D", `${L.D}px`);
      L.L0 = Math.round(L.H * 0.05);
      L.slots = moods.map((_, i) => ({ x: L.W * (0.14 + 0.24 * i), y: L.H - L.D / 2 - 40 }));
      headRef.current!.style.width = `${L.D * 1.1}px`;
      headRef.current!.style.height = `${L.D * 1.05}px`;
      lblRefs.current.forEach((l, i) => l && (l.style.left = `${L.slots[i].x}px`));
      P.forEach((p, i) => { if (p.mode === "slot") { p.x = L.slots[i].x; p.y = L.slots[i].y; p.r = 0; } });
      if (!S.busy) S.c.x = S.holding ? L.W / 2 : L.slots[S.target].x;
      if (!S.busy && booted) S.c.L = L.L0;
      if (!booted) S.c.x = L.W / 2;
    }
    // the capsule hangs 0.92D below the end of the cable
    const grip = () => { const d = S.c.L + L.D * 0.92, a = S.sw.a; return { x: S.c.x - Math.sin(a) * d, y: L.rail + Math.cos(a) * d, r: a }; };

    async function drop() {
      if (S.busy || !S.holding) return;
      S.busy = true; sync();
      const i = S.fi, p = P[i], g = grip();
      Object.assign(p, g, { mode: "free" });
      tween(S.c, { open: 1 }, 0.25);
      await wait(100);
      const s = L.slots[i];
      tween(p, { x: s.x, r: 0 }, 0.7, ease.out);
      await tween(p, { y: s.y }, 0.8, ease.bounce);
      p.mode = "slot"; S.holding = false; S.target = i; S.sw.v += 1.4;
      await tween(S.c, { open: 0.55 }, 0.3);
      S.busy = false; sync();
    }
    async function moveTo(i: number) {
      S.target = clamp(i, 0, n - 1); sync();
      const x = L.slots[S.target].x;
      await tween(S.c, { x }, 0.25 + Math.min(0.5, Math.abs(x - S.c.x) / 700));
    }
    async function grab(i = S.target) {
      if (S.busy || S.holding) return;
      S.busy = true; S.target = i; sync();
      await moveTo(i);
      await tween(S.c, { open: 1 }, 0.2);
      await tween(S.c, { L: L.slots[i].y - L.rail - L.D * 0.92 }, 0.7);
      await tween(S.c, { open: 0 }, 0.25);
      P[i].mode = "held"; setMood(i); sync();
      await tween(S.c, { L: L.L0 }, 0.8);
      await tween(S.c, { x: L.W / 2 }, 0.7);
      S.holding = true; S.busy = false; sync();
    }
    async function swapTo(i: number) {
      if (S.busy || !S.holding || i === S.fi) return;
      S.busy = true; sync();
      const o = S.fi, po = P[o];
      Object.assign(po, grip(), { mode: "free" });
      const so = L.slots[o];
      tween(po, { x: so.x, y: so.y, r: 0 }, 0.55).then(() => { po.mode = "slot"; sync(); });
      P[i].mode = "free"; setMood(i);
      tween(S.c, { open: 0.9 }, 0.2);
      await wait(140);
      const g = grip();
      await tween(P[i], { x: g.x, y: g.y, r: g.r }, 0.62, ease.back);
      P[i].mode = "held"; S.sw.v += i > o ? -2.4 : 2.4;
      await tween(S.c, { open: 0 }, 0.18);
      S.busy = false; sync();
    }
    const pick = (i: number) => { if (S.busy) return; if (S.holding) swapTo(i); else grab(i); };
    const step = (d: number) => { if (S.busy) return; if (S.holding) swapTo((S.fi + d + n) % n); else moveTo(S.target + d); };
    api.current = { pick, step, go: () => (S.holding ? drop() : grab()) };

    /* render loop: pendulum swing driven by the claw's sideways acceleration */
    let raf = 0, clock = 0, last = performance.now(), lastX: number | null = null, lastVX = 0;
    const frame = (now: number) => {
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now; clock += dt;
      stepTweens(now);
      if (lastX === null) lastX = S.c.x;
      const vx = (S.c.x - lastX) / Math.max(dt, 1e-3), ax = (vx - lastVX) / Math.max(dt, 1e-3);
      lastX = S.c.x; lastVX = vx;
      if (!reduce) {
        S.sw.v += (-26 * S.sw.a - 2.6 * S.sw.v + clamp(ax / 100, -60, 60) * 0.03) * dt;
        S.sw.a = clamp(S.sw.a + S.sw.v * dt, -0.5, 0.5);
      }
      const Lc = S.c.L + (S.busy || reduce ? 0 : Math.sin(clock * 1.3) * 3);
      clawRef.current!.style.transform = `translate(${S.c.x}px,${L.rail}px)`;
      armRef.current!.style.transform = `rotate(${S.sw.a}rad)`;
      cableRef.current!.style.height = `${Math.max(0, Lc)}px`;
      headRef.current!.style.top = `${Lc - L.D * 0.06}px`;
      flRef.current!.setAttribute("transform", `rotate(${S.c.open * 30} 33 34)`);
      frRef.current!.setAttribute("transform", `rotate(${-S.c.open * 30} 67 34)`);
      P.forEach((p, i) => {
        let { x, y, r } = p;
        if (p.mode === "held") { const d = Lc + L.D * 0.92; x = S.c.x - Math.sin(S.sw.a) * d; y = L.rail + Math.cos(S.sw.a) * d; r = S.sw.a; }
        const el = capRefs.current[i];
        if (el) el.style.transform = `translate(${x - L.D / 2}px,${y - L.D / 2}px) rotate(${r}rad)`;
      });
      raf = requestAnimationFrame(frame);
    };

    // boot: the claw waits above the glass and lowers the first capsule once you scroll here
    layout();
    S.c.L = -L.D * 2.2;
    raf = requestAnimationFrame(frame);
    const enter = () => {
      if (booted) return;
      booted = true;
      tween(S.c, { L: L.L0 }, 1.2, ease.back).then(() => { S.sw.v += 1.6; S.busy = false; sync(); });
    };
    let inView = false;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { inView = e.isIntersecting; if (e.intersectionRatio > 0.25) enter(); }),
      { threshold: [0, 0.25, 0.5] },
    );
    io.observe(section);
    const onKey = (e: KeyboardEvent) => {
      if (!inView || (e.target as HTMLElement).closest("input,textarea")) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    };
    addEventListener("keydown", onKey);
    let rt = 0;
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(layout, 80); };
    addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("keydown", onKey);
      removeEventListener("resize", onResize);
      clearTimeout(rt);
    };
  }, [moods]);

  const m = moods[fi];
  const sectionStyle = { "--bg": m.color, "--ink": m.ink } as CSSProperties;

  return (
    <section className="arcade" id="arcade" aria-labelledby="arcH" ref={sectionRef} style={sectionStyle}>
      <div className="arc-grid">
        <div className="cabinet">
          <div className="machine" ref={machineRef} role="group" aria-label="Claw machine with four mood capsules">
            <div className="rail" />
            <div className="floor" />
            <div className="claw" ref={clawRef} aria-hidden="true">
              <div className="arm" ref={armRef}>
                <div className="cable" ref={cableRef} />
                <svg className="head" ref={headRef} viewBox="0 0 100 95">
                  <g ref={flRef}><path className="finger" d="M33 34 C 13 48, 8 72, 20 90" /><circle className="tip" cx="20" cy="90" r="6" /></g>
                  <g ref={frRef}><path className="finger" d="M67 34 C 87 48, 92 72, 80 90" /><circle className="tip" cx="80" cy="90" r="6" /></g>
                  <path className="shell" d="M28 38 Q28 6 50 6 Q72 6 72 38 Z" />
                  <rect className="shell" x="22" y="32" width="56" height="10" rx="5" />
                </svg>
              </div>
            </div>
            {moods.map((mood, i) => (
              <button
                key={mood.slug}
                type="button"
                ref={(el) => { capRefs.current[i] = el; }}
                className={`cap${mood.capsuleCover ? " cover" : ""}`}
                style={{ "--c": mood.color } as CSSProperties}
                aria-label={`Grab the ${mood.name} capsule`}
                disabled={ui.busy || ui.modes[i] !== "slot"}
                onClick={() => api.current.pick(i)}
              >
                <img src={mood.capsuleImage} alt="" draggable={false} />
              </button>
            ))}
            {moods.map((mood, i) => (
              <span key={mood.slug} ref={(el) => { lblRefs.current[i] = el; }} className={`lbl${ui.modes[i] !== "slot" ? " away" : ""}`}>
                {mood.name}
              </span>
            ))}
          </div>
          <div className="deck">
            <p className="hint" aria-live="polite">
              <span>{ui.holding ? "Drop it back," : "Steer the claw,"}</span>
              <span>{ui.holding ? "or swap with the arrows" : "then hit Grab"}</span>
            </p>
            <div className="pad">
              <button type="button" className="arrow" aria-label={ui.holding ? "Previous capsule" : "Move claw left"} disabled={ui.busy || (!ui.holding && ui.target === 0)} onClick={() => api.current.step(-1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
              </button>
              <button
                type="button"
                className="go"
                disabled={ui.busy}
                aria-label={ui.holding ? `Drop the ${m.name} capsule` : `Grab the ${moods[ui.target].name} capsule`}
                onClick={() => api.current.go()}
              >
                {ui.holding ? "Drop" : "Grab"}
              </button>
              <button type="button" className="arrow" aria-label={ui.holding ? "Next capsule" : "Move claw right"} disabled={ui.busy || (!ui.holding && ui.target === moods.length - 1)} onClick={() => api.current.step(1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="side">
          <div className="arc-head">
            <h2 className="fat" id="arcH">Pick their mood.</h2>
            <p>Steer the claw, grab a capsule and see what&apos;s inside.</p>
          </div>
          <div className="reveal" aria-live="polite">
            <div>
              <span className="pill">Inside this capsule</span>
              <h3 className="fat" key={m.slug}>{m.name}</h3>
              <p className="blurb">{m.blurb}</p>
            </div>
            <div className="goods" key={`goods-${m.slug}`}>
              {m.products.slice(0, 2).map((p) =>
                p.image ? (
                  <Link className="good" key={p.name} href={`/shop/${m.slug}/`}>
                    <div className="im"><img src={p.image} alt="" /></div>
                    <b>{p.name}</b>
                    <span>{p.availability}</span>
                  </Link>
                ) : (
                  <div className="good soon" key={p.name}>
                    <div className="im" aria-hidden="true">+</div>
                    <b>{p.name}</b>
                    <span>{p.availability}</span>
                  </div>
                ),
              )}
            </div>
            <div className="acts">
              <Link className="btn" href={`/shop/${m.slug}/`}>See all {m.name.toLowerCase()}</Link>
              <a className="btn btn--white" href="#join">Join the pack</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
