"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, HeartPulse, Moon, type LucideIcon } from "lucide-react";

type Kind = "heart" | "sleep" | "load";

type Item = {
  id: string;
  kind: Kind;
  icon: LucideIcon;
  tab: string; // label in the left list and on the card
  title: string;
  desc: string;
  metric: { label: string; value: string; unit: string };
  accent: string; // Iris is reserved for sleep in the brand
};

const ITEMS: Item[] = [
  {
    id: "heart",
    kind: "heart",
    icon: HeartPulse,
    tab: "Heart and recovery",
    title: "Your resting heart rate, in context.",
    desc: "A rate that climbs for several days is often the first sign of stress or illness. Vitalyzer shows the change beside what you did.",
    metric: { label: "Resting, 7-day average", value: "58", unit: "bpm" },
    accent: "#e9a23b",
  },
  {
    id: "sleep",
    kind: "sleep",
    icon: Moon,
    tab: "Sleep",
    title: "Sleep, judged against your own average.",
    desc: "Length, stages and regularity compared with your own history, not a fixed eight-hour rule.",
    metric: { label: "Typical night", value: "7h 25", unit: "m" },
    accent: "#7b86e8",
  },
  {
    id: "load",
    kind: "load",
    icon: Activity,
    tab: "Activity and load",
    title: "Training load that knows when to ease off.",
    desc: "Movement across the whole day, including walks that never get logged as workouts, folded into one morning recovery score.",
    metric: { label: "Recovery score", value: "87", unit: "/ 100" },
    accent: "#e9a23b",
  },
];

/* ---------- Card visuals (drawn, so no photos are needed) ---------- */

// Repeating ECG beat across the card width
const ecg = (() => {
  const pts: string[] = [];
  for (let x = -10; x < 700; x += 130) {
    pts.push(
      `${x},200`, `${x + 20},200`, `${x + 25},192`, `${x + 30},200`, `${x + 50},200`,
      `${x + 55},212`, `${x + 62},110`, `${x + 70},236`, `${x + 75},200`, `${x + 100},200`,
      `${x + 112},186`, `${x + 124},200`,
    );
  }
  return pts.join(" ");
})();

const hypnogram =
  "M0,170 H60 V220 H130 V170 H190 V120 H215 V170 H270 V230 H350 V170 H410 V150 H470 V200 H520 V170 H590 V140 H640";

const loadBars = [10, 8, 6, 6, 8, 20, 60, 90, 70, 40, 36, 50, 95, 60, 35, 30, 44, 66, 80, 55, 35, 22, 14, 8, 6, 4, 3];

function Visual({ kind, accent }: { kind: Kind; accent: string }) {
  return (
    <div className="absolute inset-0 -z-20" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(233,162,59,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(233,162,59,.09) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <svg viewBox="0 0 640 440" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        {kind === "heart" && (
          <polyline
            points={ecg}
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {kind === "sleep" && (
          <path
            d={hypnogram}
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {kind === "load" &&
          loadBars.map((h, i) => (
            <rect
              key={i}
              x={i * 24 + 6}
              y={300 - h * 1.8}
              width="14"
              height={h * 1.8}
              rx="2"
              fill={accent}
              opacity={0.22 + (h / 95) * 0.45}
            />
          ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/10" />
    </div>
  );
}

/* ---------- Section ---------- */

export default function Capabilities() {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // The card crossing the middle of the screen is the active one
  useEffect(() => {
    const els = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => {
    const el = cardRefs.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const top = window.scrollY + r.top - Math.max(96, (window.innerHeight - r.height) / 2);
    const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, o?: { duration?: number }) => void } })
      .lenis;
    if (lenis) lenis.scrollTo(top, { duration: 1.1 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      id="capabilities"
      className="mx-auto w-full max-w-[1480px] px-[clamp(20px,3.2vw,48px)] pb-[clamp(72px,10vw,140px)] pt-[clamp(24px,4vw,60px)]"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1fr)] lg:gap-x-16">
        {/* Left: pinned while the cards scroll */}
        <div className="flex flex-col justify-between gap-12 lg:sticky lg:top-24 lg:h-[calc(100svh-7rem)] lg:min-h-[520px] lg:self-start">
          <div>
            <p className="flex items-center gap-2 text-sm tracking-wide text-muted-foreground before:size-[5px] before:bg-primary">
              What it reads
            </p>
            <h2 className="mt-8 font-display text-[clamp(32px,3.2vw,52px)] font-normal leading-[1.08] tracking-[-.035em] text-[#F3F1EC]">
              Complex bodies.
              <br />
              <span className="text-[#8c8981]">Plain answers.</span>
            </h2>
            <p className="mt-8 max-w-[32ch] text-[15px] leading-snug text-muted-foreground">
              We read the signals that matter most, across three areas, and explain each one in words you can act on.
            </p>
          </div>

          {/* List: hidden on small screens, where each card carries its own label */}
          <ul className="hidden max-w-[328px] border-t border-border lg:block" aria-label="Capabilities">
            {ITEMS.map((item, i) => {
              const on = i === active;
              return (
                <li key={item.id} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-current={on}
                    className={`flex w-full items-center py-4 text-left text-xs uppercase tracking-[.14em] transition-colors duration-300 ${
                      on ? "text-[#F3F1EC]" : "text-muted-foreground hover:text-[#F3F1EC]"
                    }`}
                  >
                    <span
                      className={`bg-primary transition-all duration-300 ${
                        on ? "mr-3 size-[7px] opacity-100" : "mr-0 size-[7px] w-0 opacity-0"
                      }`}
                    />
                    {item.tab}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: cards scroll past */}
        <div className="flex flex-col gap-4">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <article
                key={item.id}
                id={`cap-${item.id}`}
                data-i={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="relative isolate flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors duration-500 hover:border-foreground/25 sm:min-h-[460px] sm:p-8 lg:min-h-[435px]"
              >
                <Visual kind={item.kind} accent={item.accent} />

                <div className="flex items-start justify-between gap-4">
                  <span
                    className="grid size-[43px] place-items-center rounded-lg border bg-background/60"
                    style={{ borderColor: `${item.accent}99`, color: item.accent }}
                  >
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="pt-1 text-right text-xs uppercase tracking-[.2em] text-muted-foreground">
                    {item.tab}
                  </span>
                </div>

                <div>
                  <h3 className="max-w-[22ch] font-display text-[clamp(22px,1.9vw,27px)] font-medium leading-[1.2] tracking-[-.01em] text-[#F3F1EC]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-[15px] leading-snug text-muted-foreground">{item.desc}</p>
                  <p className="mt-6 flex items-baseline gap-2.5 text-[11px] uppercase tracking-[.18em] text-muted-foreground">
                    {item.metric.label}
                    <span className="text-base font-semibold normal-case tracking-normal text-[#F3F1EC]">
                      {item.metric.value}
                    </span>
                    <span>{item.metric.unit}</span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}