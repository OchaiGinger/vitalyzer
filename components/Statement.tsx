"use client";

import { useEffect, useRef } from "react";

const TEXT =
  "Vitalyzer turns your daily health data into plain-spoken insight, judged against your own normal and not a population average. " +
  "From a resting heart rate that creeps up for three days to a night of broken sleep, every reading arrives with its context, " +
  "so you know what changed and what to do about it.";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

export default function Statement() {
  const textRef = useRef<HTMLParagraphElement>(null);

  // Words fade in one after another as the paragraph scrolls through the viewport.
  // Scroll position sets a target; the painted value eases toward it each frame,
  // so wheel steps never make the fade jump.
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }

    const SPREAD = 18; // words mid-fade at once (higher = slower, softer fade)
    let target = 0;
    let current = -1;
    let raf = 0;

    const paint = (p: number) => {
      const n = words.length;
      for (let i = 0; i < n; i++) {
        const t = clamp((p * (n + SPREAD) - i) / SPREAD);
        words[i].style.opacity = (0.28 + 0.72 * t).toFixed(3);
      }
    };

    const step = () => {
      raf = 0;
      if (current < 0) current = target;
      current += (target - current) * 0.06; // lower = slower easing
      if (Math.abs(target - current) < 0.0005) current = target;
      paint(current);
      if (current !== target) raf = requestAnimationFrame(step);
    };

    const measure = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the paragraph top reaches 90% of the viewport, 1 when its bottom reaches 35%
      // (a longer scroll distance than before, so the fade takes more scrolling)
      target = clamp((vh * 0.9 - r.top) / (vh * 0.55 + r.height));
      if (!raf) raf = requestAnimationFrame(step);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="product"
      className="mx-3 mb-3 mt-[clamp(40px,9.5vw,130px)] scroll-mt-4 rounded-[20px] bg-primary px-5 pb-[clamp(96px,14vw,190px)] pt-[clamp(96px,14vw,190px)] sm:mx-4 sm:mb-4 sm:px-7"
    >
      {/* Archivo 400, #0B0C0D, 45.5px at a 1366px-wide viewport (3.333vw), line height 1.2 */}
      <p
        ref={textRef}
        aria-label={TEXT}
        className="font-display text-[clamp(26px,3.333vw,64px)] font-normal leading-[1.2] tracking-[-.01em] text-[#0B0C0D]"
      >
        {TEXT.split(" ").map((word, i) => (
          <span key={i} aria-hidden="true">
            <span data-w className="opacity-[.28]">
              {word}
            </span>{" "}
          </span>
        ))}
      </p>
    </section>
  );
}