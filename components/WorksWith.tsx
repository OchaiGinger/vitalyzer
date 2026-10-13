type Entry = {
  name: string;
  /** Optional real logo, e.g. "/logos/garmin.svg". Without it the name is set as a text wordmark. */
  logo?: string;
};

// Placeholder lists. Only keep the devices and apps Vitalyzer actually supports.
const DEVICES: Entry[] = [
  { name: "Apple Watch" },
  { name: "Garmin" },
  { name: "Fitbit" },
  { name: "Oura" },
  { name: "Whoop" },
  { name: "Galaxy Watch" },
  { name: "Withings" },
  { name: "Polar" },
  { name: "Amazfit" },
  { name: "Coros" },
];

const APPS: Entry[] = [
  { name: "Apple Health" },
  { name: "Health Connect" },
  { name: "Strava" },
  { name: "Garmin Connect" },
  { name: "Polar Flow" },
  { name: "Zwift" },
  { name: "TrainingPeaks" },
  { name: "MyFitnessPal" },
  { name: "Suunto" },
  { name: "Samsung Health" },
];

// Gives plain text names a little logo-like variety
const VARIANTS = [
  "font-display font-semibold tracking-[-.02em]",
  "font-serif tracking-[-.02em]",
  "font-display font-bold tracking-[-.04em]",
  "font-display font-light tracking-[.04em]",
];

function Group({ items, hidden }: { items: Entry[]; hidden?: boolean }) {
  // Repeated so one group is always wider than the screen, which keeps the loop seamless
  const list = [...items, ...items];
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-[var(--gap)] pr-[var(--gap)]"
    >
      {list.map((item, i) => (
        <li
          key={`${item.name}-${i}`}
          data-cursor="default"
          className="shrink-0 whitespace-nowrap text-[clamp(20px,1.9vw,28px)] leading-none text-[#F3F1EC]/80"
        >
          {item.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.logo} alt={item.name} className="h-6 w-auto opacity-80 sm:h-7" />
          ) : (
            <span className={VARIANTS[i % VARIANTS.length]}>{item.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function Row({
  items,
  reverse,
  duration,
}: {
  items: Entry[];
  reverse?: boolean;
  duration: number;
}) {
  return (
    <div className="marquee overflow-hidden py-3">
      <div
        className={`marquee-track ${reverse ? "reverse" : ""}`}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <Group items={items} />
        <Group items={items} hidden />
      </div>
    </div>
  );
}

export default function WorksWith() {
  return (
    <section
      id="devices"
      aria-labelledby="works-with-heading"
      className="mx-auto w-full max-w-[1480px] bg-ink px-[clamp(20px,3.2vw,48px)] pb-[clamp(72px,10vw,140px)]"
    >
      <div className="border-t border-border pt-[clamp(40px,6vw,80px)]">
        <h2
          id="works-with-heading"
          className="font-display text-[clamp(22px,1.9vw,28px)] font-medium tracking-[-.01em] text-[#F3F1EC]"
        >
          Works with what you already wear
        </h2>

        {/* Hover (or press and hold on touch) pauses both rows */}
        <div className="marquees mt-[clamp(32px,5vw,64px)] space-y-3 sm:space-y-5">
          <Row items={DEVICES} duration={50} />
          <Row items={APPS} duration={58} reverse />
        </div>
      </div>
    </section>
  );
}