"use client";

import { useEffect, useRef } from "react";

type CursorState = "default" | "link" | "media" | "hidden";

/**
 * Corner-bracket cursor with a centre dot (mouse devices only).
 *  - default: bracket + dot
 *  - links/buttons: bracket tightens, dot grows
 *  - media (<img>, <video>, or anything with data-cursor="media"): becomes < • > chevrons
 */
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let seen = false;

    const setState = (s: CursorState) => {
      el.dataset.state = s;
    };

    const stateFor = (target: EventTarget | null): CursorState => {
      if (!(target instanceof Element)) return "default";
      if (target.closest('[data-cursor="default"]')) return "default";
      if (target.closest('[data-cursor="media"], img, video')) return "media";
      if (target.closest('a, button, [role="button"], summary, label, select')) return "link";
      return "default";
    };

    const tick = () => {
      raf = 0;
      const k = reduce ? 1 : 0.22;
      x += (tx - x) * k;
      y += (ty - y) * k;
      if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) {
        x = tx;
        y = ty;
      }
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (x !== tx || y !== ty) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        x = tx;
        y = ty;
      }
      if (el.dataset.state === "hidden") setState(stateFor(e.target));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onOver = (e: MouseEvent) => setState(stateFor(e.target));
    const onLeave = () => setState("hidden");
    const onDown = () => {
      el.dataset.pressed = "true";
    };
    const onUp = () => {
      delete el.dataset.pressed;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    root.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      root.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={ref}
      data-state="hidden"
      aria-hidden="true"
      className="group pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference will-change-transform"
    >
      {/* Corner bracket */}
      <span className="absolute left-0 top-0 block size-9 -translate-x-1/2 -translate-y-1/2 transition-[transform,opacity] duration-300 ease-out group-data-[state=hidden]:opacity-0 group-data-[state=link]:scale-[.7] group-data-[state=media]:scale-[1.6] group-data-[state=media]:opacity-0">
        <i className="absolute left-0 top-0 size-2 border-l-2 border-t-2 border-white" />
        <i className="absolute right-0 top-0 size-2 border-r-2 border-t-2 border-white" />
        <i className="absolute bottom-0 left-0 size-2 border-b-2 border-l-2 border-white" />
        <i className="absolute bottom-0 right-0 size-2 border-b-2 border-r-2 border-white" />
      </span>

      {/* Centre dot */}
      <span className="absolute left-0 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-[transform,opacity] duration-300 group-data-[pressed=true]:scale-50 group-data-[state=hidden]:opacity-0 group-data-[state=link]:scale-[2.2] group-data-[state=media]:scale-75" />

      {/* Chevrons, shown over media */}
      <svg
        viewBox="-32 -32 64 64"
        className="absolute left-0 top-0 size-16 -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0 transition-[transform,opacity] duration-300 ease-out group-data-[state=media]:scale-100 group-data-[state=media]:opacity-100"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="-22,-6 -28,0 -22,6" />
        <polyline points="22,-6 28,0 22,6" />
        <polyline points="-6,22 0,28 6,22" />
      </svg>
    </div>
  );
}