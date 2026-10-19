"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "#product", label: "Product" },
  { href: "#science", label: "Science" },
  { href: "#pricing", label: "Pricing" },
];

const pages = [
  { href: "#about", label: "About", desc: "Why we built a health app that explains itself." },
  { href: "#team", label: "Team", desc: "The engineers, clinicians and designers behind the read." },
  { href: "#", label: "Careers", desc: "A small team doing careful work. See open roles." },
  { href: "#contact", label: "Contact", desc: "Write to us and a person replies." },
];

const stories = [
  {
    href: "#",
    title: "Why your resting heart rate drifts for three days",
    stroke: "#e9a23b",
    points:
      "0,120 60,120 70,112 80,120 130,120 138,128 146,40 156,150 164,120 230,120 246,108 262,120 330,120 338,128 346,52 356,146 364,120 400,120",
  },
  {
    href: "#",
    title: "Sleep, judged against your own average",
    stroke: "#7b86e8", // Iris: sleep data only
    points:
      "0,150 40,150 40,110 90,110 90,70 150,70 150,120 200,120 200,90 260,90 260,140 320,140 320,100 400,100",
  },
];

const gridStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(233,162,59,.10) 1px,transparent 1px),linear-gradient(90deg,rgba(233,162,59,.10) 1px,transparent 1px)",
  backgroundSize: "40px 40px",
};

const linkClass =
  "flex items-center gap-1.5 py-2 text-[15.5px] font-medium transition-colors hover:text-primary";

function Logo({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="#top"
      onClick={onClick}
      aria-label="Vitalyzer home"
      className={`flex items-center gap-3 font-serif text-[23px] leading-none tracking-[-.03em] sm:text-[26px] ${className}`}
    >
      <span className="grid size-[34px] shrink-0 place-items-center rounded-[9px] border border-border bg-card">
        <svg viewBox="0 0 60 52" className="h-auto w-[17px]" aria-hidden="true">
          <path d="M0 0H18L30 26V52Z" fill="#e9a23b" />
          <path d="M60 0H42L30 26V52Z" fill="#f2bd6a" />
        </svg>
      </span>
      vitalyzer
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false); // desktop Company panel
  const [menuOpen, setMenuOpen] = useState(false); // mobile / tablet menu
  const hovered = useRef(false);

  const closeMenu = () => setMenuOpen(false);

  const mouseOnly = (fn: () => void) => (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") fn();
  };

  return (
    <header
      onPointerLeave={mouseOnly(() => {
        hovered.current = false;
        setOpen(false);
      })}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      className={`fixed inset-x-3 top-3 z-50 overflow-hidden rounded-[14px] border border-border backdrop-blur-md transition-colors duration-300 sm:inset-x-[18px] sm:top-3.5 ${
        open ? "bg-background" : "bg-background/60"
      }`}
    >
      {/* Top bar */}
      <div className="relative flex h-[54px] items-center justify-between gap-3 pl-2 pr-2 lg:pr-3.5">
        <Logo className="shrink-0" />

        {/* Desktop links (lg and up) */}
        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-11 lg:flex"
        >
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={linkClass}
              onPointerEnter={mouseOnly(() => setOpen(false))}
            >
              {l.label}
            </Link>
          ))}

          <button
            type="button"
            aria-expanded={open}
            aria-controls="company-menu"
            onPointerEnter={mouseOnly(() => {
              hovered.current = true;
              setOpen(true);
            })}
            onClick={() => setOpen((o) => (hovered.current ? true : !o))}
            className={`${linkClass} ${open ? "text-primary" : ""}`}
          >
            Company
            <ChevronDown
              className={`size-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* Get started: desktop only. On mobile the bar is just the menu button. */}
          <Link
            href="#pricing"
            className="hidden items-center gap-3 whitespace-nowrap rounded-lg bg-primary py-[5px] pl-3.5 pr-[5px] text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 lg:inline-flex"
          >
            Get started
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-background">
              <ArrowRight className="size-3.5 text-foreground" aria-hidden="true" />
            </span>
          </Link>

          {/* Mobile and tablet menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="grid size-[38px] place-items-center rounded-[9px] border border-border transition-colors hover:bg-foreground/10 lg:hidden"
            >
              <Menu className="size-[18px]" aria-hidden="true" />
            </SheetTrigger>

            <SheetContent
              side="right"
              data-lenis-prevent
              className="flex w-[min(400px,100vw)]! max-w-none! flex-col gap-0 border-border bg-popover p-0"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>

              {/* Header (leaves room for the built-in close button) */}
              <div className="flex h-[70px] shrink-0 items-center border-b border-border pl-5 pr-16">
                <Logo onClick={closeMenu} />
              </div>

              {/* Links */}
              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pb-6 pt-2">
                <ul>
                  {links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        onClick={closeMenu}
                        className="group flex items-center justify-between border-b border-border py-5 font-display text-[clamp(26px,7.5vw,32px)] leading-none tracking-[-.03em] text-[#F3F1EC]"
                      >
                        {l.label}
                        <ArrowRight
                          className="size-5 shrink-0 text-muted-foreground transition-transform group-active:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="mb-3 mt-8 text-[11px] uppercase tracking-[.2em] text-muted-foreground">
                  Company
                </p>
                <ul className="grid grid-cols-2 gap-3">
                  {pages.map((p) => (
                    <li key={p.label}>
                      <Link
                        href={p.href}
                        onClick={closeMenu}
                        className="block rounded-xl border border-border px-4 py-3.5 text-[15px] transition-colors active:bg-foreground/10"
                      >
                        {p.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Get started: full width, thumb-friendly, clear of the iPhone home bar */}
              <div className="shrink-0 border-t border-border p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <Link
                  href="#pricing"
                  onClick={closeMenu}
                  className="flex h-14 w-full items-center justify-between whitespace-nowrap rounded-xl bg-primary pl-5 pr-2 text-base font-semibold text-primary-foreground transition-colors active:bg-primary/90"
                >
                  Get started
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-background">
                    <ArrowRight className="size-[18px] text-foreground" aria-hidden="true" />
                  </span>
                </Link>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Questions? support@vitalyzer.com
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Company panel (lg and up). Expands the navbar itself, like the reference. */}
      <div
        id="company-menu"
        className={`hidden grid-rows-[0fr] transition-[grid-template-rows,visibility] duration-300 ease-out lg:grid ${
          open ? "visible grid-rows-[1fr]" : "invisible"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div data-lenis-prevent className="max-h-[calc(100svh-110px)] overflow-y-auto">
            <div className="grid gap-8 border-t border-border p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-10 lg:p-8">
              {/* Pages */}
              <div>
                <p className="mb-6 flex items-center gap-2 text-xs tracking-[.14em] text-muted-foreground before:size-[5px] before:bg-primary">
                  Pages
                </p>
                <ul className="grid gap-y-6">
                  {pages.map((p) => (
                    <li key={p.label}>
                      <Link href={p.href} onClick={() => setOpen(false)} className="group block">
                        <span className="block text-base font-medium transition-colors group-hover:text-primary">
                          {p.label}
                        </span>
                        <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                          {p.desc}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Journal cards */}
              <div>
                <p className="mb-6 flex items-center gap-2 text-xs tracking-[.14em] text-muted-foreground before:size-[5px] before:bg-primary">
                  From the journal
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {stories.map((s) => (
                    <Link
                      key={s.title}
                      href={s.href}
                      onClick={() => setOpen(false)}
                      data-cursor="media"
                      className="group relative flex aspect-[4/3.1] flex-col justify-end overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
                    >
                      <div className="absolute inset-0" style={gridStyle} aria-hidden="true" />
                      <svg
                        viewBox="0 0 400 220"
                        preserveAspectRatio="none"
                        className="absolute inset-0 size-full"
                        aria-hidden="true"
                      >
                        <polyline
                          points={s.points}
                          fill="none"
                          stroke={s.stroke}
                          strokeWidth="2"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"
                        aria-hidden="true"
                      />
                      <div className="relative">
                        <h3 className="text-[17px] font-semibold leading-snug">{s.title}</h3>
                        <span className="mt-3 flex items-center justify-between text-xs tracking-wide text-muted-foreground">
                          Read more
                          <ArrowRight
                            className="size-4 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}