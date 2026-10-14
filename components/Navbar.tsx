"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
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
  { href: "#", label: "Contact", desc: "Write to us and a person replies." },
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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const hovered = useRef(false);

  const mouseOnly =
    (fn: () => void) => (e: React.PointerEvent) => {
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
      <div className="relative flex h-[54px] items-center justify-between pl-2 pr-3.5">
        <Link
          href="#top"
          aria-label="Vitalyzer home"
          className="flex items-center gap-3 font-serif text-[24px] leading-none tracking-[-.03em] sm:text-[26px]"
        >
          <span className="grid size-[34px] place-items-center rounded-[9px] border border-border bg-card">
            <svg viewBox="0 0 60 52" className="h-auto w-[17px]" aria-hidden="true">
              <path d="M0 0H18L30 26V52Z" fill="#e9a23b" />
              <path d="M60 0H42L30 26V52Z" fill="#f2bd6a" />
            </svg>
          </span>
          vitalyzer
        </Link>

        {/* Desktop links */}
        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex lg:gap-11"
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

        <div className="flex items-center gap-2.5">
          <Button
            className="group hidden h-auto gap-3 rounded-lg bg-primary px-[5px] py-[5px] text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_transparent] transition-all hover:bg-[#f0a84f] hover:shadow-[0_0_0_1px_var(--primary)] md:inline-flex"
          >
            <Link href="#pricing" className="flex items-center gap-3 pl-3.5">
              Get started
              <span className="grid size-7 place-items-center rounded-md bg-background/20 transition-colors group-hover:bg-background/30">
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </Link>
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              className="size-[38px] rounded-[9px] bg-transparent md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent
              side="right"
              data-lenis-prevent
              className="w-[min(320px,86vw)] border-border bg-popover p-0"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav aria-label="Mobile" className="mt-14 flex flex-col px-3">
                {links.map((l) => (
                  <SheetClose  key={l.label}>
                    <Link href={l.href} className="border-b border-border px-3 py-3.5 text-base">
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
                <p className="px-3 pb-1 pt-5 text-xs tracking-wide text-muted-foreground">Company</p>
                {pages.map((p) => (
                  <SheetClose  key={p.label}>
                    <Link
                      href={p.href}
                      className="border-b border-border px-3 py-3.5 text-[15px] text-[#cfc4b0]"
                    >
                      {p.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose >
                  <Link href="#pricing" className="px-3 py-4 text-base font-semibold text-primary">
                    Get started
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Company panel (md and up). Expands the navbar itself, like the reference. */}
      <div
        id="company-menu"
        className={`hidden grid-rows-[0fr] transition-[grid-template-rows,visibility] duration-300 ease-out md:grid ${
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
                <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-1 lg:gap-y-6">
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

              {/* Journal cards (lg and up) */}
              <div className="hidden lg:block">
                <p className="mb-6 flex items-center gap-2 text-xs tracking-[.14em] text-muted-foreground before:size-[5px] before:bg-primary">
                  From the journal
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {stories.map((s) => (
                    <Link
                      key={s.title}
                      href={s.href}
                      onClick={() => setOpen(false)}
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