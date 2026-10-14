"use client";

import { useEffect, useRef, useState } from "react";

/* ---------- Replace names, roles and photos with your real team ---------- */
/* Put portraits in /public/team/ (3:4 works best, any size). If a file is
   missing, a placeholder silhouette is used so the effect still works. */

type Member = { name: string; role: string; photo: string };

const TEAM: Member[] = [
  { name: "Amara Okafor", role: "Founder", photo: "/team/member-1.jpg" },
  { name: "Daniel Reyes", role: "Clinical lead", photo: "/team/member-2.jpg" },
  { name: "Priya Nair", role: "Data science", photo: "/team/member-3.jpg" },
  { name: "Tomas Berg", role: "Engineering", photo: "/team/member-4.jpg" },
];

/* ---------- Pixelate + dither helpers ---------- */

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const INK = [20, 20, 20];
const PAPER = [239, 237, 231];
const ASPECT = 4 / 3; // card height / width

type Src = { el: CanvasImageSource; w: number; h: number };

function silhouette(): Src {
  const c = document.createElement("canvas");
  c.width = 300;
  c.height = 400;
  const g = c.getContext("2d")!;
  const bg = g.createLinearGradient(0, 0, 0, 400);
  bg.addColorStop(0, "#d9d6cd");
  bg.addColorStop(1, "#8d8a82");
  g.fillStyle = bg;
  g.fillRect(0, 0, 300, 400);
  g.fillStyle = "#2c2b28";
  g.beginPath();
  g.arc(150, 150, 62, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.ellipse(150, 420, 135, 150, 0, 0, Math.PI * 2);
  g.fill();
  return { el: c, w: 300, h: 400 };
}

function render(canvas: HTMLCanvasElement, src: Src, cols: number) {
  const rows = Math.round(cols * ASPECT);
  const tmp = document.createElement("canvas");
  tmp.width = cols;
  tmp.height = rows;
  const tg = tmp.getContext("2d", { willReadFrequently: true });
  if (!tg) return;

  // cover-crop the source to the card ratio, biased towards the top so faces stay in frame
  const sAspect = src.h / src.w;
  let sx = 0, sy = 0, sW = src.w, sH = src.h;
  if (sAspect > ASPECT) {
    sH = src.w * ASPECT;
    sy = (src.h - sH) * 0.2;
  } else {
    sW = src.h / ASPECT;
    sx = (src.w - sW) / 2;
  }
  tg.drawImage(src.el, sx, sy, sW, sH, 0, 0, cols, rows);

  const data = tg.getImageData(0, 0, cols, rows);
  const px = data.data;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
      const l = Math.min(255, Math.max(0, (lum - 128) * 1.3 + 138));
      const t = ((BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16) * 255;
      const c = l > t ? PAPER : INK;
      px[i] = c[0];
      px[i + 1] = c[1];
      px[i + 2] = c[2];
      px[i + 3] = 255;
    }
  }
  canvas.width = cols;
  canvas.height = rows;
  canvas.getContext("2d")?.putImageData(data, 0, 0);
}

/* ---------- Card ---------- */

function Card({ member, index }: { member: Member; index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const srcRef = useRef<Src | null>(null);
  const raf = useRef(0);
  const [on, setOn] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      srcRef.current = { el: img, w: img.naturalWidth, h: img.naturalHeight };
    };
    img.onerror = () => {
      setFailed(true);
      srcRef.current = silhouette();
    };
    img.src = member.photo;
    return () => cancelAnimationFrame(raf.current);
  }, [member.photo]);

  const start = () => {
    setOn(true);
    const canvas = canvasRef.current;
    const src = srcRef.current;
    if (!canvas || !src) return;
    cancelAnimationFrame(raf.current);

    const FROM = 200;
    const TO = 64;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render(canvas, src, TO);
      return;
    }
    const t0 = performance.now();
    const DUR = 360;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / DUR);
      const e = 1 - Math.pow(1 - p, 3);
      render(canvas, src, Math.round(FROM - (FROM - TO) * e));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  const stop = () => {
    cancelAnimationFrame(raf.current);
    setOn(false);
  };

  const move = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const el = reticleRef.current;
    if (el) el.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
  };

  return (
    <li
      tabIndex={0}
      onPointerEnter={start}
      onPointerLeave={stop}
      onPointerMove={move}
      onFocus={start}
      onBlur={stop}
      className="group relative aspect-[3/4] cursor-crosshair overflow-hidden bg-background outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    >
      {/* Base photo, black and white */}
      {failed ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#3a3935] to-[#1b1a18]" aria-hidden="true">
          <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMax slice" className="size-full">
            <circle cx="150" cy="170" r="62" fill="#6f6c64" />
            <ellipse cx="150" cy="430" rx="135" ry="150" fill="#6f6c64" />
          </svg>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.photo}
          alt={`${member.name}, ${member.role}`}
          className="absolute inset-0 size-full object-cover object-top grayscale contrast-110"
          onError={() => setFailed(true)}
        />
      )}

      {/* Pixelated overlay, shown on hover */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 size-full object-cover transition-opacity duration-200 [image-rendering:pixelated] ${
          on ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t transition-opacity duration-200 ${
          on ? "from-[#141414]/80 to-transparent" : "from-background/90 to-transparent"
        }`}
      />

      {/* Role tab */}
      <span className="absolute left-0 top-0 bg-primary px-3 py-1.5 font-mono text-[11px] uppercase tracking-[.14em] text-[#0b0b0b]">
        {member.role}
      </span>

      {/* Name */}
      <p className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-right font-display text-[clamp(20px,2.3vw,34px)] font-medium leading-[1.1] tracking-[-.02em] text-[#F3F1EC] sm:p-5">
        {member.name}
      </p>

      {/* Tracking reticle that follows the pointer */}
      <div
        ref={reticleRef}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 transition-[opacity,transform] duration-150 ease-out ${
          on ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: `translate(${index % 2 ? 60 : 40}px, 80px)` }}
      >
        <div className="relative -ml-[18px] -mt-[18px] size-9">
          <span className="absolute left-0 top-0 size-2.5 border-l-2 border-t-2 border-primary" />
          <span className="absolute right-0 top-0 size-2.5 border-r-2 border-t-2 border-primary" />
          <span className="absolute bottom-0 left-0 size-2.5 border-b-2 border-l-2 border-primary" />
          <span className="absolute bottom-0 right-0 size-2.5 border-b-2 border-r-2 border-primary" />
          <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
        </div>
      </div>
    </li>
  );
}

/* ---------- Section ---------- */

export default function Team() {
  return (
    <section
      id="team"
      className="mx-auto w-full max-w-[1480px] px-[clamp(20px,3.2vw,48px)] py-[clamp(72px,10vw,140px)]"
    >
      <p className="flex items-center gap-2 text-sm tracking-wide text-muted-foreground before:size-[5px] before:bg-primary">
        Team
      </p>
      <h2 className="mt-8 max-w-[22ch] font-display text-[clamp(34px,4.6vw,76px)] font-normal leading-[1.06] tracking-[-.04em] text-[#F3F1EC]">
        The people reading your signals,
        <span className="text-[#8c8981]"> building what health data has been missing.</span>
      </h2>

      <ul
        className="mt-[clamp(48px,8vw,120px)] grid grid-cols-2 gap-px border border-primary/40 bg-primary/40 lg:grid-cols-4"
        aria-label="Team members"
      >
        {TEAM.map((m, i) => (
          <Card key={m.name} member={m} index={i} />
        ))}
      </ul>
    </section>
  );
}