"use client";

import { useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";

/* ---------- Placeholder figures: replace with your real numbers ---------- */

const STATS = [
  {
    tag: "Live",
    value: "2.4",
    unit: "M",
    title: "Readings analysed daily",
    desc: "Heart rate, sleep and movement samples read across every connected device.",
  },
  {
    tag: "Online",
    value: "99.98",
    unit: "%",
    title: "Sync reliability",
    desc: "Share of scheduled device syncs that completed, trailing 12 months.",
  },
  {
    tag: "Scaling",
    value: "< 3",
    unit: "min",
    title: "Time to fresh insight",
    desc: "From a new reading on your device to an updated recovery score.",
  },
];

/* ---------- Drawn background: flowing light streaks, no video needed ---------- */

const STREAKS = [
  { d: "M-100,640 C240,520 420,760 760,560 S1200,300 1560,180", w: 1.5, delay: 0, dur: 14, o: 0.9 },
  { d: "M-100,700 C260,600 480,800 820,620 S1240,380 1560,260", w: 1, delay: -3, dur: 17, o: 0.6 },
  { d: "M-100,590 C200,470 380,700 720,520 S1180,240 1560,110", w: 2.5, delay: -6, dur: 12, o: 0.7 },
  { d: "M-100,760 C300,680 520,820 880,680 S1260,470 1560,360", w: 1, delay: -9, dur: 19, o: 0.45 },
  { d: "M-100,540 C180,430 340,640 680,470 S1140,190 1560,40", w: 1, delay: -2, dur: 16, o: 0.4 },
];

function Streaks({ paused }: { paused: boolean }) {
  return (
    <div className="absolute inset-0 -z-20" aria-hidden="true" data-paused={paused}>
      <svg
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
      >
        <defs>
          <linearGradient id="perf-streak" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#e9a23b" stopOpacity="0" />
            <stop offset="0.45" stopColor="#e9a23b" stopOpacity="0.9" />
            <stop offset="0.75" stopColor="#F3F1EC" stopOpacity="1" />
            <stop offset="1" stopColor="#e9a23b" stopOpacity="0" />
          </linearGradient>
          <filter id="perf-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* soft glow layer */}
        <g filter="url(#perf-glow)" opacity="0.55">
          {STREAKS.map((s, i) => (
            <path
              key={`g${i}`}
              d={s.d}
              fill="none"
              stroke="url(#perf-streak)"
              strokeWidth={s.w * 5}
              className="perf-streak"
              style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
              pathLength={1}
            />
          ))}
        </g>

        {/* crisp line layer */}
        <g>
          {STREAKS.map((s, i) => (
            <path
              key={i}
              d={s.d}
              fill="none"
              stroke="url(#perf-streak)"
              strokeWidth={s.w}
              strokeLinecap="round"
              opacity={s.o}
              className="perf-streak"
              style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
              pathLength={1}
            />
          ))}
        </g>
      </svg>

      {/* veil: darkens the left for text, fades into the page at top and bottom */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <style>{`
        .perf-streak {
          stroke-dasharray: 0.55 0.45;
          stroke-dashoffset: 1;
          animation-name: perf-flow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        [data-paused="true"] .perf-streak { animation-play-state: paused; }
        @keyframes perf-flow {
          from { stroke-dashoffset: 1; }
          to   { stroke-dashoffset: -1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .perf-streak { animation: none; stroke-dasharray: none; stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

/* ---------- Small waveform for the 4th card ---------- */

const wave = (() => {
  const pts: string[] = [];
  for (let x = 0; x <= 320; x += 4) {
    const y = 60 + Math.sin(x / 14) * 14 + Math.sin(x / 5) * 5;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return pts.join(" ");
})();

/* ---------- Section ---------- */

export default function Performance() {
  const [paused, setPaused] = useState(false);

  return (
    <section id="performance" className="relative w-full">
      {/* Hero panel */}
      <div className="relative isolate flex min-h-[640px] items-center overflow-hidden lg:min-h-[88svh]">
        <Streaks paused={paused} />

        <div className="mx-auto w-full max-w-[1480px] px-[clamp(20px,3.2vw,48px)] py-[clamp(96px,12vw,160px)]">
          <p className="flex items-center gap-2 text-sm tracking-wide text-muted-foreground before:size-[5px] before:bg-primary">
            Performance
          </p>

          <h2 className="mt-8 max-w-[14ch] font-display text-[clamp(44px,6.4vw,104px)] font-normal leading-[1.02] tracking-[-.04em] text-[#F3F1EC]">
            Accuracy
            <br />
            <span className="text-[#8c8981]">proven at scale.</span>
          </h2>

          <p className="mt-8 max-w-[38ch] text-[15px] leading-snug text-muted-foreground">
            Built to be trusted with your health data, Vitalyzer reads every figure below across all connected
            devices, measured at the 95th percentile over the last twelve months.
          </p>

          <a
            href="#method"
            className="group mt-10 inline-flex items-center gap-3 rounded-lg bg-[#F3F1EC] py-2 pl-4 pr-2 text-sm font-medium text-[#0b0b0b] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            See the method
            <span className="grid size-7 place-items-center rounded-md bg-[#0b0b0b] text-[#F3F1EC] transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </a>
        </div>

        {/* Pause control for the background motion */}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Play background animation" : "Pause background animation"}
          className="absolute right-[clamp(20px,3.2vw,48px)] top-[clamp(20px,3vw,40px)] grid size-11 place-items-center rounded-lg border border-border bg-background/60 text-[#F3F1EC] backdrop-blur transition-colors hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
        </button>

        {/* Status row */}
        <div className="absolute bottom-6 right-[clamp(20px,3.2vw,48px)] hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[.18em] text-muted-foreground sm:flex">
          <span>Sync status: Nominal</span>
          <span aria-hidden="true">/</span>
          <span>P95 latency: Active</span>
        </div>
      </div>

    
    </section>
  );
}