"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import Eyebrow from "./Eyebrow";

const TYPES = ["Support", "Partnerships", "Press", "Everything else"];

const DETAILS: [label: string, value: string, href?: string][] = [
  ["Support", "support@vitalyzer.org", "mailto:support@vitalyzer.org"],
  ["Partnerships", "emmanuel@vitalyzer.org", "mailto:emmanuel@vitalyzer.org"],
  ["Reply time", "Within 1 business day"],
];

const DEVICES = ["Apple Watch", "Garmin", "Fitbit", "Oura", "Whoop", "Galaxy Watch", "Other", "None yet"];

const fieldClass =
  "h-[50px] w-full rounded-lg border border-border bg-transparent px-4 text-[15px] text-[#F3F1EC] placeholder:text-muted-foreground transition-colors hover:border-foreground/30 focus-visible:border-primary focus-visible:outline-none";

const groupLabel = "mb-4 text-[11px] uppercase tracking-[.2em] text-muted-foreground";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-[1480px] scroll-mt-4 px-[clamp(20px,3.2vw,48px)] pb-[clamp(72px,10vw,140px)] pt-[clamp(24px,4vw,60px)]"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1fr)] lg:gap-x-16">
        {/* Left */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="mt-8 font-display text-[clamp(32px,3.6vw,58px)] font-normal leading-[1.06] tracking-[-.035em] text-[#F3F1EC]">
            Tell us what you need.
            <br />
            <span className="text-[#8c8981]">A person replies.</span>
          </h2>
          <p className="mt-8 max-w-[36ch] text-[15px] leading-snug text-muted-foreground">
            A question about a reading, a device, or working together? Write to us and we will take it from there.
            No form queue, no bots.
          </p>

          <dl className="mt-12 max-w-[420px] border-t border-border">
            {DETAILS.map(([label, value, href]) => (
              <div key={label} className="flex items-center justify-between gap-6 border-b border-border py-4">
                <dt className="text-[11px] uppercase tracking-[.18em] text-muted-foreground">{label}</dt>
                <dd className="text-right text-[15px] text-[#F3F1EC]">
                  {href ? (
                    <a href={href} className="transition-colors hover:text-primary">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: form */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
          <h3 className="flex items-center gap-3 font-display text-[clamp(22px,2vw,30px)] font-normal tracking-[-.01em] text-[#F3F1EC]">
            <span aria-hidden="true" className="size-3 bg-primary" />
            Send us a note.
          </h3>

          {status === "sent" ? (
            <div role="status" className="mt-12 rounded-xl border border-primary/40 p-6">
              <p className="font-display text-xl text-[#F3F1EC]">Thanks, we have your note.</p>
              <p className="mt-2 text-[15px] text-muted-foreground">We will reply within one business day.</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStatus("idle")}
                className="mt-6 h-11 rounded-lg bg-transparent px-5"
              >
                Send another
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-12" noValidate={false}>
              {/* Inquiry type */}
              <fieldset className="border-0 p-0">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <legend className="p-0 text-[11px] uppercase tracking-[.2em] text-muted-foreground">
                    Inquiry type
                  </legend>
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-[11px] uppercase tracking-[.14em] text-muted-foreground transition-colors hover:text-[#F3F1EC]"
                  >
                    Looking for careers? <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
                <div className="flex flex-wrap gap-3">
                  {TYPES.map((t, i) => (
                    <label key={t} className="cursor-pointer">
                      <input type="radio" name="type" value={t} defaultChecked={i === 0} className="peer sr-only" />
                      <span className="block rounded-lg border border-border px-4 py-2.5 text-sm transition-colors hover:border-foreground/40 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* About you */}
              <p className={`mt-10 ${groupLabel}`}>About you</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="firstName" required autoComplete="given-name" placeholder="First name" aria-label="First name" className={fieldClass} />
                <input name="lastName" autoComplete="family-name" placeholder="Last name" aria-label="Last name" className={fieldClass} />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email"
                  aria-label="Email"
                  className={`${fieldClass} sm:col-span-2`}
                />
              </div>

              {/* Device */}
              <p className={`mt-10 ${groupLabel}`}>About your setup</p>
              <div className="relative">
                <select
                  name="device"
                  defaultValue=""
                  aria-label="Device you use"
                  className={`${fieldClass} appearance-none pr-10 invalid:text-muted-foreground`}
                >
                  <option value="" disabled>
                    Device you use
                  </option>
                  {DEVICES.map((d) => (
                    <option key={d} value={d} className="bg-card text-[#F3F1EC]">
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>

              {/* Message */}
              <p className={`mt-10 ${groupLabel}`}>Your message</p>
              <textarea
                name="message"
                required
                minLength={5}
                rows={6}
                placeholder="Tell us what you are seeing, the device you use, and what you would like to know."
                aria-label="Your message"
                className={`${fieldClass} h-auto min-h-[150px] resize-y py-3.5 leading-relaxed`}
              />

              {/* Honeypot: real people never fill this in */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-6 sm:flex-row sm:items-center">
                <p className="text-[11px] uppercase tracking-[.18em] text-muted-foreground">
                  A real person reads every message
                </p>
                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="h-auto gap-4 rounded-lg py-[5px] pl-5 pr-[5px] text-sm font-semibold"
                >
                  {status === "sending" ? "Sending…" : "Submit"}
                  <span className="grid size-9 place-items-center rounded-md bg-background">
                    <ArrowRight className="size-4 text-foreground" aria-hidden="true" />
                  </span>
                </Button>
              </div>

              {status === "error" && (
                <p role="alert" className="mt-6 text-sm text-destructive">
                  Something went wrong. Please email support@vitalyzer.com instead.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}