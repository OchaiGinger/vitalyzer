"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const INTERVAL = 7000; // ms each testimonial stays on screen

type Testimonial = {
  lead: string; // grey part of the quote
  emphasis: string; // white part of the quote
  name: string;
  role: string;
  initials: string;
  facts: [label: string, value: string][];
};

// Placeholder people and quotes. Replace with real testimonials (with permission).
const ITEMS: Testimonial[] = [
  {
    lead: "Last winter my resting heart rate crept up for four days before I felt a thing. Vitalyzer pointed it out on day three. ",
    emphasis: "I rested, and it never turned into the cold I was expecting.",
    name: "Amara Okoye",
    role: "Recreational runner",
    initials: "AO",
    facts: [
      ["Tracking for", "9 months"],
      ["Connected", "Watch and ring"],
    ],
  },
  {
    lead: "I used to check six apps every morning. Now there is one paragraph that tells me how I slept and whether to push today. ",
    emphasis: "It states the number, says what it means, and stops there.",
    name: "Tunde Bakare",
    role: "Software engineer",
    initials: "TB",
    facts: [
      ["Tracking for", "14 months"],
      ["Connected", "Phone and watch"],
    ],
  },
  {
    lead: "I wanted to see the readings behind any score before I trusted it. ",
    emphasis:
      "Here every figure arrives with its context, and the weekly report is something I can pass on to a patient's doctor.",
    name: "Sade Williams",
    role: "Physiotherapist",
    initials: "SW",
    facts: [
      ["Tracking for", "5 months"],
      ["Connected", "Ring"],
    ],
  },
];

const N = ITEMS.length;
const pad = (n: number) => String(n).padStart(2, "0");

const slideClass = (active: boolean) =>
  `col-start-1 row-start-1 transition-[opacity,transform,visibility] duration-700 ease-out motion-reduce:transition-none ${
    active ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"
  }`;

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [inView, setInView] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const [reduce, setReduce] = useState(false);

  const running = !hover && !focus && inView && !docHidden && !reduce;

  const go = (i: number) => setIndex(((i % N) + N) % N);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const onVis = () => setDocHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);

    const el = sectionRef.current;
    let io: IntersectionObserver | undefined;
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
      io.observe(el);
    } else {
      setInView(true);
    }

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  // Swipe left / right on touch screens
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) next();
      else prev();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setFocus(true)}
      onBlur={() => setFocus(false)}
      className="mx-auto w-full max-w-[1480px] scroll-mt-4 bg-ink px-[clamp(20px,3.2vw,48px)] py-[clamp(72px,10vw,140px)]"
    >
      <div className="grid gap-y-10 lg:min-h-[560px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr_auto] lg:gap-x-16">
        {/* Label */}
        <p className="flex items-center gap-2 text-sm tracking-wide text-muted-foreground before:size-[5px] before:bg-primary lg:col-start-1 lg:row-start-1">
          Testimonial
        </p>

        {/* Quote */}
        <div
          className="touch-pan-y lg:col-start-2 lg:row-span-2 lg:row-start-1"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <svg
            viewBox="0 0 40 32"
            className="mb-6 h-7 w-auto text-primary sm:h-8"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M0 32V19.2C0 8.2 5.6 1.6 15.6 0l1.6 4.8C11.6 6.4 9.2 9.6 8.8 14H16V32H0Zm23.2 0V19.2C23.2 8.2 28.8 1.6 38.8 0L40 4.8C34.8 6.4 32.4 9.6 32 14h7.2V32h-16Z" />
          </svg>

          <div className="grid" aria-live={running ? "off" : "polite"}>
            {ITEMS.map((t, i) => (
              <blockquote key={t.name} aria-hidden={i !== index} className={slideClass(i === index)}>
                <p className="font-display text-[clamp(24px,2.85vw,46px)] font-normal leading-[1.2] tracking-[-.02em] text-[#9b9890]">
                  {t.lead}
                  <span className="text-[#F3F1EC]">{t.emphasis}</span>
                </p>
              </blockquote>
            ))}
          </div>
        </div>

        {/* Person */}
        <div className="lg:col-start-1 lg:row-start-3 lg:self-end">
          <p className="mb-6 text-sm tabular-nums tracking-wider text-muted-foreground">
            {pad(index + 1)} / {pad(N)}
          </p>

          <div className="grid max-w-[370px]">
            {ITEMS.map((t, i) => (
              <div key={t.name} aria-hidden={i !== index} className={slideClass(i === index)}>
                <span className="grid size-14 place-items-center rounded-full border border-primary/60 bg-card font-serif text-xl text-primary">
                  {t.initials}
                </span>
                <p className="mt-5 text-lg font-medium text-[#F3F1EC]">{t.name}</p>
                <p className="text-[15px] text-muted-foreground">{t.role}</p>

                <dl className="mt-8">
                  {t.facts.map(([label, value], k) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between gap-4 py-2.5 text-xs tracking-[.14em] ${
                        k === 0 ? "border-t border-border" : ""
                      }`}
                    >
                      <dt className="text-muted-foreground">{label.toUpperCase()}</dt>
                      <dd className="text-[#F3F1EC]">{value.toUpperCase()}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>

        {/* Controls: progress bars + prev / next. Full width on mobile, 44px touch targets. */}
        <div className="flex items-center gap-3 sm:gap-4 lg:col-start-2 lg:row-start-3 lg:self-end">
          <div className="flex flex-1 gap-2" role="tablist" aria-label="Choose testimonial">
            {ITEMS.map((t, i) => {
              const active = i === index;
              return (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Show testimonial ${i + 1} of ${N}`}
                  onClick={() => go(i)}
                  className="group flex-1 py-4"
                >
                  <span className="relative block h-[3px] overflow-hidden rounded-full bg-border transition-colors group-hover:bg-foreground/30">
                    {active && (
                      <span
                        key={index}
                        className="absolute inset-0 origin-left rounded-full bg-primary"
                        style={
                          reduce
                            ? undefined
                            : {
                                animation: `tprogress ${INTERVAL}ms linear forwards`,
                                animationPlayState: running ? "running" : "paused",
                              }
                        }
                        onAnimationEnd={(e) => {
                          if (e.target === e.currentTarget) next();
                        }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={prev}
              aria-label="Previous testimonial"
              className="size-11 rounded-full bg-transparent hover:bg-foreground/10 sm:size-12"
            >
              <ArrowLeft className="size-4 sm:size-[18px]" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={next}
              aria-label="Next testimonial"
              className="size-11 rounded-full bg-transparent hover:bg-foreground/10 sm:size-12"
            >
              <ArrowRight className="size-4 sm:size-[18px]" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}