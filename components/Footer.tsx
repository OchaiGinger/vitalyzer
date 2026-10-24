import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/* ---------- Replace links and details with your real ones ---------- */

const COLUMNS = [
  {
    title: "Site",
    links: [
      { label: "Capabilities", href: "#capabilities" },
      { label: "Performance", href: "#performance" },
      { label: "Team", href: "#team" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Data and security", href: "/security" },
    ],
  },
];

const FOOTER_STATS = [
  { label: "Sync reliability", value: "99.98%" },
  { label: "Devices supported", value: "40+" },
];

/* Text that slides up to reveal a copy of itself on hover */
function Roll({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-block overflow-hidden align-top text-[clamp(16px,1.3vw,18px)] leading-[1.45] outline-none focus-visible:underline"
    >
      <span className="relative block transition-transform duration-300 ease-out group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none">
        <span className="block">{children}</span>
        <span aria-hidden="true" className="absolute left-0 top-full block">
          {children}
        </span>
      </span>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="overflow-hidden rounded-[20px] bg-[#e9a23b] text-[#141414]">
        <div className="mx-auto w-full max-w-[1480px] px-[clamp(20px,3.2vw,48px)] pt-[clamp(40px,5vw,72px)]">
          {/* Top: statement, stats, call to action */}
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-x-16">
            <div>
              <h2 className="font-display text-[clamp(36px,5vw,76px)] font-normal leading-[1.05] tracking-[-.04em]">
                Health data is complicated.
                <br />
                <span className="text-[#141414]/60">Vitalyzer keeps it plain.</span>
              </h2>
              <p className="mt-10 max-w-[34ch] text-[15px] leading-snug">
                Connect your devices and see what your body has been telling you. Questions first? Write to us.
              </p>
            </div>

            <div className="flex flex-col justify-between gap-10 lg:items-end">
              <dl className="w-full max-w-[420px] font-mono text-xs uppercase tracking-[.14em]">
                {FOOTER_STATS.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-6 py-2">
                    <dt>{s.label}</dt>
                    <dd className="text-sm">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/contact"
                className="group inline-flex w-fit items-center gap-3 rounded-lg bg-[#141414] py-2 pl-4 pr-2 text-sm font-medium text-[#F3F1EC] transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
              >
                Get in touch
                <span className="grid size-7 place-items-center rounded-md bg-[#F3F1EC] text-[#141414] transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-[clamp(40px,5vw,72px)] border-t border-[#141414]/20" />

          {/* Middle: contact and sitemap */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-[clamp(36px,4vw,56px)] lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div className="col-span-2 lg:col-span-1">
              <h3 className="font-mono text-xs uppercase tracking-[.14em]">Support</h3>
              <ul className="mt-8 space-y-3 font-mono text-sm">
                <li>emmanuel@vitalyzer.org</li>
                <li>support@vitalyzer.org</li>
                <li className="flex items-center gap-2 pt-1 text-xs uppercase tracking-[.14em] before:size-[6px] before:animate-pulse before:bg-[#141414] motion-reduce:before:animate-none">
                  All systems operational
                </li>
              </ul>
            </div>

            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="font-mono text-xs uppercase tracking-[.14em]">{col.title}</h3>
                <ul className="mt-8 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Roll href={l.href}>{l.label}</Roll>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="border-t border-[#141414]/20" />

          {/* Bottom: legal line */}
          <div className="flex flex-col gap-3 py-6 font-mono text-xs uppercase tracking-[.14em] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Vitalyzer, Inc.</p>
            <p className="normal-case tracking-normal sm:max-w-[60ch] sm:text-right">
              Vitalyzer provides wellness insights, not medical advice. Talk to a clinician about health concerns.
            </p>
          </div>
        </div>

        {/* Oversized wordmark, cropped by the bottom edge */}
        <p
          aria-hidden="true"
          className="-mb-[.13em] select-none whitespace-nowrap text-center font-display text-[clamp(88px,22vw,360px)] font-medium leading-[.8] tracking-[-.05em]"
        >
          Vitalyzer
        </p>
      </div>
    </footer>
  );
}