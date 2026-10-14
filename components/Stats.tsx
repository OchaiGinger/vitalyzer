import type { ReactNode } from "react";

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
    tag: "Fast",
    value: "<3",
    unit: "min",
    title: "Time to fresh insight",
    desc: "From a new reading on your device to an updated recovery score.",
  },
];

/* ---------- Drawn visual for the last card (stands in for the photo) ---------- */

const beat = (() => {
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

function VisualCard({ top, bottom }: { top: string; bottom: string }) {
  return (
    <article className="relative isolate flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 lg:min-h-[480px]">
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
          <polyline
            points={beat}
            fill="none"
            stroke="#e9a23b"
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
      </div>

      <p className="text-right text-xs uppercase tracking-[.2em] text-[#F3F1EC]">{top}</p>
      <p className="text-xs uppercase tracking-[.2em] text-[#F3F1EC]">{bottom}</p>
    </article>
  );
}

function StatCard({ tag, value, unit, title, desc }: (typeof STATS)[number]): ReactNode {
  return (
    <article className="relative flex min-h-[420px] flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-colors duration-500 hover:border-foreground/25 sm:p-8 lg:min-h-[480px]">
      <div className="flex items-start justify-between gap-4">
        <p className="flex items-center gap-2 pt-2 text-xs uppercase tracking-[.2em] text-muted-foreground before:size-[6px] before:animate-pulse before:bg-primary motion-reduce:before:animate-none">
          {tag}
        </p>
        <p className="flex items-start gap-2 text-[#F3F1EC]">
          <span className="font-display text-[clamp(72px,10vw,160px)] font-normal leading-[.9] tracking-[-.05em]">
            {value}
          </span>
          <span className="pt-2 text-[clamp(14px,1.6vw,24px)] uppercase text-[#8c8981]">{unit}</span>
        </p>
      </div>

      <div>
        <h3 className="font-display text-[clamp(22px,1.9vw,27px)] font-medium leading-[1.2] tracking-[-.01em] text-[#F3F1EC]">
          {title}
        </h3>
        <p className="mt-3 max-w-[40ch] text-[15px] leading-snug text-muted-foreground">{desc}</p>
      </div>
    </article>
  );
}

/* ---------- Section ---------- */

export default function Stats() {
  return (
    <section
      id="stats"
      className="mx-auto w-full max-w-[1480px] px-[clamp(20px,3.2vw,48px)] pb-[clamp(72px,10vw,140px)]"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {STATS.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
        <VisualCard top="3 areas / 40+ devices" bottom="Connected devices" />
      </div>
    </section>
  );
}