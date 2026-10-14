"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

// Placeholder video. Replace with your own mp4/webm link later.
// If it fails to load, the grid background behind it still shows.
// const HERO_VIDEO_SRC ="Https://cdn.prod.website-files.com/6a6f262be15ed44701a53fe8%2F6a71e76881c6f6c3ef0c9987_hero-bg_mp4.mp4";
const HERO_VIDEO_SRC =
  "https://cdn.pixabay.com/video/2017/03/20/8449-209292163_large.mp4";
  // "https://cdn.pixabay.com/video/2022/09/08/130591-747868243_large.mp4";
//   "https://cdn.pixabay.com/video/2024/06/06/215535_large.mp4f";

const gridStyle: React.CSSProperties = {
  backgroundImage: [
    "linear-gradient(rgba(233,162,59,.10) 1px,transparent 1px)",
    "linear-gradient(90deg,rgba(233,162,59,.10) 1px,transparent 1px)",
    "linear-gradient(rgba(233,162,59,.04) 1px,transparent 1px)",
    "linear-gradient(90deg,rgba(233,162,59,.04) 1px,transparent 1px)",
  ].join(","),
  backgroundSize: "120px 120px,120px 120px,24px 24px,24px 24px",
};

const shadeStyle: React.CSSProperties = {
  background:
    "linear-gradient(90deg,rgba(20,16,11,.92) 0%,rgba(20,16,11,.55) 45%,rgba(20,16,11,.1) 100%)," +
    "linear-gradient(180deg,rgba(20,16,11,.55) 0%,transparent 22%,transparent 60%,rgba(20,16,11,.9) 100%)",
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [paused, setPaused] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
      setPaused(false);
    } else {
      userPaused.current = true;
      v.pause();
      setPaused(true);
    }
  };

  // Stop decoding the video while the hero is off-screen. This frees the GPU
  // for the rest of the page, so scrolling stays smooth.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!userPaused.current) video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    io.observe(section);
    return () => io.disconnect();
  }, [videoFailed]);

  return (
    <section ref={sectionRef} className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden">
      {/* Background: glow + grid + video */}
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(60%_70%_at_78%_40%,rgba(233,162,59,.12),transparent_70%)]">
        <div className="absolute inset-0" style={gridStyle} />
        {!videoFailed && (
          <video
            ref={videoRef}
            src={HERO_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 size-full transform-gpu object-cover"
          />
        )}
      </div>
      <div className="absolute inset-0 -z-20" style={shadeStyle} />

      {/* Pause / play (no backdrop blur: blurring a playing video is expensive) */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={toggle}
        aria-label={paused ? "Play background video" : "Pause background video"}
        className="absolute right-[18px] top-[84px] size-11 rounded-[10px] bg-card/85 hover:bg-foreground/10 md:top-24"
      >
        {paused ? <Play className="size-4 fill-current" /> : <Pause className="size-4 fill-current" />}
      </Button>

      <div className="mx-auto w-full max-w-[1480px] px-[clamp(20px,3.2vw,48px)]">
        <div className="pt-32 md:pt-[150px]">
          {/* Archivo variable, 400, #F3F1EC, ~99.6px at 1366px wide */}
          <h1 className="max-w-[12em] font-display text-[clamp(44px,7.29vw,132px)] font-normal leading-[.95] tracking-[-.045em] text-[#F3F1EC]">
            <span className="block">Real data, greater control.</span>
            <em className="block bg-linear-to-b from-[#bdbab3] to-[#8c8981] bg-clip-text not-italic text-transparent">
              A healthier you.
            </em>
          </h1>
        </div>

        <div className="flex flex-col items-stretch gap-8 pb-[34px] pt-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[400px]">
            <p className="text-[17px] leading-normal text-[#cfc4b0]">
              Vitalyzer turns your daily health data into clear insights, helping you understand
              your body, make better decisions, and live a longer, healthier life.
            </p>
            <Button  className="mt-[22px] h-auto rounded-lg px-[26px] py-3.5 text-[15px] font-semibold">
              <Link href="#pricing">Start your journey</Link>
            </Button>
          </div>

          <Link
            href="#"
            className="flex w-full items-center gap-5 rounded-2xl border border-border bg-card/85 p-4 transition-colors hover:border-primary/50 md:w-[355px]"
          >
            <div>
              <small className="mb-2 flex items-center gap-[7px] text-xs tracking-[.14em] text-muted-foreground before:size-[5px] before:bg-primary">
                NEW
              </small>
              <p className="text-[14.5px] font-semibold leading-[1.35]">
                Connect your watch, ring or phone in one afternoon, with your history imported.
              </p>
            </div>
            <div
              className="size-[90px] shrink-0 overflow-hidden rounded-lg border border-border bg-background"
              aria-hidden="true"
            >
              <svg viewBox="0 0 90 90" preserveAspectRatio="none" className="block size-full">
                <rect width="90" height="90" fill="#14100b" />
                <g stroke="rgba(233,162,59,.18)">
                  <path d="M0 22.5h90M0 45h90M0 67.5h90M22.5 0v90M45 0v90M67.5 0v90" />
                </g>
                <path
                  d="M0 52h14l3-6 3 6h8l3 6 4-34 4 40 3-6h8l3-5 3 5h16"
                  fill="none"
                  stroke="#e9a23b"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}