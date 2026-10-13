"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, Download, ShieldCheck, Sunrise, type LucideIcon } from "lucide-react";

type Item = { icon: LucideIcon; tag: string; title: string; desc: string };

// Values here are things the product actually does, not marketing numbers.
const ITEMS: Item[] = [
  {
    icon: Activity,
    tag: "14-DAY BASELINE",
    title: "Judged against your own normal",
    desc: "After two weeks of readings, high and low are measured against your body, not a population average.",
  },
  {
    icon: Sunrise,
    tag: "DAILY READ",
    title: "A short read every morning",
    desc: "One paragraph on how you're recovering, and one or two things worth changing.",
  },
  {
    icon: ShieldCheck,
    tag: "AES-256",
    title: "Encrypted, and never sold",
    desc: "Protected in transit and at rest. Not shared with advertisers or insurers, even anonymised.",
  },
  {
    icon: Download,
    tag: "EXPORT",
    title: "Yours to take with you",
    desc: "Download everything or delete your account from Settings at any time. No email required.",
  },
];

export default function WhyVitalyzer() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="science"
      className="mx-auto grid w-full max-w-[1480px] scroll-mt-4 gap-12 bg-ink px-[clamp(20px,3.2vw,48px)] py-[clamp(72px,10vw,140px)] lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.6fr)] lg:gap-16"
    >
      {/* Left: label, heading, intro */}
      <div>
        <p className="flex items-center gap-2 text-sm tracking-wide text-muted-foreground before:size-[5px] before:bg-primary">
          Why Vitalyzer
        </p>
        <h2 className="mt-8 font-display text-[clamp(32px,3.2vw,52px)] font-normal leading-[1.08] tracking-[-.035em] text-[#F3F1EC]">
          Clear by default.
          <br />
          <span className="text-[#8c8981]">Private by design.</span>
        </h2>
        <p className="mt-8 max-w-[26ch] text-[15px] leading-snug text-muted-foreground">
          Four commitments we hold to on every reading, from your wrist to your morning summary.
        </p>
      </div>

      {/* Right: 2 x 2 grid */}
      <div
        ref={gridRef}
        className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2"
      >
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="bg-background p-6 sm:p-8">
              <div
                style={{ transitionDelay: `${i * 120}ms` }}
                className={`flex h-full min-h-[240px] flex-col transition duration-700 ease-out motion-reduce:transition-none sm:min-h-[280px] ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-[43px] place-items-center rounded-lg border border-primary/60 text-primary">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="pt-1 text-xs font-medium tracking-[.2em] text-muted-foreground">
                    {item.tag}
                  </span>
                </div>

                <div className="mt-auto pt-10">
                  <h3 className="font-display text-[clamp(20px,1.8vw,26px)] font-medium leading-[1.2] tracking-[-.01em] text-[#F3F1EC]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[32ch] text-[15px] leading-snug text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}